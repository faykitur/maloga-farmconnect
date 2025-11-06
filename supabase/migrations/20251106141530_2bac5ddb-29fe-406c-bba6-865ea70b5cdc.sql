-- Make video_url optional in videos table
ALTER TABLE public.videos ALTER COLUMN video_url DROP NOT NULL;

-- Update profiles table phone field to accept input during signup
COMMENT ON COLUMN public.profiles.phone IS 'User phone number for faster reach out';