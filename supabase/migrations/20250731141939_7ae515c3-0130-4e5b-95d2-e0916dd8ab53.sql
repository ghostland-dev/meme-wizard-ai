-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 3,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create memes table
CREATE TABLE public.memes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  generated_image_url TEXT,
  prompt TEXT NOT NULL,
  style TEXT DEFAULT 'viral',
  status TEXT DEFAULT 'generated',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create meme generations table for tracking AI requests
CREATE TABLE public.meme_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meme_id UUID REFERENCES public.memes(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model_used TEXT NOT NULL,
  cost_credits INTEGER DEFAULT 1,
  generation_time_ms INTEGER,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for memes
CREATE POLICY "Users can view all memes" ON public.memes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own memes" ON public.memes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memes" ON public.memes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memes" ON public.memes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meme generations
CREATE POLICY "Users can view their own generations" ON public.meme_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations" ON public.meme_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for meme images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('meme-images', 'meme-images', true),
  ('user-uploads', 'user-uploads', true);

-- Storage policies for meme images
CREATE POLICY "Anyone can view meme images" ON storage.objects
  FOR SELECT USING (bucket_id = 'meme-images');

CREATE POLICY "Authenticated users can upload meme images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'meme-images' AND auth.uid() IS NOT NULL);

-- Storage policies for user uploads
CREATE POLICY "Users can view their uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memes_updated_at
  BEFORE UPDATE ON public.memes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();