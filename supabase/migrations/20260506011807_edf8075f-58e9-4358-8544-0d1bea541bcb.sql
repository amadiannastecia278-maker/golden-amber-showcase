ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);