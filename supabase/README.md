# Supabase Database Setup

Bu klasörde SketchSage projesinin database migration dosyaları bulunmaktadır.

## Migration Dosyalarını Çalıştırma

### Yöntem 1: Supabase SQL Editor (Önerilen)

1. https://app.supabase.com adresine gidin
2. SketchSage projenizi açın
3. Sol menüden **SQL Editor**'ü seçin
4. **New Query** butonuna tıklayın
5. Aşağıdaki migration dosyalarını **sırayla** kopyalayıp çalıştırın:

#### Sıra:
1. `002_create_system_settings.sql` (İlk önce bu çalıştırılmalı)
2. `001_create_users_profile.sql`
3. `003_create_evaluations.sql`
4. `004_create_evaluation_questions.sql`
5. `005_create_credit_packages.sql`
6. `006_create_transactions.sql`
7. `007_create_landing_content.sql`
8. `008_create_public_gallery.sql`
9. `009_create_helper_functions.sql`

Her dosyanın içeriğini kopyalayın, SQL Editor'e yapıştırın ve **RUN** butonuna basın.

### Yöntem 2: Supabase CLI (İsteğe Bağlı)

Supabase CLI kurulu ise:

```bash
# CLI kur (eğer yoksa)
npm install -g supabase

# Projeye bağlan
supabase link --project-ref sddxqcsjynfxlodchopc

# Migration'ları push et
supabase db push
```

## Migration Sonrası Kontrol

Migration'lar başarıyla çalıştıktan sonra:

1. **Tables** bölümünden aşağıdaki tabloların oluştuğunu kontrol edin:
   - users_profile
   - system_settings
   - evaluations
   - evaluation_questions
   - credit_packages
   - transactions
   - landing_content
   - public_gallery

2. **Database** → **Roles** → **Tables** bölümünden RLS politikalarının aktif olduğunu kontrol edin.

3. **Authentication** → **Providers** bölümünden Email provider'ın aktif olduğunu kontrol edin.

## Admin Kullanıcı Oluşturma

İlk admin kullanıcınızı oluşturmak için:

1. Normal bir kullanıcı olarak kaydolun (sign up)
2. SQL Editor'de aşağıdaki komutu çalıştırın (USER_ID'yi kendi ID'nizle değiştirin):

```sql
-- Kullanıcının ID'sini bul
SELECT id, email FROM auth.users;

-- Admin rolü ekle
UPDATE auth.users
SET raw_user_meta_data = 
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
WHERE id = 'YOUR_USER_ID_HERE';
```

## OAuth Ayarları (İsteğe Bağlı)

Google ve Facebook OAuth'u aktifleştirmek için:

1. **Authentication** → **Providers**'a gidin
2. Google ve/veya Facebook provider'ı seçin
3. Client ID ve Secret'ları girin
4. Redirect URL'leri kaydedin

## Storage Ayarları

Cloudflare R2 kullanacağımız için Supabase Storage'ı şimdilik yapılandırmaya gerek yok.

