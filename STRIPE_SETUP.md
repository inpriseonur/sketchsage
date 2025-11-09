# Stripe Entegrasyon Kurulum Rehberi

Bu döküman, SketchSage projesinde Stripe ödeme entegrasyonunun nasıl kurulacağını adım adım açıklar.

## 📋 Gerekli Adımlar

### 1️⃣ Stripe Dashboard'da Webhook Ayarları

1. [Stripe Dashboard](https://dashboard.stripe.com/)'a gidin
2. **Developers** > **Webhooks** tıklayın
3. **"Add endpoint"** butonuna tıklayın

#### Webhook URL:
```
https://your-domain.vercel.app/api/stripe/webhook
```

**Local Development için:**
```
https://localhost:3000/api/stripe/webhook
```

> ⚠️ **Not:** Local test için [Stripe CLI](https://stripe.com/docs/stripe-cli) kullanmanız önerilir.

#### Dinlenmesi Gereken Event'lar:

Aşağıdaki event'ları seçin:

- ✅ **`checkout.session.completed`** (EN ÖNEMLİ - Ödeme tamamlandığında credits eklenir)
- ✅ `payment_intent.succeeded` (Ödeme başarılı olduğunda)
- ✅ `payment_intent.payment_failed` (Ödeme başarısız olduğunda)

#### Webhook Secret:

Webhook oluşturulduktan sonra, **"Signing secret"** gösterilecek:
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Bu secret'i kopyalayın ve Admin Ayarlar sayfasına girin.

---

### 2️⃣ Admin Panel'de Stripe Ayarları

1. Admin panel'e giriş yapın: `/admin/settings`
2. **Stripe Ödeme Ayarları** bölümünde şunları girin:

```
Stripe Publishable Key: pk_test_... (veya pk_live_...)
Stripe Secret Key: sk_test_... (veya sk_live_...)
Stripe Webhook Secret: whsec_...
```

3. **"Ayarları Kaydet"** butonuna tıklayın

---

### 3️⃣ Paketlere Stripe Price ID Ekleme

Her credit paketi için Stripe'da **Price** oluşturmanız gerekiyor:

#### Stripe Dashboard'da:

1. **Products** > **"Add Product"** tıklayın
2. Product bilgilerini girin:
   - **Name:** "1 Credit", "5 Credits", vb.
   - **Description:** Opsiyonel
3. **Pricing** bölümünde:
   - **Price:** 9.99 USD
   - **Billing period:** One time
4. **Save product**
5. Price ID'sini kopyalayın: `price_xxxxxxxxxxxxx`

#### Admin Panel'de:

1. `/admin/packages` sayfasına gidin
2. Her paketi düzenleyin ve **Stripe Price ID (USD)** alanına price ID'yi girin
3. Kaydedin

---

## 🔄 Nasıl Çalışır?

### Satın Alma Akışı:

```
1. Kullanıcı Landing Page'de pakete tıklar
   ↓
2. Login kontrolü yapılır
   ↓
3. /api/stripe/checkout API'si Stripe Checkout Session oluşturur
   ↓
4. Kullanıcı Stripe'ın ödeme sayfasına yönlendirilir
   ↓
5. Ödeme yapılır
   ↓
6. Stripe webhook'a checkout.session.completed event'i gönderir
   ↓
7. /api/stripe/webhook API'si:
    - Event'i doğrular (signature check)
    - Kullanıcının credits'ini artırır
    - Transaction kaydı oluşturur
   ↓
8. Kullanıcı /payment/success sayfasına yönlendirilir
```

### Webhook İmza Doğrulama:

Webhook'lar **imza doğrulama** ile korunmuştur. Bu sayede:
- ✅ Sadece Stripe'dan gelen webhook'lar kabul edilir
- ✅ Sahte/manipüle edilmiş webhook'lar reddedilir
- ✅ Replay attack'larına karşı koruma

---

## 🧪 Test Etme

### Test Card Bilgileri:

```
Card Number: 4242 4242 4242 4242
Expiry: Herhangi bir gelecek tarih (ör: 12/34)
CVC: Herhangi 3 haneli sayı (ör: 123)
ZIP: Herhangi 5 haneli sayı (ör: 12345)
```

### Test Senaryoları:

1. ✅ **Başarılı Ödeme:**
   - Pakete tıkla
   - Test card ile ödeme yap
   - Success sayfasına yönlendirilmeli
   - Credits artmış olmalı

2. ✅ **İptal Edilen Ödeme:**
   - Pakete tıkla
   - Stripe sayfasında "Cancel" tıkla
   - Cancelled sayfasına yönlendirilmeli
   - Credits değişmemeli

3. ✅ **Login Olmadan Satın Alma:**
   - Logout ol
   - Pakete tıkla
   - Login sayfasına yönlendirilmeli

---

## 🐛 Sorun Giderme

### Webhook Tetiklenmiyor:

1. Stripe Dashboard > Webhooks > Event logs kontrol edin
2. Webhook URL'nin doğru olduğundan emin olun
3. Webhook secret'in admin panelde doğru girildiğinden emin olun

### Credits Eklenmiyor:

1. Server log'larını kontrol edin (Vercel > Deployment > Functions)
2. `checkout.session.completed` event'ının webhook'ta listelendiğinden emin olun
3. Transaction tablosunda kayıt oluşmuş mu kontrol edin:
   ```sql
   SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
   ```

### Local Test:

Stripe CLI ile local test:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## 📊 Veritabanı Şeması

### Transactions Tablosu:

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users_profile(id),
  package_id UUID REFERENCES credit_packages(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL,
  currency TEXT,
  credits_added INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ
);
```

---

## 🔐 Güvenlik Notları

- ⚠️ **Secret Key'leri asla frontend'e expose etmeyin**
- ⚠️ **Webhook secret her zaman doğrulayın**
- ⚠️ **Production'da pk_live_ ve sk_live_ kullanın**
- ⚠️ **Test key'leri asla production'a deploy etmeyin**

---

## 📚 Kaynaklar

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## ✅ Checklist

Stripe entegrasyonunun tam çalıştığından emin olmak için:

- [ ] Stripe API keys admin panele girildi
- [ ] Webhook URL Stripe'da oluşturuldu
- [ ] Webhook secret admin panele girildi
- [ ] Her pakete Price ID eklendi
- [ ] Test card ile başarılı ödeme yapıldı
- [ ] Credits doğru eklendi
- [ ] Transaction kaydı oluştu
- [ ] Success/Cancel sayfaları çalışıyor

