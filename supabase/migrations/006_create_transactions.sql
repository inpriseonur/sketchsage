-- İşlem geçmişi tablosu
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  package_id UUID REFERENCES public.credit_packages(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  credits_added INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS politikaları
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi işlem geçmişini görebilir
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sistem (webhook) işlem oluşturabilir (service role ile)
-- Admin tüm işlemleri görebilir
CREATE POLICY "Admins can view all transactions"
  ON public.transactions
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- İndeksler
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_stripe_payment_intent_id_idx ON public.transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON public.transactions(created_at DESC);

