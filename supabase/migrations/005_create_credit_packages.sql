-- Credit paketleri tablosu
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  price_try DECIMAL(10, 2) NOT NULL,
  stripe_price_id_usd TEXT,
  stripe_price_id_try TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS credit_packages_updated_at ON public.credit_packages;
CREATE TRIGGER credit_packages_updated_at
  BEFORE UPDATE ON public.credit_packages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS politikaları
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

-- Herkes aktif paketleri görebilir
CREATE POLICY "Anyone can view active packages"
  ON public.credit_packages
  FOR SELECT
  USING (is_active = true);

-- Admin tüm paketleri yönetebilir
CREATE POLICY "Admins can manage packages"
  ON public.credit_packages
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Varsayılan paketler (Stripe Price ID'leri daha sonra eklenecek)
INSERT INTO public.credit_packages (name, credits, price_usd, price_try, display_order) VALUES
  ('1 Credit', 1, 9.99, 349.99, 1),
  ('5 Credits', 5, 39.99, 1399.99, 2),
  ('10 Credits', 10, 69.99, 2449.99, 3)
ON CONFLICT DO NOTHING;

-- İndeksler
CREATE INDEX IF NOT EXISTS credit_packages_is_active_idx ON public.credit_packages(is_active);
CREATE INDEX IF NOT EXISTS credit_packages_display_order_idx ON public.credit_packages(display_order);

