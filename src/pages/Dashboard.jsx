import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  getXp,
  addXp,
  XP_AWARDS,
  levelFromXp,
  levelTitle,
  xpProgressToNextLevel,
} from '../utils/xp';
import {
  getStartOfWeekIso,
} from '../utils/dates';

export default function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [certificationCount, setCertificationCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [studiedToday, setStudiedToday] = useState(false);
  const [activities, setActivities] = useState([]);

  const [xp, setXp] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [weeklyTopics, setWeeklyTopics] = useState(0);
  const [hoursGoal, setHoursGoal] = useState(10);
  const [topicsGoal, setTopicsGoal] = useState(5);
  const [hoursInput, setHoursInput] = useState(10);
  const [topicsInput, setTopicsInput] = useState(5);
  const [savingGoals, setSavingGoals] = useState(false);

  const [loading, setLoading] = useState(true);
  const [markingStudy, setMarkingStudy] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      // ==========================================
      // ROADMAP PROGRESS
      // ==========================================

      const {
        data: roadmapData,
        error: roadmapError,
      } = await supabase
        .from('roadmap_progress')
        .select('milestone_id, completed')
        .eq('user_id', user.id);

      if (roadmapError) {
        console.error('Roadmap progress error:', roadmapError);
        throw roadmapError;
      }

      const totalTopics = 20;

      const completedTopics =
        roadmapData?.filter(
          (item) =>
            item.milestone_id &&
            String(item.milestone_id).startsWith('t') &&
            item.completed === true
        ).length || 0;

      const calculatedProgress =
        totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0;

      setProgress(calculatedProgress);

      // ==========================================
      // CERTIFICATIONS
      // ==========================================

      const {
        count,
        error: certificationError,
      } = await supabase
        .from('certifications')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('user_id', user.id);

      if (certificationError) throw certificationError;

      setCertificationCount(count || 0);

      // ==========================================
      // STUDY ACTIVITY
      // ==========================================

      const {
        data: activityData,
        error: activityError,
      } = await supabase
        .from('study_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .order('activity_date', {
          ascending: false,
        });

      if (activityError) throw activityError;

      // Check whether user studied today
      const today = getLocalDateString();

      const studiedTodayResult =
        activityData?.some(
          (activity) => activity.activity_date === today
        ) || false;

      setStudiedToday(studiedTodayResult);

      // Calculate streak
      const streak = calculateStudyStreak(activityData || []);

      setStudyStreak(streak);

      setActivities(activityData || []);

      await loadExtras(user.id);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD XP, GOALS & WEEKLY PROGRESS
  // ==========================================

  const loadExtras = async (userId) => {
    try {
      const currentXp = await getXp(userId);
      setXp(currentXp);
    } catch (error) {
      console.error('Error loading xp:', error);
    }

    try {
      const { data, error: goalsError } = await supabase
        .from('user_goals')
        .select('weekly_hours_goal, weekly_topics_goal')
        .eq('user_id', userId)
        .maybeSingle();

      if (goalsError) throw goalsError;

      if (data) {
        setHoursGoal(data.weekly_hours_goal ?? 10);
        setTopicsGoal(data.weekly_topics_goal ?? 5);
        setHoursInput(data.weekly_hours_goal ?? 10);
        setTopicsInput(data.weekly_topics_goal ?? 5);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }

    const weekStart = getStartOfWeekIso();

    try {
      const { data, error: hoursError } = await supabase
        .from('weekly_reports')
        .select('hours')
        .eq('user_id', userId)
        .gte('created_at', weekStart);

      if (hoursError) throw hoursError;

      const totalHours = (data || []).reduce(
        (sum, report) => sum + (report.hours || 0),
        0
      );

      setWeeklyHours(totalHours);
    } catch (error) {
      console.error('Error loading weekly hours:', error);
    }

    try {
      const { data, error: topicsError } = await supabase
        .from('roadmap_progress')
        .select('milestone_id')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('completed_at', weekStart);

      if (topicsError) throw topicsError;

      setWeeklyTopics((data || []).length);
    } catch (error) {
      console.error('Error loading weekly topics:', error);
    }
  };

  // ==========================================
  // SAVE WEEKLY GOALS
  // ==========================================

  const handleSaveGoals = async () => {
    setSavingGoals(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('You must be logged in.');

      const newHoursGoal = Math.max(1, Number(hoursInput) || 10);
      const newTopicsGoal = Math.max(1, Number(topicsInput) || 5);

      const { error: upsertError } = await supabase
        .from('user_goals')
        .upsert(
          {
            user_id: user.id,
            weekly_hours_goal: newHoursGoal,
            weekly_topics_goal: newTopicsGoal,
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      setHoursGoal(newHoursGoal);
      setTopicsGoal(newTopicsGoal);
      setError('');
    } catch (error) {
      console.error('Error saving goals:', error);
      setError(error.message || 'Failed to save goals.');
    } finally {
      setSavingGoals(false);
    }
  };

  // ==========================================
  // GET LOCAL DATE
  // ==========================================

  const getLocalDateString = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // MARK TODAY AS STUDIED
  // ==========================================

  const handleMarkStudied = async () => {
    if (studiedToday) return;

    setMarkingStudy(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error('You must be logged in.');
      }

      const today = getLocalDateString();

      const { error: insertError } = await supabase
        .from('study_activity')
        .insert([
          {
            user_id: user.id,
            activity_date: today,
          },
        ]);

      // Duplicate today's activity
      if (insertError) {
        if (insertError.code === '23505') {
          setStudiedToday(true);
          await loadDashboardData();
          return;
        }

        throw insertError;
      }

      setStudiedToday(true);

      // Award XP for the study day
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const newXp = await addXp(user.id, XP_AWARDS.STUDY_DAY);
          setXp(newXp);
        }
      } catch (error) {
        console.error('Error awarding study xp:', error);
      }

      // Reload dashboard so streak updates immediately
      await loadDashboardData();
    } catch (error) {
      console.error('Error marking study activity:', error);
      setError(error.message || 'Failed to save study activity.');
    } finally {
      setMarkingStudy(false);
    }
  };

  // ==========================================
  // CALCULATE REAL STUDY STREAK
  // ==========================================

  const calculateStudyStreak = (activities) => {
    if (!activities || activities.length === 0) {
      return 0;
    }

    const dates = activities
      .map((activity) => activity.activity_date)
      .filter(Boolean);

    if (dates.length === 0) {
      return 0;
    }

    // Remove duplicates
    const uniqueDates = [...new Set(dates)];

    // Sort newest → oldest
    uniqueDates.sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    const today = getLocalDateString();

    // If the latest activity isn't today or yesterday,
    // there is no active streak.
    const latestDate = uniqueDates[0];

    const latest = new Date(`${latestDate}T00:00:00`);
    const currentDay = new Date(`${today}T00:00:00`);

    const differenceFromToday = Math.round(
      (currentDay - latest) /
        (1000 * 60 * 60 * 24)
    );

    if (differenceFromToday > 1) {
      return 0;
    }

    let streak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(
        `${uniqueDates[i]}T00:00:00`
      );

      const previous = new Date(
        `${uniqueDates[i + 1]}T00:00:00`
      );

      const difference = Math.round(
        (current - previous) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // ==========================================
// STUDY HEATMAP
// ==========================================

  const buildHeatmapCells = (activityList) => {
    const counts = {};

    (activityList || []).forEach((activity) => {
      const key = activity.activity_date;
      counts[key] = (counts[key] || 0) + 1;
    });

    const cells = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 15 * 7);
    start.setHours(0, 0, 0, 0);

    for (
      let d = new Date(start);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const key = getLocalDateString(d);
      cells.push({
        date: new Date(d),
        count: counts[key] || 0,
      });
    }

    return cells;
  };

  const heatmapColor = (count) => {
    if (count <= 0) return 'rgba(244, 114, 182, 0.10)';
    if (count === 1) return 'rgba(244, 114, 182, 0.35)';
    if (count === 2) return 'rgba(244, 114, 182, 0.55)';
    if (count === 3) return 'rgba(244, 114, 182, 0.75)';
    return 'rgba(244, 114, 182, 0.95)';
  };

  const heatmapCells = buildHeatmapCells(activities);
  const level = levelFromXp(xp);
  const nextLevel = xpProgressToNextLevel(xp);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-pink-300 text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-white">

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* Welcome Banner */}
      <div className="glass-card p-8 md:p-10 rounded-3xl mb-10 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">

        <div className="relative z-10 flex-1">

          <p className="text-sm uppercase tracking-widest text-pink-300 font-semibold mb-3">
            Day One of the Journey
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, Vasu
          </h1>

          <p className="text-gray-300 text-lg mb-4">
            Target: Top Product Company | 12+ LPA | Class of 2030
          </p>

          <p className="text-rose-200 italic">
            "A shell today, a career tomorrow."
          </p>

        </div>

        {/* Avatar */}
        <div className="relative z-10 flex-shrink-0">

          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-r from-rose-400 via-pink-400 to-cyan-300 shadow-2xl">
