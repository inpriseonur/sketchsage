-- Değerlendirme soruları tablosu
CREATE TABLE IF NOT EXISTS public.evaluation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  answered_at TIMESTAMPTZ
);

-- Cevap verildiğinde answered_at'i güncelle
CREATE OR REPLACE FUNCTION public.handle_question_answer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.answer IS NOT NULL AND OLD.answer IS NULL THEN
    NEW.answered_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS question_answer ON public.evaluation_questions;
CREATE TRIGGER question_answer
  BEFORE UPDATE ON public.evaluation_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_question_answer();

-- RLS politikaları
ALTER TABLE public.evaluation_questions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi sorularını görebilir
CREATE POLICY "Users can view own questions"
  ON public.evaluation_questions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi değerlendirmelerine soru sorabilir
CREATE POLICY "Users can create questions for own evaluations"
  ON public.evaluation_questions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.evaluations 
      WHERE id = evaluation_id AND user_id = auth.uid()
    )
  );

-- Admin tüm soruları görebilir ve cevaplayabilir
CREATE POLICY "Admins can view all questions"
  ON public.evaluation_questions
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can answer questions"
  ON public.evaluation_questions
  FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- İndeksler
CREATE INDEX IF NOT EXISTS evaluation_questions_evaluation_id_idx ON public.evaluation_questions(evaluation_id);
CREATE INDEX IF NOT EXISTS evaluation_questions_user_id_idx ON public.evaluation_questions(user_id);
CREATE INDEX IF NOT EXISTS evaluation_questions_created_at_idx ON public.evaluation_questions(created_at);

