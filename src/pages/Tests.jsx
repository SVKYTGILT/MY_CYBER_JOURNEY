import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import QuizModal from '../components/QuizModal';
import {
  testData,
  isTestPassed,
  TEST_PASS_THRESHOLD
} from '../data/testData';
import {
  loadTestScores,
  mergeBestTestScore
} from '../utils/storage';
import {
  loadTestScoresFromDb,
  saveBestScoreToDb,
  recordTestAttempt,
  loadRecentAttempts
} from '../utils/testScoresDb';
import { addXp, XP_AWARDS } from '../utils/xp';
import { initialRoadmapPhases } from '../data/roadmapPhases';

export default function Tests() {
  const [phaseStatus, setPhaseStatus] = useState([]);
  const [bestScores, setBestScores] = useState(() =>
    loadTestScores()
  );
  const [activeTest, setActiveTest] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // LOAD RECENT ATTEMPTS
  // ==========================================

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      const attempts = await loadRecentAttempts(user.id);
      setRecentAttempts(attempts);
    } catch (error) {
      console.error('Error loading attempts:', error);
    }
  };

  // ==========================================
  // LOAD BEST SCORES FROM DATABASE
  // ==========================================

  useEffect(() => {
    loadBestScoresFromDb();
  }, []);

  const loadBestScoresFromDb = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      const dbScores = await loadTestScoresFromDb(user.id);

      setBestScores((localScores) => {
        const merged = { ...localScores };

        Object.entries(dbScores).forEach(([phaseId, score]) => {
          merged[phaseId] = localScores[phaseId] &&
            localScores[phaseId].pct >= score.pct
            ? localScores[phaseId]
            : score;
        });

        return merged;
      });
    } catch (error) {
      console.error('Error loading test scores:', error);
    }
  };

  // ==========================================
  // LOAD PHASE COMPLETION STATUS
  // ==========================================

  useEffect(() => {
    loadPhaseStatus();
  }, []);

  const loadPhaseStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const {
        data,
        error: progressError
      } = await supabase
        .from('roadmap_progress')
        .select('milestone_id, completed')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const completedMilestones = new Set(
        (data || [])
          .filter(
            (item) =>
              typeof item.milestone_id ===
                'string' &&
              item.milestone_id.startsWith('t') &&
              item.completed === true
          )
          .map((item) => item.milestone_id)
      );

      const status = initialRoadmapPhases.map(
        (phase) => {
          const total = phase.topics.length;
          const done = phase.topics.filter(
            (topic) =>
              completedMilestones.has(topic.id)
          ).length;

          return {
            phaseId: phase.id,
            complete: done === total && total > 0,
            completed: done,
            total
          };
        }
      );

      setPhaseStatus(status);
    } catch (err) {
      console.error(
        'Error loading test status:',
        err
      );

      setError(
        err.message ||
          'Failed to load test status.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // START / FINISH TEST
  // ==========================================

  const handleStartTest = (test) => {
    setActiveTest({
      phaseId: test.phaseId,
      title: test.title,
      questions: test.questions
    });
  };

  const handleTestFinish = async (phaseId, score, total) => {
    const next = mergeBestTestScore(
      bestScores,
      phaseId,
      score,
      total
    );

    setBestScores(next);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await saveBestScoreToDb(user.id, phaseId, score, total);
        await recordTestAttempt(user.id, phaseId, score, total);
        await loadAttempts();

        if (isTestPassed(score, total)) {
          try {
            await addXp(user.id, XP_AWARDS.TEST_PASS);
          } catch (error) {
            console.error('Error awarding test xp:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error saving test score:', error);
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const takenCount = testData.filter(
    (test) => bestScores[test.phaseId]
  ).length;

  const passedCount = testData.filter(
    (test) =>
      bestScores[test.phaseId] &&
      isTestPassed(
        bestScores[test.phaseId].score,
        bestScores[test.phaseId].total
      )
  ).length;

  const avgBest =
    takenCount > 0
      ? Math.round(
        testData.reduce(
          (acc, test) =>
            acc + (bestScores[test.phaseId]?.pct || 0),
          0
        ) / takenCount
      )
      : 0;
  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading your tests...
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto text-white">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-200 via-rose-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-md">
          🧪 Test Examiner
        </h1>

        <p className="text-gray-200 drop-shadow">
          Complete every milestone in a phase to unlock its
          exam. Score 60%+ to pass — your best score is saved
          automatically.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

        <div className="bg-black/25 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-xl">📝</div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Tests Taken</p>
            <p className="text-2xl font-bold">{takenCount} / {testData.length}</p>
          </div>
        </div>

        <div className="bg-black/25 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/20 border border-green-400/30 text-xl">🏆</div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Exams Passed</p>
            <p className="text-2xl font-bold">{passedCount} / {testData.length}</p>
          </div>
        </div>

        <div className="bg-black/25 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-400/20 border border-cyan-300/30 text-xl">📊</div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Avg Best Score</p>
            <p className="text-2xl font-bold">{avgBest}%</p>
          </div>
        </div>

      </div>

      {/* RECENT ATTEMPTS */}

      {recentAttempts.length > 0 && (
        <div className="bg-black/25 border border-white/20 p-6 rounded-3xl shadow-2xl mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            📈 Recent Test Attempts
          </h2>

          <div className="space-y-3">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-black/30 border border-white/10"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    Phase {attempt.phase_id} Exam
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(attempt.created_at).toLocaleDateString(
                      undefined,
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}{' '}
                    •{' '}
                    {new Date(attempt.created_at).toLocaleTimeString(
                      [],
                      { hour: '2-digit', minute: '2-digit' }
                    )}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    attempt.passed
                      ? 'bg-green-500/20 border-green-400/40 text-green-300'
                      : 'bg-red-500/20 border-red-400/40 text-red-300'
                  }`}
                >
                  {attempt.score}/{attempt.total} ({attempt.pct}%){' '}
                  {attempt.passed ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TEST CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {testData.map((test) => {

          const status = phaseStatus.find(
            (s) => s.phaseId === test.phaseId
          );

          const unlocked = status?.complete || false;
          const best = bestScores[test.phaseId];
          const passed = best && isTestPassed(best.score, best.total);

          return (
            <div
              key={test.phaseId}
              className={`flex flex-col bg-black/25 border rounded-3xl p-6 shadow-2xl transition-all ${
                unlocked
                  ? 'border-white/20 hover:border-rose-300/50 hover:-translate-y-1'
                  : 'border-white/10 opacity-75'
              }`}
            >

              {/* TOP ROW */}

              <div className="flex items-center justify-between mb-3">

                <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">
                  Phase {test.phaseId} Exam
                </span>

                <span
                  className={`text-[11px] px-3 py-1 rounded-full font-bold border ${
                    !unlocked
                      ? 'bg-gray-500/20 border-gray-400/30 text-gray-300'
                      : passed
                        ? 'bg-green-500/20 border-green-400/40 text-green-300'
                        : best
                          ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                          : 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                  }`}
                >
                  {!unlocked
                    ? '🔒 Locked'
                    : passed
                      ? '🏆 Passed'
                      : best
                        ? '📚 Retake'
                        : '🚀 Ready'}
                </span>

              </div>

              {/* TITLE & DESC */}

              <h2 className="text-lg font-bold text-white mb-1">
                {test.title}
              </h2>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {test.description}
              </p>

              {/* META */}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
                  📋 {test.questions.length} Questions
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
                  ⏱️ {test.duration}
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
                  🎯 Pass: {TEST_PASS_THRESHOLD}%
                </span>
              </div>

              {/* BEST SCORE BAR */}

              {best ? (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Best Score</span>
                    <span className="font-bold text-white">
                      {best.score}/{best.total} ({best.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        passed
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                          : 'bg-gradient-to-r from-amber-400 to-orange-400'
                      }`}
                      style={{ width: `${best.pct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex-1" />
              )}

              {/* LOCK INFO / BUTTON */}

              {!unlocked && status && (
                <p className="text-xs text-gray-400 mb-3">
                  🔒 Unlocks when all {status.total} milestones
                  in Phase {test.phaseId} are complete ({status.completed}/{status.total} done).
                </p>
              )}

              <button
                onClick={() => handleStartTest(test)}
                disabled={!unlocked}
                className={`mt-auto w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                  unlocked
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/30 cursor-pointer'
                    : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!unlocked
                  ? '🔒 Locked'
                  : best
                    ? '🔄 Retake Test'
                    : '🚀 Start Test'}
              </button>

            </div>
          );
        })}

      </div>

      {/* TEST MODAL */}

      {activeTest && (
        <QuizModal
          topicTitle={activeTest.title}
          questions={activeTest.questions}
          onClose={() => setActiveTest(null)}
          onFinish={({ score, total }) =>
            handleTestFinish(
              activeTest.phaseId,
              score,
              total
            )
          }
        />
      )}

    </div>
  );
}
