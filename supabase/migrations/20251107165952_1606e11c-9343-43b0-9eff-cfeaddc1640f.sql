-- Create notifications table for admin alerts
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_listing', 'content_moderation', 'user_report')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Superadmins can view all notifications"
ON public.notifications
FOR SELECT
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create notifications for all superadmins
CREATE OR REPLACE FUNCTION public.notify_superadmins(
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  ref_id UUID DEFAULT NULL,
  ref_type TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_type)
  SELECT ur.user_id, notification_type, notification_title, notification_message, ref_id, ref_type
  FROM public.user_roles ur
  WHERE ur.role = 'superadmin'::app_role;
END;
$$;

-- Trigger function for new listings
CREATE OR REPLACE FUNCTION public.notify_new_listing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM notify_superadmins(
    'new_listing',
    'New Listing Created',
    'A new listing "' || NEW.title || '" has been created and needs review.',
    NEW.id,
    'listing'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new listings
CREATE TRIGGER on_listing_created
  AFTER INSERT ON public.livestock_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_listing();

-- Add index for better query performance
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);