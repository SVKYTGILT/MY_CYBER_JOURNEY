import { supabase } from '../lib/supabaseClient';

export const XP_PER_LEVEL = 150;

export const LEVEL_TITLES = [
  'Novice',
  'Script Kiddie',
  'White Hat',
  'Security Analyst',
  'Penetration Tester',
  'Red Teamer',
  'Security Engineer',
  'Bug Bounty Hunter',
  'Elite Hacker',
  'Cyber Master',
  'Legend',
];

export const XP_AWARDS = {
  MILESTONE: 20,
  STUDY_DAY: 10,
  TEST_PASS: 50,
};

export function levelFromXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function levelTitle(level) {
  const index = Math.min(level - 1, LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[index];
}

export function xpProgressToNextLevel(xp) {
  const level = levelFromXp(xp);
  const currentLevelStart = (level - 1) * XP_PER_LEVEL;
  const intoLevel = xp - currentLevelStart;
  return {
    intoLevel,
    total: XP_PER_LEVEL,
    pct: Math.round((intoLevel / XP_PER_LEVEL) * 100),
    nextLevel: level + 1,
    nextTitle: levelTitle(level + 1),
  };
}

export async function getXp(userId) {
  const { data, error } = await supabase
    .from('user_xp')
    .select('xp')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data?.xp ?? 0;
}

export async function addXp(userId, amount) {
  const current = await getXp(userId);

  const { error } = await supabase
    .from('user_xp')
    .upsert(
      {
        user_id: userId,
        xp: current + amount,
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;

  return current + amount;
}