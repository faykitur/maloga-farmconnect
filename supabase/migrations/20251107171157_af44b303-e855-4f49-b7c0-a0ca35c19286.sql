-- Add DELETE policy for videos table so users can delete their own videos
CREATE POLICY "Users can delete own videos"
ON public.videos
FOR DELETE
USING (auth.uid() = user_id);