<img
  src="/vasu-avatar.jpg"
  alt="Vasu Avatar"
  className="w-full h-full object-cover rounded-full bg-black/50"
/>

          </div>

        </div>

      </div>

      {/* Study Action */}
      <div className="glass-card p-6 rounded-3xl mb-10 flex flex-col md:flex-row justify-between items-center gap-5">

        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Today's Study Activity
          </h2>

          <p className="text-sm text-gray-400">
            {studiedToday
              ? 'You have already logged your study activity today. Keep going!'
              : 'Finished studying today? Mark it to build your streak.'}
          </p>
        </div>

        <button
          onClick={handleMarkStudied}
          disabled={studiedToday || markingStudy}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            studiedToday
              ? 'bg-green-500/20 text-green-300 border border-green-400/30 cursor-default'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/25'
          }`}
        >
          {markingStudy
            ? 'Saving...'
            : studiedToday
              ? '✓ Studied Today'
              : '🔥 Mark Today as Studied'}
        </button>

      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Overall Progress */}
        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">

          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xl font-bold">
            🎯
          </div>

          <div>

            <p className="text-xs text-gray-400 uppercase font-semibold">
              Overall Progress
            </p>

            <h3 className="text-2xl font-bold">
              {progress}%
            </h3>

            <p className="text-xs text-gray-400 mt-0.5">
              Roadmap completion
            </p>

          </div>

        </div>

        {/* Certifications */}
        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">

          <div className="p-4 rounded-2xl bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xl font-bold">
            🏆
          </div>

          <div>

            <p className="text-xs text-gray-400 uppercase font-semibold">
              Certifications
            </p>

            <h3 className="text-2xl font-bold">
              {certificationCount}
            </h3>

            <p className="text-xs text-gray-400 mt-0.5">
              Earned so far
            </p>

          </div>

        </div>

        {/* Study Streak */}
        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">

          <div className="p-4 rounded-2xl bg-cyan-400/20 border border-cyan-300/30 text-cyan-200 text-xl font-bold">
            🔥
          </div>

          <div>

            <p className="text-xs text-gray-400 uppercase font-semibold">
              Study Streak
            </p>

            <h3 className="text-2xl font-bold">
              {studyStreak} Days
            </h3>

            <p className="text-xs text-gray-400 mt-0.5">
              {studiedToday
                ? 'Keep it burning!'
                : 'Start your streak today!'}
            </p>

          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* XP / LEVEL + WEEKLY GOALS */}
      {/* ========================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* XP / Level */}
        <div className="glass-card p-6 rounded-3xl">

          <div className="flex items-center justify-between mb-1">

            <h2 className="text-xl font-semibold text-white">
              🏅 Your Level
            </h2>

            <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">
              {levelTitle(level)}
            </span>

          </div>

          <p className="text-sm text-gray-400 mb-4">
            Level {level} • {xp} XP earned
          </p>

          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10 mb-2">

            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500 shadow-lg shadow-rose-500/40"
              style={{ width: `${nextLevel.pct}%` }}
            />

          </div>

          <p className="text-xs text-gray-400">
            {nextLevel.intoLevel} / {nextLevel.total} XP to Level{' '}
            {nextLevel.nextLevel} ({nextLevel.nextTitle})
          </p>

        </div>

        {/* Weekly Goals */}
        <div className="glass-card p-6 rounded-3xl">

          <h2 className="text-xl font-semibold text-white mb-1">
            🎯 Weekly Goals
          </h2>

          <p className="text-sm text-gray-400 mb-5">
            Set your weekly targets to stay on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">

            <label className="flex-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                Study hours / week
              </span>
              <input
                type="number"
                min="1"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-300"
              />
            </label>

            <label className="flex-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                Milestones / week
              </span>
              <input
                type="number"
                min="1"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-300"
              />
            </label>

            <button
              onClick={handleSaveGoals}
              disabled={savingGoals}
              className="self-end px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
            >
              {savingGoals ? 'Saving...' : 'Save'}
            </button>

          </div>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>⏱️ Hours logged this week</span>
                <span className="font-bold text-white">
                  {weeklyHours}h / {hoursGoal}h
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((weeklyHours / hoursGoal) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>🎓 Milestones completed this week</span>
                <span className="font-bold text-white">
                  {weeklyTopics} / {topicsGoal}
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((weeklyTopics / topicsGoal) * 100))}%`,
                  }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* STUDY HEATMAP */}
      {/* ========================================== */}

      <div className="glass-card p-6 rounded-3xl mb-10">

        <h2 className="text-xl font-semibold text-white mb-1">
          🔥 Study Heatmap
        </h2>

        <p className="text-sm text-gray-400 mb-5">
          Your study activity over the last 16 weeks.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2">

          <div className="flex flex-col gap-1 mr-1">
            {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((label, i) => (
              <span key={i} className="text-[10px] text-gray-500 h-[14px] leading-[14px]">
                {label}
              </span>
            ))}
          </div>

          <div
            className="grid gap-1"
            style={{
              gridTemplateRows: 'repeat(7, 14px)',
              gridAutoFlow: 'column',
              gridAutoColumns: '14px',
            }}
          >
            {heatmapCells.map((cell, index) => (
              <div
                key={index}
                title={`${getLocalDateString(cell.date)}: ${cell.count} study session${cell.count === 1 ? '' : 's'}`}
                className="rounded-[3px]"
                style={{ background: heatmapColor(cell.count) }}
              />
            ))}
          </div>

        </div>

        <div className="flex items-center gap-1.5 mt-4 text-[10px] text-gray-500">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((levelValue) => (
            <div
              key={levelValue}
              className="w-[14px] h-[14px] rounded-[3px]"
              style={{ background: heatmapColor(levelValue) }}
            />
          ))}
          <span>More</span>
        </div>

      </div>

    </div>
  );
}
