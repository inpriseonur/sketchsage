-- Admin'lerin tüm evaluations'ları güncelleyebilmesi için policy
CREATE POLICY "Admin can update any evaluation"
ON evaluations
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

-- Admin'lerin tüm evaluations'ları okuyabilmesi için policy
CREATE POLICY "Admin can view all evaluations"
ON evaluations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profile 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

