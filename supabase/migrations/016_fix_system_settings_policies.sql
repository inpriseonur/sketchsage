-- Fix system_settings RLS policies
-- The previous migration only created SELECT policy, missing UPDATE, INSERT, DELETE

-- UPDATE policy for admins
CREATE POLICY IF NOT EXISTS "Only admins can update system settings"
  ON public.system_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- INSERT policy for admins
CREATE POLICY IF NOT EXISTS "Only admins can insert system settings"
  ON public.system_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- DELETE policy for admins
CREATE POLICY IF NOT EXISTS "Only admins can delete system settings"
  ON public.system_settings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

