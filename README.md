# SketchSage - Sanat Feedback Platformu

Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarına profesyonel feedback alan modern bir web platformu.

## 🚀 Teknoloji Yığını

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, RLS)
- **Ödeme**: Stripe
- **Storage**: Cloudflare R2
- **Captcha**: Cloudflare Turnstile
- **Zengin Metin Editörü**: Tiptap
- **Deployment**: Vercel

## 📋 Kurulum

### 1. Bağımlılıkları Kurun

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyasını düzenleyin ve kendi değerlerinizi girin:

```env
# Supabase (Zaten ayarlanmış)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (Stripe Dashboard'dan alınacak)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2 (Cloudflare Dashboard'dan alınacak)
CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=sketchsage
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=...

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

### 3. Database Migration

`supabase/README.md` dosyasındaki talimatları takip ederek database migration'larını çalıştırın.

### 4. Development Server

```bash
npm run dev
```

Tarayıcınızda http://localhost:3000 adresini açın.

## 📁 Proje Yapısı

```
sketchsage/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public sayfalar (landing)
│   ├── (user)/              # Kullanıcı sayfaları
│   ├── (admin)/             # Admin dashboard
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React bileşenleri
│   ├── auth/               # Auth bileşenleri
│   ├── landing/            # Landing page bileşenleri
│   ├── user/               # Kullanıcı bileşenleri
│   ├── admin/              # Admin bileşenleri
│   ├── ui/                 # UI bileşenleri
│   └── upload/             # Upload bileşenleri
├── lib/                     # Utility fonksiyonları
│   ├── supabase/           # Supabase client'ları
│   ├── stripe/             # Stripe utilities
│   ├── r2/                 # Cloudflare R2 utilities
│   └── utils/              # Genel utilities
├── types/                   # TypeScript type tanımları
├── supabase/               # Database migration'lar
│   └── migrations/         # SQL dosyaları
├── public/                  # Static dosyalar
└── middleware.ts           # Next.js middleware

```

## 🔐 Authentication

Supabase Auth kullanıyoruz:
- Email/Password
- Google OAuth (opsiyonel)
- Facebook OAuth (opsiyonel)
- Email doğrulama
- Şifre sıfırlama

## 💳 Ödeme Sistemi

Stripe ile 3 farklı credit paketi:
1. 1 Credit - $9.99 / ₺349.99
2. 5 Credits - $39.99 / ₺1,399.99
3. 10 Credits - $69.99 / ₺2,449.99

## 📊 Database Şeması

- `users_profile` - Kullanıcı profilleri ve credit bilgisi
- `evaluations` - Değerlendirme istekleri
- `evaluation_questions` - Kullanıcı soruları
- `credit_packages` - Credit paketleri
- `transactions` - Ödeme işlemleri
- `system_settings` - Sistem ayarları
- `landing_content` - Landing page içeriği (çoklu dil)
- `public_gallery` - Herkese açık galeri

## 🛡️ Row Level Security (RLS)

Tüm tablolarda RLS aktiftir:
- Kullanıcılar sadece kendi verilerini görüp düzenleyebilir
- Admin kullanıcılar tüm verilere erişebilir
- Public gallery herkes tarafından görülebilir

## 🌍 Çoklu Dil Desteği

- Türkçe (TR)
- İngilizce (EN)

`next-intl` kullanılarak implement edilecek.

## 🚀 Deployment (Vercel)

### Adım 1: Vercel'e Import
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New" > "Project" tıklayın
3. GitHub repository'nizi seçin (`sketchsage`)
4. Framework preset olarak **Next.js** seçildiğinden emin olun

### Adım 2: Environment Variables Ekleyin

Vercel'de "Configure Project" kısmında **Environment Variables** bölümüne şunları ekleyin:

**Supabase (Zorunlu)**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

> ⚠️ **Önemli:** `SUPABASE_SERVICE_ROLE_KEY` Stripe webhook'ları için zorunludur!  
> Supabase Dashboard → Settings → API → "service_role" key'ini kopyalayın.  
> Bu key çok gizlidir, **asla frontend'de kullanmayın!**

**Stripe (Opsiyonel - Ödeme için gerekli)**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_SECRET_KEY=sk_test_xxx...
```

**Cloudflare R2 (Opsiyonel - Medya storage için gerekli)**
```
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=sketchsage
```

**App URL (Önemli - Callback için)**
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Adım 3: Deploy

"Deploy" butonuna tıklayın. Build süreci başlayacak (~2-3 dakika).

### Adım 4: Domain Ayarları

Deploy tamamlandıktan sonra:
1. Vercel'den size verilen domain'i kopyalayın (örn: `sketchsage.vercel.app`)
2. Supabase Dashboard > Authentication > URL Configuration'a gidin
3. **Site URL**: `https://your-project.vercel.app`
4. **Redirect URLs**: `https://your-project.vercel.app/auth/callback`

### Önemli Notlar

⚠️ **İlk Deploy'da Şunları Kontrol Edin:**
- Environment variables'ın hepsi doğru girilmiş olmalı
- Supabase URL'leri güncel olmalı
- Database migration'ları Supabase'de çalıştırılmış olmalı

⚠️ **Build Hatası Alırsanız:**
- Vercel build log'larını inceleyin
- TypeScript hatalarını kontrol edin
- Environment variables'ların eksik olmadığından emin olun

### Güncelleme Deploy'u

Kod değişikliklerinden sonra:
```bash
git add .
git commit -m "feat: new feature"
git push
```

Vercel otomatik olarak yeni deploy başlatır.

## 📝 Sıradaki Adımlar

1. ✅ Proje kurulumu
2. ✅ Database şeması
3. ⏳ Auth sistemi implement
4. ⏳ Landing page tasarımı
5. ⏳ Kullanıcı paneli
6. ⏳ Admin dashboard
7. ⏳ Stripe entegrasyonu
8. ⏳ Cloudflare R2 entegrasyonu
9. ⏳ Çoklu dil desteği
10. ⏳ Testing & deployment

## 📞 Destek

Herhangi bir sorunuz varsa, proje sahibi ile iletişime geçin.

## 📄 Lisans

Bu proje özel bir projedir.

