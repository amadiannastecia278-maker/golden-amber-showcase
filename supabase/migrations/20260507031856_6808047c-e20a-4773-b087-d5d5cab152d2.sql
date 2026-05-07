
-- Master admin email gate
CREATE OR REPLACE FUNCTION public.is_master_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() ->> 'email') = 'amzybaby125@gmail.com'
$$;

-- Tighten the bootstrap policy so only the master admin email can claim admin
DROP POLICY IF EXISTS "Bootstrap first admin" ON public.user_roles;
CREATE POLICY "Bootstrap master admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'admin'::app_role
  AND (auth.jwt() ->> 'email') = 'amzybaby125@gmail.com'
);

-- Templates table
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Template',
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  preview_image_url text NOT NULL,
  file_url text,
  payment_link text,
  is_free boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published templates"
ON public.templates FOR SELECT TO public
USING (published = true);

CREATE POLICY "Master admin can view all templates"
ON public.templates FOR SELECT TO authenticated
USING (public.is_master_admin());

CREATE POLICY "Master admin can insert templates"
ON public.templates FOR INSERT TO authenticated
WITH CHECK (public.is_master_admin());

CREATE POLICY "Master admin can update templates"
ON public.templates FOR UPDATE TO authenticated
USING (public.is_master_admin());

CREATE POLICY "Master admin can delete templates"
ON public.templates FOR DELETE TO authenticated
USING (public.is_master_admin());

-- Tighten projects writes to also require master admin email
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Master admin can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (public.is_master_admin());

CREATE POLICY "Master admin can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (public.is_master_admin());

CREATE POLICY "Master admin can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (public.is_master_admin());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-previews', 'template-previews', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('template-files', 'template-files', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for both buckets, master-admin write
CREATE POLICY "Public read template previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'template-previews');

CREATE POLICY "Public read template files"
ON storage.objects FOR SELECT
USING (bucket_id = 'template-files');

CREATE POLICY "Master admin upload template previews"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'template-previews' AND public.is_master_admin());

CREATE POLICY "Master admin update template previews"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'template-previews' AND public.is_master_admin());

CREATE POLICY "Master admin delete template previews"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'template-previews' AND public.is_master_admin());

CREATE POLICY "Master admin upload template files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'template-files' AND public.is_master_admin());

CREATE POLICY "Master admin update template files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'template-files' AND public.is_master_admin());

CREATE POLICY "Master admin delete template files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'template-files' AND public.is_master_admin());

-- Updated-at trigger reuse
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER templates_touch_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
