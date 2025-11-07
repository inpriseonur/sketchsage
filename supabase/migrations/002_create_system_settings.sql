-- Sistem ayarları tablosu
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS system_settings_updated_at ON public.system_settings;
CREATE TRIGGER system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS politikaları
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Anyone can read system settings"
  ON public.system_settings
  FOR SELECT
  USING (true);

-- Sadece admin yazabilir (admin_role kontrolü metadata'dan)
CREATE POLICY "Only admins can modify system settings"
  ON public.system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid()
      AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- Varsayılan ayarlar
INSERT INTO public.system_settings (key, value) VALUES
  ('default_welcome_credits', '1'),
  ('max_image_size_mb', '3'),
  ('max_video_size_mb', '30'),
  ('questions_per_evaluation', '2')
ON CONFLICT (key) DO NOTHING;

