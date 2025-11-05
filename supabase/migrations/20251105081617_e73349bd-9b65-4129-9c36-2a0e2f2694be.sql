-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.decrement_video_likes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.videos
  SET likes_count = likes_count - 1
  WHERE id = OLD.video_id;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_video_likes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.videos
  SET likes_count = likes_count + 1
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;