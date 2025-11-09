-- Kullanıcılar kendi evaluations'larına soru sorabilsin
CREATE POLICY "Users can insert questions to their own evaluations"
ON evaluation_questions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM evaluations 
    WHERE evaluations.id = evaluation_questions.evaluation_id 
    AND evaluations.user_id = auth.uid()
  )
);

-- Kullanıcılar kendi evaluations'larının sorularını görebilsin
CREATE POLICY "Users can view their own evaluation questions"
ON evaluation_questions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM evaluations 
    WHERE evaluations.id = evaluation_questions.evaluation_id 
    AND evaluations.user_id = auth.uid()
  )
);

-- Admin'ler tüm soruları görebilsin
CREATE POLICY "Admin can view all questions"
ON evaluation_questions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- Admin'ler soruları güncelleyebilsin (cevap eklemek için)
CREATE POLICY "Admin can update questions with answers"
ON evaluation_questions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users_profile 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

