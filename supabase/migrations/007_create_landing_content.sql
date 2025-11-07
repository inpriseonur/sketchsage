-- Landing page içerik tablosu
CREATE TABLE IF NOT EXISTS public.landing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  language TEXT NOT NULL DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(section, language)
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS landing_content_updated_at ON public.landing_content;
CREATE TRIGGER landing_content_updated_at
  BEFORE UPDATE ON public.landing_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS politikaları
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;

-- Herkes landing içeriğini okuyabilir
CREATE POLICY "Anyone can read landing content"
  ON public.landing_content
  FOR SELECT
  USING (true);

-- Admin içeriği yönetebilir
CREATE POLICY "Admins can manage landing content"
  ON public.landing_content
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Varsayılan içerik (Türkçe)
INSERT INTO public.landing_content (section, content, language) VALUES
  ('hero', '{"title": "Sanatınıza Profesyonel Feedback", "subtitle": "Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza uzman geri bildirim alın", "button_text": "Hemen Feedback Al"}', 'tr'),
  ('how_to', '{"steps": [{"title": "Yükle", "description": "Çalışmanızı yükleyin"}, {"title": "Bekle", "description": "Uzman incelemesini bekleyin"}, {"title": "Geliştir", "description": "Feedback ile gelişin"}]}', 'tr'),
  ('faq', '{"questions": [{"question": "Feedback ne kadar sürede gelir?", "answer": "Genellikle 24-48 saat içinde"}, {"question": "Hangi formatları destekliyorsunuz?", "answer": "Resim (JPG, PNG) ve video (MP4) formatlarını destekliyoruz"}]}', 'tr')
ON CONFLICT (section, language) DO NOTHING;

-- Varsayılan içerik (İngilizce)
INSERT INTO public.landing_content (section, content, language) VALUES
  ('hero', '{"title": "Professional Feedback for Your Art", "subtitle": "Get expert feedback on your pencil, watercolor, oil, and pastel artwork", "button_text": "Get Feedback Now"}', 'en'),
  ('how_to', '{"steps": [{"title": "Upload", "description": "Upload your artwork"}, {"title": "Wait", "description": "Wait for expert review"}, {"title": "Improve", "description": "Improve with feedback"}]}', 'en'),
  ('faq', '{"questions": [{"question": "How long does feedback take?", "answer": "Usually 24-48 hours"}, {"question": "What formats do you support?", "answer": "We support image (JPG, PNG) and video (MP4) formats"}]}', 'en')
ON CONFLICT (section, language) DO NOTHING;

-- İndeksler
CREATE INDEX IF NOT EXISTS landing_content_section_idx ON public.landing_content(section);
CREATE INDEX IF NOT EXISTS landing_content_language_idx ON public.landing_content(language);

