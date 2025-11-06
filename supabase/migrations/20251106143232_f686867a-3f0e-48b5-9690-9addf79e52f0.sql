-- Create educational_resources table for admin-managed content
CREATE TABLE public.educational_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'course')),
  duration TEXT NOT NULL,
  url TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view educational resources
CREATE POLICY "Anyone can view educational resources"
ON public.educational_resources
FOR SELECT
USING (true);

-- Only superadmins can insert educational resources
CREATE POLICY "Superadmins can create educational resources"
ON public.educational_resources
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

-- Only superadmins can update educational resources
CREATE POLICY "Superadmins can update educational resources"
ON public.educational_resources
FOR UPDATE
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Only superadmins can delete educational resources
CREATE POLICY "Superadmins can delete educational resources"
ON public.educational_resources
FOR DELETE
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_educational_resources_updated_at
BEFORE UPDATE ON public.educational_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();