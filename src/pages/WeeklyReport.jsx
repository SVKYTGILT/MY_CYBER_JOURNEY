import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { supabase, getCurrentUser } from '../lib/supabaseClient';
import { addXp } from '../utils/xp';
import {
  getStartOfWeekIso,
  getWeekDateKey,
} from '../utils/dates';

export default function WeeklyReport() {
  const [reports, setReports] = useState([]);

  const [weekTitle, setWeekTitle] = useState('');
  const [hours, setHours] = useState('');
  const [labs, setLabs] = useState('');
  const [summary, setSummary] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [challenges, setChallenges] = useState([]);
  const [claims, setClaims] = useState([]);
  const [claimLoading, setClaimLoading] = useState(null);
  const [weeklyMilestones, setWeeklyMilestones] = useState(0);
  const [weeklyStudyDays, setWeeklyStudyDays] = useState(0);
  const [weeklyTests, setWeeklyTests] = useState(0);

  // ==========================================
  // LOAD USER'S WEEKLY REPORTS
  // ==========================================

  useEffect(() => {
    loadReports();
    loadChallenges();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const { data, error: reportsError } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      setReports(data || []);
    } catch (error) {
      console.error('Error loading weekly reports:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WEEKLY CHALLENGES & PROGRESS
  // ==========================================

  const loadChallenges = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) return;

      const { data: challengeData, error: challengeError } =
        await supabase
          .from('challenges')
          .select('*')
          .eq('active', true);

      if (challengeError) throw challengeError;

      setChallenges(challengeData || []);

      const weekStart = getStartOfWeekIso();
      const weekKey = getWeekDateKey();

      const { data: claimData, error: claimError } =
        await supabase
          .from('challenge_claims')
          .select('challenge_id')
          .eq('user_id', user.id)
          .eq('week_start', weekKey);

      if (claimError) throw claimError;

      setClaims((claimData || []).map((c) => c.challenge_id));

      const { data: milestoneData, error: milestoneError } =
        await supabase
          .from('roadmap_progress')
          .select('milestone_id')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('completed_at', weekStart);

      if (milestoneError) throw milestoneError;

      setWeeklyMilestones((milestoneData || []).length);

      const { data: studyData, error: studyError } =
        await supabase
          .from('study_activity')
          .select('activity_date')
          .eq('user_id', user.id)
          .gte('activity_date', weekStart);

      if (studyError) throw studyError;

      const studyDays = new Set(
        (studyData || []).map((s) => s.activity_date)
      ).size;

      setWeeklyStudyDays(studyDays);

      const { data: testData, error: testError } = await supabase
        .from('test_scores')
        .select('pct')
        .eq('user_id', user.id)
        .gte('date', weekStart);

      if (testError) throw testError;

      const testsPassed = (testData || []).filter(
        (t) => t.pct >= 60
      ).length;

      setWeeklyTests(testsPassed);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const computeChallengeProgress = (type) => {
    if (type === 'milestones') return weeklyMilestones;
    if (type === 'study_days') return weeklyStudyDays;
    if (type === 'tests') return weeklyTests;
    return 0;
  };

  // ==========================================
  // CLAIM CHALLENGE REWARD
  // ==========================================

  const handleClaimChallenge = async (challenge) => {
    try {
      setError('');
      setClaimLoading(challenge.id);

      const user = await getCurrentUser();

      if (!user) throw new Error('You must be logged in.');

      const { error: claimError } = await supabase
        .from('challenge_claims')
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
          week_start: getWeekDateKey(),
        });

      if (claimError) throw claimError;

      await addXp(user.id, challenge.xp_reward);

      setClaims((current) => [...current, challenge.id]);
    } catch (error) {
      console.error('Error claiming challenge:', error);
      setError(error.message || 'Failed to claim challenge.');
    } finally {
      setClaimLoading(null);
    }
  };

  // ==========================================
  // EXPORT REPORT TO PDF
  // ==========================================

  const exportReportPdf = (report) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Cyber Journey - Weekly Report', 14, 22);

    doc.setFontSize(12);
    doc.text(`Title: ${report.week_title}`, 14, 36);
    doc.text(`Date: ${formatDate(report.created_at)}`, 14, 44);
    doc.text(`Hours Studied: ${report.hours}`, 14, 52);
    doc.text(`Labs Completed: ${report.labs}`, 14, 60);

    doc.setFontSize(13);
    doc.text('Summary:', 14, 74);

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(report.summary || '', 180);
    doc.text(lines, 14, 82);

    doc.save(`weekly-report-${report.week_title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  // ==========================================
  // ADD WEEKLY REPORT
  // ==========================================

  const handleAddReport = async (e) => {
    e.preventDefault();

    if (!weekTitle.trim() || !summary.trim()) return;

    setSaving(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You must be logged in to create a report.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('weekly_reports')
        .insert([
          {
            user_id: user.id,
            week_title: weekTitle.trim(),
            hours: Number(hours) || 0,
            labs: Number(labs) || 0,
            summary: summary.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Put newest report at the top
      setReports((currentReports) => [
        data,
        ...currentReports,
      ]);

      // Clear form
      setWeekTitle('');
      setHours('');
      setLabs('');
      setSummary('');
    } catch (error) {
      console.error('Error adding weekly report:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE REPORT
  // ==========================================

  const handleDeleteReport = async (id) => {
    try {
      setError('');

      const { error: deleteError } = await supabase
        .from('weekly_reports')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setReports((currentReports) =>
        currentReports.filter((report) => report.id !== id)
      );
    } catch (error) {
      console.error('Error deleting weekly report:', error);
      setError(error.message);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="glass-card p-8 rounded-2xl text-center">
          <p className="text-pink-300">
            Loading your weekly reports...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Weekly Reports
        </h1>

        <p className="text-gray-400">
          Track your weekly study hours, completed labs, and progress summaries.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* Weekly Challenges */}
      <div className="glass-card p-6 rounded-2xl mb-10">

        <h2 className="text-xl font-semibold mb-1 text-pink-300">
          ⚔️ Weekly Challenges
        </h2>

        <p className="text-sm text-gray-400 mb-5">
          Complete challenges this week to earn bonus XP.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {challenges.map((challenge) => {

            const progress = computeChallengeProgress(challenge.type);
            const pct = Math.min(100, Math.round((progress / challenge.target) * 100));
            const complete = progress >= challenge.target;
            const claimed = claims.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`p-5 rounded-2xl border ${
                  complete
                    ? 'bg-green-500/10 border-green-400/30'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white">
                    {challenge.title}
                  </h3>
                  <span className="text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-400/30 px-2.5 py-1 rounded-full">
                    +{challenge.xp_reward} XP
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  {challenge.description}
                </p>

                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10 mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      complete
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                        : 'bg-gradient-to-r from-rose-400 to-pink-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  {progress} / {challenge.target}
                </p>

                {claimed ? (
                  <span className="block text-center text-xs font-bold text-green-300 bg-green-500/10 border border-green-400/30 px-3 py-2 rounded-xl">
                    ✓ Claimed
                  </span>
                ) : complete ? (
                  <button
                    onClick={() => handleClaimChallenge(challenge)}
                    disabled={claimLoading === challenge.id}
                    className="w-full text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white px-3 py-2 rounded-xl transition-all"
                  >
                    {claimLoading === challenge.id
                      ? 'Claiming...'
                      : `Claim +${challenge.xp_reward} XP`}
                  </button>
                ) : (
                  <span className="block text-center text-xs font-semibold text-gray-500 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    🔒 Keep going
                  </span>
                )}
              </div>
            );
          })}

        </div>

      </div>

      {/* Add Weekly Report Form */}
      <form
        onSubmit={handleAddReport}
        className="glass-card p-6 rounded-2xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-pink-300">
          Add New Weekly Report
        </h2>

        {/* Week Title */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Week Title / Focus
          </label>

          <input
            type="text"
            value={weekTitle}
            onChange={(e) => setWeekTitle(e.target.value)}
            placeholder="e.g., Week 2: Web Vulnerabilities & Burp Suite"
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
            required
          />
        </div>

        {/* Hours + Labs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Hours Studied
            </label>

            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g., 12"
              className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Labs Completed
            </label>

            <input
              type="number"
              min="0"
              value={labs}
              onChange={(e) => setLabs(e.target.value)}
              placeholder="e.g., 5"
              className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
            />
          </div>

        </div>

        {/* Summary */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Weekly Summary / Key Takeaways
          </label>

          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe what you learned, challenges faced, and goals achieved..."
            rows="4"
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300 resize-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-rose-500/25"
        >
          {saving ? 'Saving...' : 'Add Weekly Report'}
        </button>

      </form>

      {/* Reports List */}
      <div>

        <h2 className="text-2xl font-semibold mb-6 text-pink-300">
          Your Reports ({reports.length})
        </h2>

        {reports.length === 0 ? (

          <div className="glass-card p-8 rounded-2xl text-center">
            <p className="text-gray-500 italic">
              No weekly reports added yet. Create your first report above!
            </p>
          </div>

        ) : (

          <div className="space-y-6">

            {reports.map((report) => (

              <div
                key={report.id}
                className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >

                <div className="flex-1">

                  {/* Title + Date */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">

                    <h3 className="text-lg font-bold text-white">
                      {report.week_title}
                    </h3>

                    <span className="text-xs text-gray-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-pink-500/20">
                      {formatDate(report.created_at)}
                    </span>

                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 my-2 text-sm">

                    <span className="text-pink-300 bg-pink-900/30 px-3 py-1 rounded-lg border border-pink-500/20">
                      ⏱️ {report.hours} Hours Studied
                    </span>

                    <span className="text-cyan-200 bg-cyan-900/30 px-3 py-1 rounded-lg border border-cyan-400/20">
                      💻 {report.labs} Labs Completed
                    </span>

                  </div>

                  {/* Summary */}
                  <p className="text-gray-300 text-sm whitespace-pre-wrap mt-3 leading-relaxed">
                    {report.summary}
                  </p>

                </div>

                {/* Delete / Export */}
                <div className="flex md:flex-col justify-end pt-4 md:pt-0 border-t md:border-t-0 border-pink-500/10 w-full md:w-auto gap-2">

                  <button
                    onClick={() => exportReportPdf(report)}
                    className="text-cyan-200 hover:text-cyan-100 text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 justify-center"
                  >
                    ⬇️ Export PDF
                  </button>

                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 justify-center"
                  >
                    Delete Report
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

