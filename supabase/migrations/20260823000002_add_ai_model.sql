ALTER TABLE public.generations ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'fal-ai/kling-video/v1/standard/image-to-video' NOT NULL;
