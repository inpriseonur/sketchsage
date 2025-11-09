# SEO Ayarları - SketchSage

## 📋 Genel Bakış

SketchSage, hem Türkiye hem de global pazarlar için optimize edilmiş SEO yapısına sahiptir.

## 🌍 Çoklu Dil SEO

### Hreflang Tags
- Her sayfa için `hreflang` alternatifleri otomatik eklenir
- Türkçe: `hreflang="tr"`
- İngilizce: `hreflang="en"`

### Dinamik Metadata
- Her sayfa kullanıcının diline göre metadata üretir
- Title, description, keywords dil bazlıdır

## 📄 Sayfa Bazlı SEO

### Ana Sayfa (`/`)
- **TR**: "SketchSage - Sanat Feedback Platformu"
- **EN**: "SketchSage - Professional Art Feedback Platform"
- Keywords: Sanat feedback, çizim değerlendirme, resim eleştirisi
- **Indexlenir**: ✅

### Login (`/auth/login`)
- **TR**: "Giriş Yap"
- **EN**: "Login"
- **Indexlenmez**: ❌ (noindex)

### Signup (`/auth/signup`)
- **TR**: "Kaydol"
- **EN**: "Sign Up"
- **Indexlenmez**: ❌ (noindex)

## 🗺️ Sitemap

Sitemap otomatik olarak `/sitemap.xml` adresinde oluşturulur.

**Eklenen URL'ler:**
- Ana sayfa
- Login sayfası
- Signup sayfası

**Eklenmeyen URL'ler:**
- Admin sayfaları
- Kullanıcı özel sayfaları
- API endpoint'leri

## 🤖 Robots.txt

`/robots.txt` dosyası otomatik oluşturulur.

**İzin Verilen:**
- Ana sayfa
- Public sayfalar

**Yasaklanan:**
- `/api/` - API endpoint'leri
- `/admin/` - Admin paneli
- `/my-reviews/` - Kullanıcı özel sayfaları
- `/auth/callback` - OAuth callback'leri
- `/payment/` - Ödeme sayfaları

## 📊 Structured Data (JSON-LD)

### Organization Schema
- Site adı: SketchSage
- Logo URL
- Açıklama (dil bazlı)

## 🔍 Open Graph Tags

Her sayfa için otomatik Open Graph tag'leri eklenir:
- `og:title`
- `og:description`
- `og:image`
- `og:type`
- `og:locale`
- `og:url`

## 🐦 Twitter Cards

- Card Type: `summary_large_image`
- Title, description, image otomatik eklenir

## ✅ Yapılması Gerekenler

### 1. Google Search Console
1. [Google Search Console](https://search.google.com/search-console)'a gidin
2. Sitenizi ekleyin
3. Verification code'u `lib/seo/metadata.ts` dosyasına ekleyin:
   ```typescript
   verification: {
     google: 'your-verification-code',
   }
   ```

### 2. Yandex Webmaster (Türkiye için)
1. [Yandex Webmaster](https://webmaster.yandex.com/)'a gidin
2. Sitenizi ekleyin
3. Verification code'u ekleyin:
   ```typescript
   verification: {
     yandex: 'your-verification-code',
   }
   ```

### 3. OG Image Oluşturma
- `/public/og-image.jpg` dosyası oluşturun
- Boyut: 1200x630px
- Site adı ve açıklama içermeli

### 4. Logo Dosyası
- `/public/logo.png` dosyası oluşturun
- Structured data için kullanılır

### 5. Analytics
- Google Analytics eklenebilir
- Vercel Analytics zaten aktif

## 🚀 Test Etme

### Metadata Kontrolü
```bash
# Development'da
npm run dev
# Tarayıcıda View Source ile meta tag'leri kontrol edin
```

### Sitemap Kontrolü
```
https://your-domain.com/sitemap.xml
```

### Robots.txt Kontrolü
```
https://your-domain.com/robots.txt
```

### Google Rich Results Test
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. URL'nizi girin
3. Structured data'yı kontrol edin

## 📈 SEO Best Practices

✅ **Yapılanlar:**
- Dinamik metadata
- Hreflang tags
- Sitemap.xml
- Robots.txt
- Structured data
- Open Graph
- Twitter Cards
- Mobile-friendly (Tailwind responsive)

⚠️ **Yapılacaklar:**
- OG Image oluşturma
- Logo dosyası ekleme
- Google Search Console verification
- Yandex Webmaster verification
- Analytics entegrasyonu
- Page speed optimization
- Image optimization (Next.js Image component kullanımı)

