import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../lib/supabaseClient';
import QuizModal from '../components/QuizModal';
import {
  getTestByPhaseId,
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
  recordTestAttempt
} from '../utils/testScoresDb';
import { addXp, XP_AWARDS } from '../utils/xp';
import { initialRoadmapPhases } from '../data/roadmapPhases';


export default function Roadmap() {
  const [phases, setPhases] = useState(initialRoadmapPhases);

  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const [tempDate, setTempDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Phase Test (Test Examiner)
  const [activeTest, setActiveTest] = useState(null);
  const [bestScores, setBestScores] = useState(() =>
    loadTestScores()
  );

  // ==========================================
  // LOAD ROADMAP
  // ==========================================

  useEffect(() => {
    loadRoadmap();
    loadBestScoresFromDb();
  }, []);

  const loadBestScoresFromDb = async () => {
    try {
      const user = await getCurrentUser();

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

  const loadRoadmap = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getCurrentUser();

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
        .select(
          'milestone_id, completed, completed_at, target_date'
        )
        .eq('user_id', user.id);

      if (progressError) {
        throw progressError;
      }

      // Create clean copy of roadmap
      const updatedPhases = initialRoadmapPhases.map((phase) => ({
        ...phase,
        topics: phase.topics.map((topic) => ({
          ...topic,
          completed: false
        }))
      }));

      // Apply Supabase data
      if (data) {
        data.forEach((item) => {
          const milestoneId = item.milestone_id;

          // ------------------------------
          // TOPIC PROGRESS
          // ------------------------------

          if (
            typeof milestoneId === 'string' &&
            milestoneId.startsWith('t')
          ) {
            updatedPhases.forEach((phase) => {
              phase.topics = phase.topics.map((topic) => {
                if (topic.id === milestoneId) {
                  return {
                    ...topic,
                    completed: item.completed === true
                  };
                }

                return topic;
              });
            });
          }

          // ------------------------------
          // PHASE TARGET DATE
          // ------------------------------

          if (
            typeof milestoneId === 'string' &&
            milestoneId.startsWith('phase-')
          ) {
            const phaseId = Number(
              milestoneId.replace('phase-', '')
            );

            const phase = updatedPhases.find(
              (p) => p.id === phaseId
            );

            if (phase && item.target_date) {
              phase.targetDate = item.target_date;
            }
          }
        });
      }

      setPhases(updatedPhases);
    } catch (error) {
      console.error('Error loading roadmap:', error);
      setError(error.message || 'Failed to load roadmap.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOGGLE TOPIC
  // ==========================================

  const handleToggleTopic = async (phaseId, topicId) => {
    let newCompletedValue = false;

    // Update UI immediately
    setPhases((currentPhases) =>
      currentPhases.map((phase) => {
        if (phase.id !== phaseId) {
          return phase;
        }

        return {
          ...phase,
          topics: phase.topics.map((topic) => {
            if (topic.id !== topicId) {
              return topic;
            }

            newCompletedValue = !topic.completed;

            return {
              ...topic,
              completed: newCompletedValue
            };
          })
        };
      })
    );

    try {
      setSaving(true);
      setError('');

      const user = await getCurrentUser();

      if (!user) {
        throw new Error('You must be logged in.');
      }

      const completedAt = newCompletedValue
        ? new Date().toISOString()
        : null;

      const {
        error: upsertError
      } = await supabase
        .from('roadmap_progress')
        .upsert(
          {
            user_id: user.id,
            milestone_id: topicId,
            completed: newCompletedValue,
            completed_at: completedAt
          },
          {
            onConflict: 'user_id,milestone_id'
          }
        );

      if (upsertError) {
        throw upsertError;
      }

      // Award XP when a milestone is completed
      if (newCompletedValue) {
        try {
          await addXp(user.id, XP_AWARDS.MILESTONE);
        } catch (error) {
          console.error('Error awarding milestone xp:', error);
        }
      }
    } catch (error) {
      console.error(
        'Error saving topic progress:',
        error
      );

      setError(
        error.message ||
        'Failed to save topic progress.'
      );

      // Restore database version
      await loadRoadmap();
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // START EDIT DATE
  // ==========================================

  const handleStartEditDate = (phase) => {
    setEditingPhaseId(phase.id);
    setTempDate(phase.targetDate);
  };

  // ==========================================
  // SAVE TARGET DATE
  // ==========================================

  const handleSaveDate = async (phaseId) => {
    const cleanedDate = tempDate.trim();

    if (!cleanedDate) {
      setError('Target date cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const user = await getCurrentUser();

      if (!user) {
        throw new Error('You must be logged in.');
      }

      const {
        error: upsertError
      } = await supabase
        .from('roadmap_progress')
        .upsert(
          {
            user_id: user.id,
            milestone_id: `phase-${phaseId}`,
            completed: false,
            target_date: cleanedDate
          },
          {
            onConflict: 'user_id,milestone_id'
          }
        );

      if (upsertError) {
        throw upsertError;
      }

      // Update UI
      setPhases((currentPhases) =>
        currentPhases.map((phase) => {
          if (phase.id === phaseId) {
            return {
              ...phase,
              targetDate: cleanedDate
            };
          }

          return phase;
        })
      );

      setEditingPhaseId(null);
      setTempDate('');
    } catch (error) {
      console.error(
        'Error saving target date:',
        error
      );

      setError(
        error.message ||
        'Failed to save target date.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PHASE TEST (TEST EXAMINER)
  // ==========================================

  const handleStartTest = (phase) => {
    const test = getTestByPhaseId(phase.id);

    if (!test) return;

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
      const user = await getCurrentUser();

      if (user) {
        await saveBestScoreToDb(user.id, phaseId, score, total);
        await recordTestAttempt(user.id, phaseId, score, total);

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
  // PROGRESS
  // ==========================================

  const totalTopics = phases.reduce(
    (acc, phase) => acc + phase.topics.length,
    0
  );

  const completedTopics = phases.reduce(
    (acc, phase) =>
      acc +
      phase.topics.filter(
        (topic) => topic.completed
      ).length,
    0
  );

  const progressPercent =
    totalTopics > 0
      ? Math.round(
        (completedTopics / totalTopics) * 100
      )
      : 0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading your roadmap...
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
          Cybersecurity Career Roadmap
        </h1>

        <p className="text-gray-200 drop-shadow">
          Your step-by-step zero-to-hero journey toward a
          top product company by 2030.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* PROGRESS */}

      <div className="bg-black/25 border border-white/20 p-6 rounded-3xl mb-10 shadow-2xl">

        <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center mb-3">

          <span className="text-sm font-semibold text-rose-200">
            Overall Roadmap Progress
          </span>

          <span className="text-lg font-bold text-white">
            {completedTopics} / {totalTopics} Completed ({progressPercent}%)
          </span>

        </div>

        <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/10">

          <div
            className="bg-gradient-to-r from-rose-400 to-pink-400 h-full transition-all duration-500 shadow-lg shadow-rose-500/50"
            style={{
              width: `${progressPercent}%`
            }}
          />

        </div>
      </div>

      {/* PHASES */}

      <div className="space-y-8">

        {phases.map((phase) => {

          const phaseCompletedCount =
            phase.topics.filter(
              (topic) => topic.completed
            ).length;

          const phaseTotal =
            phase.topics.length;

          const phaseCompleted =
            phaseCompletedCount === phaseTotal &&
            phaseTotal > 0;

          const phaseTestQuestions =
            getTestByPhaseId(phase.id)?.questions.length ?? 10;

          const phasePercent =
            phaseTotal > 0
              ? Math.round(
                (phaseCompletedCount /
                  phaseTotal) *
                100
              )
              : 0;

          return (
            <div
              key={phase.id}
              className="bg-black/25 border border-white/20 p-6 rounded-3xl shadow-2xl hover:border-white/40 transition-all"
            >

              {/* PHASE HEADER */}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-white/10">

                <div>

                  <h2 className="text-xl font-bold text-white drop-shadow">
                    {phase.phase}
                  </h2>

                  <p className="text-gray-300 text-sm mt-1">
                    {phase.description}
                  </p>

                  <p className="text-xs text-pink-300 mt-2">
                    Phase Progress: {phasePercent}%
                  </p>

                </div>

                {/* TARGET DATE */}

                <div className="flex items-center gap-3">

                  {editingPhaseId === phase.id ? (

                    <div className="flex items-center gap-2">

                      <input
                        type="text"
                        value={tempDate}
                        onChange={(e) =>
                          setTempDate(e.target.value)
                        }
                        className="bg-black/50 border border-white/30 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-pink-300 w-28"
                        placeholder="e.g. Dec 2026"
                      />

                      <button
                        onClick={() =>
                          handleSaveDate(phase.id)
                        }
                        disabled={saving}
                        className="bg-pink-500/80 hover:bg-pink-400 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-lg"
                      >
                        {saving
                          ? 'Saving...'
                          : 'Save'}
                      </button>

                    </div>

                  ) : (

                    <div className="flex items-center gap-2 bg-black/30 border border-white/20 px-3.5 py-2 rounded-2xl">

                      <span className="text-xs text-rose-200">
                        🎯 Target:{' '}
                        <strong className="text-white">
                          {phase.targetDate}
                        </strong>
                      </span>

                      <button
                        onClick={() =>
                          handleStartEditDate(phase)
                        }
                        className="text-gray-300 hover:text-white text-xs ml-2 underline cursor-pointer"
                      >
                        Edit
                      </button>

                    </div>

                  )}

                </div>

              </div>

              {/* TOPICS */}

              <div className="space-y-3">

                <div className="text-xs font-semibold text-gray-300 mb-2">
                  Milestones ({phaseCompletedCount}/{phaseTotal} completed)
                </div>

                {phase.topics.map((topic) => (

                  <div
                    key={topic.id}
                    onClick={() =>
                      handleToggleTopic(
                        phase.id,
                        topic.id
                      )
                    }
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${topic.completed
                        ? 'bg-rose-900/30 border-rose-300/40 text-rose-200 line-through opacity-80 shadow-inner'
                        : 'bg-black/30 border-white/10 text-gray-100 hover:bg-white/15 hover:border-white/30 shadow-lg'
                      }`}
                  >

                    <div className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() => { }}
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="w-4 h-4 accent-pink-400 rounded cursor-pointer"
                      />

                      <span className="text-sm font-medium">
                        {topic.name}
                      </span>

                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${topic.completed
                          ? 'bg-green-500/20 text-green-300 border-green-400/30'
                          : 'bg-white/10 text-gray-300 border-white/10'
                        }`}
                    >
                      {topic.completed
                        ? 'Completed ✓'
                        : 'Pending'}
                    </span>

                  </div>

                ))}

              </div>

              {/* PHASE TEST (TEST EXAMINER) */}

              <div
                className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                  phaseCompleted
                    ? 'bg-rose-500/10 border-rose-400/30 hover:border-rose-400/60'
                    : 'bg-black/20 border-white/10 opacity-80'
                }`}
              >

                <div className="flex-1">

                  <p className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                    🧪 Phase Test

                    {bestScores[phase.id] && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isTestPassed(
                            bestScores[phase.id].score,
                            bestScores[phase.id].total
                          )
                            ? 'bg-green-500/20 text-green-300 border-green-400/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}
                      >
                        Best: {bestScores[phase.id].score}
                        /{bestScores[phase.id].total} (
                        {bestScores[phase.id].pct}%)
                      </span>
                    )}

                  </p>

                  <p className="text-xs text-gray-300 mt-1">
                    {phaseCompleted
                      ? bestScores[phase.id]
                        ? `Retake anytime to beat your best. Score ${TEST_PASS_THRESHOLD}%+ to pass!`
                        : `Phase complete! Test your knowledge with ${phaseTestQuestions} MCQs.`
                      : `Complete all ${phaseTotal} milestones to unlock this test.`}
                  </p>

                </div>

                <button
                  onClick={() => handleStartTest(phase)}
                  disabled={!phaseCompleted}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    phaseCompleted
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/30 cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {phaseCompleted
                    ? bestScores[phase.id]
                      ? '🔄 Retake Test'
                      : '🚀 Start Test'
                    : '🔒 Locked'}
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* PHASE TEST MODAL */}

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

