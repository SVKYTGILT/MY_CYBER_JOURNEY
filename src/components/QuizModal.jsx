import React, { useState, useEffect } from 'react';
import { isTestPassed } from '../data/testData';

// ============================================================
// SCORE TIER CONFIG
// ============================================================

const TIERS = [
  {
    min: 86,
    label: 'Cyber Expert',
    badge: '🏆',
    color: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400/50',
    glow: 'shadow-yellow-500/40',
    message: 'Outstanding! You have mastered this topic completely. Elite-level knowledge!'
  },
  {
    min: 71,
    label: 'Security Analyst',
    badge: '⚔️',
    color: 'from-rose-400 to-pink-500',
    border: 'border-rose-400/50',
    glow: 'shadow-rose-500/40',
    message: 'Excellent work! Strong understanding across the board. Keep honing your skills!'
  },
  {
    min: 51,
    label: 'Cyber Defender',
    badge: '🛡️',
    color: 'from-blue-400 to-cyan-500',
    border: 'border-blue-400/50',
    glow: 'shadow-blue-500/40',
    message: 'Good progress! You have a solid foundation. Review the missed topics and push further.'
  },
  {
    min: 0,
    label: 'Novice Hacker',
    badge: '🔰',
    color: 'from-gray-400 to-slate-500',
    border: 'border-gray-400/50',
    glow: 'shadow-gray-500/40',
    message: 'Keep going! Every expert started here. Review the material and take the test again!'
  }
];

function getTier(score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return TIERS.find((t) => pct >= t.min) || TIERS[TIERS.length - 1];
}

// ============================================================
// ANIMATED SCORE RING
// ============================================================

function ScoreRing({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto mb-6">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-xs text-gray-400">/ {total}</span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN QUIZ MODAL
// ============================================================

export default function QuizModal({
  topicTitle,
  questions,
  onClose,
  onFinish
}) {
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'score'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // array of booleans

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const total = questions.length;
  const current = questions[currentIndex];
  const progressPct = ((currentIndex) / total) * 100;

  // ── Handle option select ──────────────────────────────────
  const handleSelect = (idx) => {
    if (revealed) return;
    setSelectedOption(idx);
    setRevealed(true);
    const correct = idx === current.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  // ── Move to next question ─────────────────────────────────
  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setPhase('score');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  // ── Retake ────────────────────────────────────────────────
  const handleRetake = () => {
    setPhase('quiz');
    setCurrentIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setAnswers([]);
  };

  // ── Option styling ────────────────────────────────────────
  const getOptionStyle = (idx) => {
    const base =
      'w-full text-left px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 cursor-pointer ';

    if (!revealed) {
      return (
        base +
        (selectedOption === idx
          ? 'bg-pink-500/40 border-pink-400/60 text-white shadow-lg shadow-pink-500/20'
          : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/25')
      );
    }

    // Revealed state
    if (idx === current.answer) {
      return base + 'bg-green-500/20 border-green-400/60 text-green-200 shadow-lg shadow-green-500/20';
    }
    if (idx === selectedOption && idx !== current.answer) {
      return base + 'bg-red-500/20 border-red-400/60 text-red-200';
    }
    return base + 'bg-white/5 border-white/5 text-gray-500';
  };

  const tier = getTier(score, total);
  const passed = isTestPassed(score, total);

  // ============================================================
  // SCORE SCREEN
  // ============================================================

  if (phase === 'score') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      >
        <div
          className={`relative w-full max-w-md bg-black/60 border ${tier.border} rounded-3xl p-8 shadow-2xl ${tier.glow} shadow-2xl`}
        >
          {/* Glow halo */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tier.color} opacity-5 pointer-events-none`}
          />

          {/* Tier badge */}
          <div className="text-center mb-2">
            <span className="text-5xl">{tier.badge}</span>
          </div>

          {/* Tier label */}
          <h2
            className={`text-center text-2xl font-black mb-1 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
          >
            {tier.label}
          </h2>

          <p className="text-center text-xs text-gray-400 mb-6">{topicTitle}</p>

          {/* Score ring */}
          <ScoreRing score={score} total={total} />

          {/* Percentage */}
          <p className="text-center text-lg font-bold text-white mb-3">
            {total > 0 ? Math.round((score / total) * 100) : 0}% Score
          </p>

          {/* Pass / Review chip */}
          <div className="flex justify-center mb-6">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
                passed
                  ? 'bg-green-500/20 border-green-400/40 text-green-300'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}
            >
              {passed
                ? '🎉 PASSED — Exam Cleared!'
                : '📚 Needs Review — Retake to Pass'}
            </span>
          </div>

          {/* Message */}
          <p className="text-center text-sm text-gray-300 mb-8 leading-relaxed px-4">
            {tier.message}
          </p>

          {/* Answer summary dots */}
          <div className="flex gap-1.5 justify-center flex-wrap mb-8">
            {answers.map((correct, i) => (
              <div
                key={i}
                title={`Q${i + 1}: ${correct ? 'Correct' : 'Wrong'}`}
                className={`w-3 h-3 rounded-full border ${
                  correct
                    ? 'bg-green-400 border-green-300'
                    : 'bg-red-400 border-red-300'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
            >
              🔄 Retake
            </button>
            <button
              onClick={() => {
                if (typeof onFinish === 'function') {
                  onFinish({ score, total });
                }
                onClose();
              }}
              className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${tier.color} text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg`}
            >
              ✓ Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ SCREEN
  // ============================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-black/60 border border-white/15 rounded-3xl shadow-2xl overflow-hidden">

        {/* ── HEADER ── */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-pink-300 uppercase tracking-widest">
              🧪 Knowledge Test
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ×
            </button>
          </div>
          <p className="text-sm font-medium text-white truncate">{topicTitle}</p>
        </div>

        {/* ── PROGRESS ── */}
        <div className="px-6 py-3 border-b border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Question {currentIndex + 1} of {total}</span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── QUESTION ── */}
        <div className="px-6 pt-6 pb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 shadow-inner">
            <p className="text-white text-base font-semibold leading-relaxed">
              {current.question}
            </p>
          </div>

          {/* ── OPTIONS ── */}
          <div className="space-y-3">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={getOptionStyle(idx)}
                disabled={revealed}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5 ${
                      revealed && idx === current.answer
                        ? 'bg-green-500/30 border-green-400 text-green-300'
                        : revealed && idx === selectedOption
                        ? 'bg-red-500/30 border-red-400 text-red-300'
                        : 'bg-white/5 border-white/20 text-gray-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ── EXPLANATION ── */}
          {revealed && (
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
              <span className="text-pink-300 font-semibold">💡 Explanation: </span>
              {current.explanation}
            </div>
          )}
        </div>

        {/* ── FOOTER / NEXT BUTTON ── */}
        <div className="px-6 pb-6">
          <button
            onClick={handleNext}
            disabled={!revealed}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
              revealed
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/30 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentIndex + 1 >= total ? '🏁 See My Score' : 'Next Question →'}
          </button>
        </div>

      </div>
    </div>
  );
}
