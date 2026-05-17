# avuc — İlan Yönetimi İyileştirme Rehberi

> Bu doküman, mevcut "İlan Ver" ve "Evimi Aç" akışlarının nasıl daha kullanıcı dostu, güvenilir ve işlevsel hale getirilebileceğini anlatır. Sadece metin bazlı öneriler içerir.

---

## 1. Form Doğrulama ve Validasyon Katmanıaar

**Mevcut Durum:** Formlar HTML5 `required` attribütü ile sınırlı. Sunucu taraflı validasyon var ancak istemci taraflı detaylı geri bildirim yok.

**Öneriler:**
- Her alan için gerçek zamanlı validasyon (blur event'inde kontrol).
- Telefon numarası için format maskesi: `05xx xxx xx xx` şeklinde otomatik boşluk/ayraç.
- Kapasite alanına sadece pozitif tam sayı kabulü, min/max sınırları.
- Şehir/ilçe seçimi için otomatik tamamlama (autocomplete) ile yazım hatalarını önleme.
- Açıklama alanı için minimum karakter sayısı (örn: 50 karakter) ve maksimum sınır (örn: 1000 karakter).
- E-posta formatı kontrolü (varsa).

---

## 2. Fotoğraf ve Medya Yükleme

**Mevcut Durum:** İlanlarda görsel yok. Kullanıcı evini, aracını veya depo alanını fotoğraflayamıyor.

**Öneriler:**
- Çoklu fotoğraf yükleme (drag & drop destekli).
- Maksimum 5-10 fotoğraf, her biri max 5MB.
- Otomatik sıkıştırma (client-side) ile bandwith tasarrufu.
- Galeri önizlemesi: Yüklenen fotoğraflar küçük thumbnail olarak görünsün, sıralama yapılabilsin.
- Depolama: AWS S3, Cloudinary veya yerel sunucu üzerinde `/uploads/listings/:id/` yapısı.
- Varsayılan görseller: Kullanıcı fotoğraf yüklemezse kategori bazlı varsayılan resim (örn: ev ikonu, araç ikonu).

---

## 3. Harita Üzerinden Konum Seçme

**Mevcut Durum:** Şehir ve ilçe metin olarak giriliyor. Kesin konum (sokak, bina) yok.

**Öneriler:**
- Leaflet/OpenStreetMap entegrasyonu ile harita üzerinde pin bırakma.
- "Mevcut Konumumu Kullan" butonu ile otomatik pin.
- Adres arama (geocoding): Sokak adı yazınca haritada konum bulma.
- Pin hareket ettirilerek hassas konum ayarlama.
- Güvenlik: Tam adresi haritada gösterme, sadece yaklaşık bölge (yarıçap 500m) görünsün. Tam adres yalnızca eşleşme onaylandığında paylaşılsın.
- Koordinatlar backend'e `lat` ve `lng` olarak kaydedilsin.

---

## 4. İlan Önizleme (Preview) Akışı

**Mevcut Durum:** Form submit edildikten sonra doğrudan API'ye gidiyor. Kullanıcı yayınlanmadan önce göremiyor.

**Öneriler:**
- Son adımda "Önizle" butonu ile ilanın nasıl görüneceğini gösterme.
- Önizleme kartı: Gerçek liste görünümünde (ShelterCard benzeri) render edilsin.
- "Düzenle" ve "Yayınla" seçenekleri.
- Önizleme sırasında bilgilendirme banner'ı: "İlanınız admin onayına gönderilecek. Onay süreci ortalama 15 dakikadır."

---

## 5. Taslak Kaydetme Sistemi

**Mevcut Durum:** "Taslak kaydet" butonu var ancak sadece toast mesajı gösteriyor. Veri kayboluyor.

**Öneriler:**
- Gerçek taslak sistemi: `POST /api/listings` ile `status: 'DRAFT'` gönderme.
- Otomatik taslak kaydetme: Her 30 saniyede bir form verisi localStorage'a yazılsın.
- "Taslaklarım" sayfası: Kullanıcı yarım kalan ilanlarını listeleyip devam edebilsin.
- Taslak silme ve düzenleme.

---

## 6. Telefon ve Kimlik Doğrulama Zorunluluğu

**Mevcut Durum:** Telefon ve kimlik doğrulama rozetleri sadece UI'da var. Gerçek doğrulama akışı yok.

**Öneriler:**
- İlan yayınlamadan önce telefon doğrulaması zorunlu olsun (SMS OTP).
- Gönüllü barınma ilanları için kimlik doğrulaması (e-Devlet entegrasyonu veya manuel kimlik fotoğrafı yükleme + admin onayı).
- Doğrulama rozeti: İlan kartında "Telefon Doğrulandı" veya "Kimlik Doğrulandı" rozetleri görünsün.
- Doğrulanmamış kullanıcılar sadece "Acil İhtiyaç" ilanı verebilsin, barınma/bağış için doğrulama şartı olsun.

---

## 7. Dinamik Form Alanları ve Kategori Bazlı Akış

**Mevcut Durum:** Kategori seçince dinamik alanlar geliyor ancak sınırlı.

**Öneriler:**
- Her kategori için özel akış:
  - **Barınma:** Oda sayısı, banyo sayısı, mutfak kullanımı, ısınma tipi, internet, engelli erişimi rampası fotoğrafı.
  - **Araç:** Plaka (gizli tutulacak), ruhsat fotoğrafı, araç yılı, yakıt tipi, boş ağırlık/yük kapasitesi.
  - **Depo:** Depo fotoğrafları, güvenlik durumu (kamera/nöbetçi), giriş saatleri, nem kontrolü.
  - **Gönüllü:** Uzmanlık alanları (ilaç dağıtımı, çocuk bakımı, araç kullanımı), ehliyet sınıfı, varsa sertifikalar.
- Koşul ve kurallar: Sigara içilebilir mi? Evcil hayvan kabul ediliyor mu? Aile/tek başına/karma uygunluğu gibi checkbox'lar.

---

## 8. İlan Süresi ve Otomatik Yenileme

**Mevcut Durum:** İlan süresi metin olarak giriliyor ("7 gün"). Otomatik sonlanma yok.

**Öneriler:**
- İlan süresi takvimi: Bitiş tarihi seçici (date picker).
- Varsayılan süre: 14 gün. Max 30 gün.
- Süre dolmadan 2 gün önce e-posta/SMS bildirim: "İlanınızın süresi doluyor. Yenilemek ister misiniz?"
- Tek tıkla yenileme butonu.
- Süresi dolan ilanlar otomatik arşivlensin (soft delete) ancak kullanıcı geçmişinde görünsün.

---

## 9. İlan Durumu Takibi

**Mevcut Durum:** Admin onay bekliyor / onaylandı / reddedildi durumları var ancak kullanıcıya bildirim yok.

**Öneriler:**
- Kullanıcı panelinde "İlanlarım" sekmesi.
- Her ilan için durum zaman çizelgesi:
  1. Gönderildi → 2. Admin İncelemede → 3. Onaylandı / Reddedildi → 4. Eşleşti → 5. Tamamlandı.
- Reddedilen ilan için sebep gösterimi: Admin tarafından girilen ret nedeni kullanıcıya görünsün.
- Onaylanınca push bildirim ve SMS.

---

## 10. Çoklu Dil ve Erişilebilirlik

**Mevcut Durum:** Sadece Türkçe.

**Öneriler:**
- Form etiketleri ve açıklamaları A/B test edilebilir şekilde yapılandırılabilir olsun.
- Ekran okuyucu dostu (ARIA label'lar) form yapısı.
- Yüksek kontrast modu desteği.
- Form alanları arasında klavye navigasyonu (Tab sırası mantıklı olsun).

---

## Özet: Öncelik Sıralaması

| Öncelik | Özellik | Etki |
|---------|---------|------|
| P0 | Fotoğraf yükleme | Güven artırır, sahte ilanları azaltır |
| P0 | Harita ile konum seçme | Doğru adres bilgisi, rota planlama |
| P1 | İlan önizleme | Kullanıcı hatalarını önler |
| P1 | Telefon doğrulaması | Güven katmanı, sahte profil önleme |
| P1 | Taslak kaydetme | Kullanıcı deneyimi, veri kaybı önleme |
| P2 | İlan süresi ve yenileme | İlan kalitesi, güncel bilgi |
| P2 | Dinamik kategori alanları | Daha zengin içerik |
| P3 | Çoklu dil | Daha geniş kitleye ulaşım |

---

> Bu öneriler uygulandığında ilan kalitesi artar, sahte içerik azalır ve kullanıcılar arasındaki güven güçlenir.
