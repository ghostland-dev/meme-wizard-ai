-- Create function to increment meme statistics
CREATE OR REPLACE FUNCTION public.increment_meme_stat(
  meme_id UUID,
  stat_field TEXT
) 
RETURNS VOID 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  CASE stat_field
    WHEN 'views' THEN
      UPDATE public.memes 
      SET views = views + 1, updated_at = now() 
      WHERE id = meme_id;
    WHEN 'likes' THEN
      UPDATE public.memes 
      SET likes = likes + 1, updated_at = now() 
      WHERE id = meme_id;
    WHEN 'shares' THEN
      UPDATE public.memes 
      SET shares = shares + 1, updated_at = now() 
      WHERE id = meme_id;
    ELSE
      RAISE EXCEPTION 'Invalid stat_field: %', stat_field;
  END CASE;
END;
$$;