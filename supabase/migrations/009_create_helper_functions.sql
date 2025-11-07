-- Credit düşürme fonksiyonu (evaluation oluşturulduğunda)
CREATE OR REPLACE FUNCTION public.deduct_credit_on_evaluation()
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcının yeterli crediti var mı kontrol et
  IF (SELECT credits FROM public.users_profile WHERE id = NEW.user_id) < 1 THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Credit'i düşür
  UPDATE public.users_profile
  SET credits = credits - 1
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS deduct_credit_on_evaluation ON public.evaluations;
CREATE TRIGGER deduct_credit_on_evaluation
  BEFORE INSERT ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION public.deduct_credit_on_evaluation();

-- Credit ekleme fonksiyonu (Stripe webhook tarafından çağrılacak)
CREATE OR REPLACE FUNCTION public.add_credits_to_user(
  p_user_id UUID,
  p_credits INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users_profile
  SET credits = credits + p_credits
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının bekleyen değerlendirmesi var mı kontrol et
CREATE OR REPLACE FUNCTION public.has_pending_evaluation(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE user_id = p_user_id
    AND status IN ('pending', 'in_progress')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının bir değerlendirme için soru sorma hakkı kaldı mı?
CREATE OR REPLACE FUNCTION public.can_ask_question(
  p_user_id UUID,
  p_evaluation_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_question_limit INTEGER;
  v_question_count INTEGER;
BEGIN
  -- Maksimum soru sayısını al
  SELECT value::integer INTO v_question_limit
  FROM public.system_settings
  WHERE key = 'questions_per_evaluation';
  
  -- Kullanıcının bu değerlendirme için sorduğu soru sayısını al
  SELECT COUNT(*) INTO v_question_count
  FROM public.evaluation_questions
  WHERE evaluation_id = p_evaluation_id
  AND user_id = p_user_id;
  
  RETURN v_question_count < v_question_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

