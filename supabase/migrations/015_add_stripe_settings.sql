-- Stripe ayarlarını system_settings tablosuna ekle
INSERT INTO public.system_settings (key, value) VALUES
  ('stripe_publishable_key', '""'::jsonb),
  ('stripe_secret_key', '""'::jsonb),
  ('stripe_webhook_secret', '""'::jsonb),
  ('google_oauth_enabled', 'true'::jsonb),
  ('facebook_oauth_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

