-- ============================================
-- FIX: Create user in public.users table
-- ============================================

-- 1. First, check if you exist in auth.users but not in public.users
SELECT 
  au.id,
  au.email,
  pu.id as public_user_id
FROM auth.users au
LEFT JOIN public.users pu ON au.id::text = pu.id
WHERE pu.id IS NULL;

-- 2. Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = id);

-- 5. Create function to auto-create user in public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. IMPORTANT: Manually add your current user to public.users
-- This fixes the immediate issue
INSERT INTO public.users (id, email, username)
SELECT 
  id::text,
  email,
  split_part(email, '@', 1)
FROM auth.users
WHERE id::text NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- 8. Verify your user now exists
SELECT * FROM public.users WHERE id = auth.uid()::text;
