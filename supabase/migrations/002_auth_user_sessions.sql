-- Link user_sessions to Supabase Auth so login works and data is scoped per user.
-- Requires Supabase Auth (auth.users) to be enabled.

-- Add user_id to user_sessions (nullable for backward compatibility with existing rows)
ALTER TABLE user_sessions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- RLS: authenticated users can only see/insert/update their own session(s)
DROP POLICY IF EXISTS "Allow read user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow insert user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow update user_sessions" ON user_sessions;

CREATE POLICY "Users read own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own session" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow anon to create a session (user_id NULL) so pre-login flow can create a session;
-- after login, the app should update that row with user_id = auth.uid().
CREATE POLICY "Anon can create session" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() IS NULL AND user_id IS NULL);

-- Likes: allow authenticated users to manage their own likes (via session_id owned by them).
-- Keep existing anon policies so unauthenticated flows still work until you migrate fully.
DROP POLICY IF EXISTS "Allow read likes" ON likes;
DROP POLICY IF EXISTS "Allow insert likes" ON likes;

CREATE POLICY "Read likes: own session or anon" ON likes
  FOR SELECT USING (
    auth.uid() IS NULL
    OR session_id IN (SELECT id FROM user_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Insert likes: own session or anon" ON likes
  FOR INSERT WITH CHECK (
    auth.uid() IS NULL
    OR session_id IN (SELECT id FROM user_sessions WHERE user_id = auth.uid())
  );
