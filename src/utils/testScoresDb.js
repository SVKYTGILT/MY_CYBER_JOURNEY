import { supabase } from '../lib/supabaseClient';
import { TEST_PASS_THRESHOLD } from '../data/testData';

export async function loadTestScoresFromDb(userId) {
  const { data, error } = await supabase
    .from('test_scores')
    .select('phase_id, score, total, pct, date')
    .eq('user_id', userId);

  if (error) throw error;

  const map = {};

  (data || []).forEach((row) => {
    map[row.phase_id] = {
      score: row.score,
      total: row.total,
      pct: row.pct,
      date: row.date,
    };
  });

  return map;
}

export async function saveBestScoreToDb(userId, phaseId, score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const { data: existing, error: readError } = await supabase
    .from('test_scores')
    .select('pct')
    .eq('user_id', userId)
    .eq('phase_id', phaseId)
    .maybeSingle();

  if (readError) throw readError;

  if (existing && existing.pct >= pct) return false;

  const { error } = await supabase
    .from('test_scores')
    .upsert(
      {
        user_id: userId,
        phase_id: phaseId,
        score,
        total,
        pct,
        date: new Date().toISOString(),
      },
      { onConflict: 'user_id,phase_id' }
    );

  if (error) throw error;

  return true;
}

export async function recordTestAttempt(userId, phaseId, score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const { error } = await supabase
    .from('test_attempts')
    .insert({
      user_id: userId,
      phase_id: phaseId,
      score,
      total,
      pct,
      passed: pct >= TEST_PASS_THRESHOLD,
    });

  if (error) throw error;
}

export async function loadRecentAttempts(userId, limit = 10) {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('phase_id, score, total, pct, passed, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}