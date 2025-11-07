-- Değerlendirme türleri için enum
CREATE TYPE evaluation_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE feedback_type AS ENUM ('text', 'audio');

-- Değerlendirmeler tablosu
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type media_type NOT NULL,
  user_message TEXT NOT NULL,
  status evaluation_status DEFAULT 'pending' NOT NULL,
  feedback_type feedback_type,
  feedback_content TEXT,
  feedback_audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS evaluations_updated_at ON public.evaluations;
CREATE TRIGGER evaluations_updated_at
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Status değiştiğinde completed_at'i güncelle
CREATE OR REPLACE FUNCTION public.handle_evaluation_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS evaluation_completion ON public.evaluations;
CREATE TRIGGER evaluation_completion
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION public.handle_evaluation_completion();

-- RLS politikaları
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi değerlendirmelerini görebilir
CREATE POLICY "Users can view own evaluations"
  ON public.evaluations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi değerlendirmelerini oluşturabilir
CREATE POLICY "Users can create own evaluations"
  ON public.evaluations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin tüm değerlendirmeleri görebilir ve güncelleyebilir
CREATE POLICY "Admins can view all evaluations"
  ON public.evaluations
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update all evaluations"
  ON public.evaluations
  FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- İndeksler
CREATE INDEX IF NOT EXISTS evaluations_user_id_idx ON public.evaluations(user_id);
CREATE INDEX IF NOT EXISTS evaluations_status_idx ON public.evaluations(status);
CREATE INDEX IF NOT EXISTS evaluations_created_at_idx ON public.evaluations(created_at DESC);

