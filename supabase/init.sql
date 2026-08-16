-- ============================================================
-- CYBER JOURNEY - SUPABASE DATABASE SETUP
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. ROADMAP PROGRESS
create table if not exists public.roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  target_date text,
  created_at timestamptz not null default now(),
  unique (user_id, milestone_id)
);

-- 2. CERTIFICATIONS
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  issuer text,
  date text,
  created_at timestamptz not null default now()
);

-- 3. STUDY ACTIVITY
create table if not exists public.study_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

-- 4. NOTES
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 5. WEEKLY REPORTS
create table if not exists public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_title text not null,
  hours integer not null default 0,
  labs integer not null default 0,
  summary text,
  created_at timestamptz not null default now()
);

-- 6. TEST SCORES (best score per phase)
create table if not exists public.test_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  phase_id text not null,
  score integer not null default 0,
  total integer not null default 0,
  pct integer not null default 0,
  date timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, phase_id)
);

-- 7. AI MENTOR CHAT MESSAGES
create table if not exists public.mentor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- 8. USER GOALS
create table if not exists public.user_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weekly_hours_goal integer not null default 10,
  weekly_topics_goal integer not null default 5,
  updated_at timestamptz not null default now()
);

-- 9. USER XP
create table if not exists public.user_xp (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 10. TEST ATTEMPTS (full history)
create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  phase_id text not null,
  score integer not null default 0,
  total integer not null default 0,
  pct integer not null default 0,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

-- 11. WEEKLY CHALLENGES (definitions)
create table if not exists public.challenges (
  id text primary key,
  title text not null,
  description text not null,
  type text not null check (type in ('milestones', 'study_days', 'tests')),
  target integer not null default 1,
  xp_reward integer not null default 50,
  active boolean not null default true
);

-- 12. CHALLENGE CLAIMS
create table if not exists public.challenge_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  challenge_id text not null references public.challenges (id) on delete cascade,
  week_start date not null,
  claimed_at timestamptz not null default now(),
  unique (user_id, challenge_id, week_start)
);

-- Seed weekly challenges
insert into public.challenges (id, title, description, type, target, xp_reward)
values
  ('ch-milestones', 'Milestone Hunter', 'Complete 5 roadmap milestones this week.', 'milestones', 5, 100),
  ('ch-study-days', 'Consistent Learner', 'Study on 3 different days this week.', 'study_days', 3, 60),
  ('ch-test-pass', 'Exam Slayer', 'Pass 1 phase test this week (60%+).', 'tests', 1, 80)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.roadmap_progress enable row level security;
alter table public.certifications enable row level security;
alter table public.study_activity enable row level security;
alter table public.notes enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.test_scores enable row level security;
alter table public.mentor_messages enable row level security;
alter table public.user_goals enable row level security;
alter table public.user_xp enable row level security;
alter table public.test_attempts enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_claims enable row level security;

-- ROADMAP PROGRESS
create policy "Users read own roadmap progress"
  on public.roadmap_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own roadmap progress"
  on public.roadmap_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own roadmap progress"
  on public.roadmap_progress for update
  using (auth.uid() = user_id);

create policy "Users delete own roadmap progress"
  on public.roadmap_progress for delete
  using (auth.uid() = user_id);

-- CERTIFICATIONS
create policy "Users read own certifications"
  on public.certifications for select
  using (auth.uid() = user_id);

create policy "Users insert own certifications"
  on public.certifications for insert
  with check (auth.uid() = user_id);

create policy "Users update own certifications"
  on public.certifications for update
  using (auth.uid() = user_id);

create policy "Users delete own certifications"
  on public.certifications for delete
  using (auth.uid() = user_id);

-- STUDY ACTIVITY
create policy "Users read own study activity"
  on public.study_activity for select
  using (auth.uid() = user_id);

create policy "Users insert own study activity"
  on public.study_activity for insert
  with check (auth.uid() = user_id);

create policy "Users update own study activity"
  on public.study_activity for update
  using (auth.uid() = user_id);

create policy "Users delete own study activity"
  on public.study_activity for delete
  using (auth.uid() = user_id);

-- NOTES
create policy "Users read own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- WEEKLY REPORTS
create policy "Users read own weekly reports"
  on public.weekly_reports for select
  using (auth.uid() = user_id);

create policy "Users insert own weekly reports"
  on public.weekly_reports for insert
  with check (auth.uid() = user_id);

create policy "Users update own weekly reports"
  on public.weekly_reports for update
  using (auth.uid() = user_id);

create policy "Users delete own weekly reports"
  on public.weekly_reports for delete
  using (auth.uid() = user_id);

-- TEST SCORES
create policy "Users read own test scores"
  on public.test_scores for select
  using (auth.uid() = user_id);

create policy "Users insert own test scores"
  on public.test_scores for insert
  with check (auth.uid() = user_id);

create policy "Users update own test scores"
  on public.test_scores for update
  using (auth.uid() = user_id);

create policy "Users delete own test scores"
  on public.test_scores for delete
  using (auth.uid() = user_id);

-- AI MENTOR MESSAGES
create policy "Users read own mentor messages"
  on public.mentor_messages for select
  using (auth.uid() = user_id);

create policy "Users insert own mentor messages"
  on public.mentor_messages for insert
  with check (auth.uid() = user_id);

create policy "Users delete own mentor messages"
  on public.mentor_messages for delete
  using (auth.uid() = user_id);

-- USER GOALS
create policy "Users read own goals"
  on public.user_goals for select
  using (auth.uid() = user_id);

create policy "Users insert own goals"
  on public.user_goals for insert
  with check (auth.uid() = user_id);

create policy "Users update own goals"
  on public.user_goals for update
  using (auth.uid() = user_id);

-- USER XP
create policy "Users read own xp"
  on public.user_xp for select
  using (auth.uid() = user_id);

create policy "Users insert own xp"
  on public.user_xp for insert
  with check (auth.uid() = user_id);

create policy "Users update own xp"
  on public.user_xp for update
  using (auth.uid() = user_id);

-- TEST ATTEMPTS
create policy "Users read own test attempts"
  on public.test_attempts for select
  using (auth.uid() = user_id);

create policy "Users insert own test attempts"
  on public.test_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users delete own test attempts"
  on public.test_attempts for delete
  using (auth.uid() = user_id);

-- CHALLENGES (readable by any logged-in user)
create policy "Authenticated users read challenges"
  on public.challenges for select
  using (auth.uid() is not null);

-- CHALLENGE CLAIMS
create policy "Users read own challenge claims"
  on public.challenge_claims for select
  using (auth.uid() = user_id);

create policy "Users insert own challenge claims"
  on public.challenge_claims for insert
  with check (auth.uid() = user_id);

create policy "Users delete own challenge claims"
  on public.challenge_claims for delete
  using (auth.uid() = user_id);