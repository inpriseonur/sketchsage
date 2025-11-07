-- Public gallery tablosu
CREATE TABLE IF NOT EXISTS public.public_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL UNIQUE REFERENCES public.evaluations(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS politikaları
ALTER TABLE public.public_gallery ENABLE ROW LEVEL SECURITY;

-- Herkes public gallery'i görebilir
CREATE POLICY "Anyone can view public gallery"
  ON public.public_gallery
  FOR SELECT
  USING (true);

-- Admin gallery'i yönetebilir
CREATE POLICY "Admins can manage public gallery"
  ON public.public_gallery
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- İndeksler
CREATE INDEX IF NOT EXISTS public_gallery_evaluation_id_idx ON public.public_gallery(evaluation_id);
CREATE INDEX IF NOT EXISTS public_gallery_is_featured_idx ON public.public_gallery(is_featured);
CREATE INDEX IF NOT EXISTS public_gallery_created_at_idx ON public.public_gallery(created_at DESC);

