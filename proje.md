Uygulamamız bir kara kalem, suyu boya, yağlı boya, pastel boya çalışmalarına yorum feedback dönen bir web uygulaması olacak.  Kullanıcıların yüklediği resmlere yada videolara yazılı veya sesli geri dönüş yapılan bir sanat platform platformu. 

- Proje frontend ‘i nextjs ile yazılmalı ve yüksek mobil uyumluluğu olmalı
- Database supabase ‘de olacak.
- Backend servisleri yine supabase’de olacak.
- Authantication için ve email doğrulama şifremi unuttum gibi mailleri göndermek için supabase alt yapısını kullanacağız.
- Google ve Facebook aut olsun ama kapatılıp açılabilir olmalı.
- Ödeme alt yapısı olarak stripe kullanacağım.
- Github ‘a göndereceğiz kodları
- Uygulamayı vercel ‘de host edeceğim.
- İngilizce ve Türkçe dillerini desteklemeli
- Ödeme olarak Türkiye için TL diğer ülkeler için Dolar para birimi ile ödeme almalı
- Supabase'in **Row-Level Security (RLS)** özelliği ve kullanıcı rolleri ile Admin yetkilendirmesi
- Video ve image Storage olarak cloudflare R2 kullanabiliriz.
- Cacpha olarak cloudflare turnstile kullanalım.

Kullanıcı Uygulaması Feature’ları

- Üye olma
- Üye girişi
- Profilim sayfası
- Şifre değiştirme
- Privacy policy sayfası
- Landing page
- Resim upload
- Video upload
- Bekleyen ve geçmiş değerlendirmeler ekranı
- Tamamlanan değerlendirme için like butonu ve yorum yapma imkanı olmalı.
- Her değerlendirme için soru sorma hakkı olacak, bu hak sayısını admin admin dashboarddan ayarlayabilecek, şimdilik default değer olarak 2 diyebiliriz.
- Abonelik paketi değil 3 farklı ticket satacağım. 1 Credit 9.99 5 Credit 39,99 ve 10 Credit 69,99 dolar.

Landing page

- Hero alanı
- Örnek imajların gösterilediği alan
- How to anlatım alanı
- Paket fiyatları alanı
- Sıkça sorulan sorular alanı

Limitler

- Her kullanıcının ticket sayısı olacak üye olan herkese 1 ticket hediye edeceğiz, bu sayıyı admin panelden değiştirebilmeliyim. DEğiştirilince yeni gelen kullanıcılar için geçerli olur eski kullanıcılar etkilenmez.
- Kullanıcılar isterlerse 3 Credet paketinden isteklerini istedikleri adette tek tek satın alabilirler.  Bu 3 paketteki ticket sayısı ve fiyatını admin ekranda admin kullanıcı ayarlamalı.
- Kullanıcı nir feedback işlemini başlattığında credit’i kontrol edilmeli ve credit’i olmayan kullanıcı Buy Credit sayfasına yönlendirilmeli.
- Kullanıcıların yükleyecekleri Video limiti 30 mb ‘ı geçmemeli, imajlar da 3mb i geçmemeli. Bu limitleri admin ekranından değiştirebilmeliyim.

Admin Page

- Genel ayarlar (stripe keyler gibi, Değerlendirmelere sorulabilecek soru sayısının ayarı.)
- Landing page feature yönetimi (hero, how to, paket, sss)
- Hero alanındaki butonun yazısını değiştirebilmeliyim
- Örnek imaj yada videoların yönetildiği alan
- Paket başlık, fiyat, açık, price id yönetimi
- Tüm değerlendirme istekleri, filtrelene bilmeli, bekleyen tamamlanmış.
- Değerlendirme detay ekranında gönderilen imaj gösterilmeli yanında da zengin bir metin editörü ile resme bakarak cevap verilebilmeli.
- Değerlendirme detay ekranında gönderilen bir video ise video oynatılabilmeli hem video izlenip hem de zengin metin editrüne giriş yapılabilmeli.

Kullanıcı uygulamayı ilk açtığında landingpage ile karşılaşır, hero alanından Get Feedback Now butonuna basınca karşına modern ve sanatsal görünümlü bir modal açılır buraya yüklemek istediği video veya resmi upload etme seçeneğini görür upload işlemi bitince upload ettiği imaj yada videoyu aynı modal’da gösteririz ve altında kendi yorumunu özellikle neye feedback istediğini yazmasını isteriz. Onu da bitirip Send Now butonuna basınca üye giriş ekranına göndeririz, kullanıcı üye olur yada üye girişini yapınca kendi profilim altındaki geçmiş bekleyen değerlendirmeler bölümünü görür.

Kullanıcının zaten bekleyen değerlendirmesi var ise yeni bir değerlendirme gönderemez.

Geçmiş değerlendirmeler ekranı

Her kullanıcı kendi değerlendirme ekranında bu ekranda mevcut kalan değerlendirme hakkını sayı olarak görmesi gerekiyor ve yeni değerlendirme akışını başlatabilmeli. Yine bu ekranda mevcut bekleyen aktif yada geçmiş tamamlanmış değerlendirmelerini görebilecek. Bu değerlendirmeler gönderilen imaj ise imaj olarak gösterilecek video olanlar ise videonun ilk ekran görüntüsü ve üzerinde player iconu olarak gösterilecek.  Ayrıca değerlendirme tarih bilgisini, değerlendirme türü iconu (ses yada yazı ile), durumunu (Bekliyor, Tamamlandı, Devam Ediyor) ve soru cevap sayısını göstermemiz gerekiyor.

Değerlendirme Detay Ekranı.

Video var ise video play ile oynatılabileceği bir alan. Resim ise resim gösterilecek

Değerlendirme gönderilirken iletilen mesaj

Değerlendirme sesli ise audio oynatma player ı 

Değerlendirme yazılı ise değerlendirme yazısı

Soru hakkı ve soru sorma textbox’ı altında soru ile bağlantılı olduğu anlaşılan cevap texti

Begen butonu 

Değerlendirmeye yorum bırak alanı

Kullanıcılara geri bildirim yada sorularına cevap geldiğinde hem email atmalıyız hem de websitenisinde notification göstermeliyiz.

Public Libabry

Topluluğun gönderdiği geri bildirim eserlerinden bazılarını listeleyebileceğimiz yer.