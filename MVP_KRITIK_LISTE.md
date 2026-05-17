# avuc — Muhakkak Olması Gereken Backend Özellikleri (MVP Kritik Listesi)

> Bu liste, projenin **üretim ortamında çalışabilmesi için asgari düzeyde zorunlu** olan backend özelliklerini içerir. Kalan her şey ikincil önceliklidir.

---

## 1. API Sunucusu ve Veritabanı

- [ ] **REST API sunucusu** kurulmalı (Node.js/Express, NestJS, Python/FastAPI vb.)
- [ ] **İlişkisel veritabanı** (PostgreSQL) kurulmalı ve bağlanmalı
- [ ] **ORM** (Prisma, TypeORM vb.) ile veri modelleri tanımlanmalı
- [ ] **Tüm CRUD operasyonları** API endpoint'leri üzerinden yapılmalı (ilan, kullanıcı, bağış, görev)
- [ ] **Veri kalıcılığı** sağlanmalı — sayfa yenilenince veri kaybolmamalı

---

## 2. Kimlik Doğrulama ve Yetkilendirme (Auth)

- [ ] **Kullanıcı kayıt (register)** endpoint'i
- [ ] **Giriş (login)** endpoint'i — JWT Access + Refresh Token
- [ ] **Şifre hash'leme** (bcrypt/Argon2)
- [ ] **Telefon doğrulama** (SMS OTP — Twilio, Netgsm vb.)
- [ ] **Kimlik doğrulama (KYC)** — e-Devlet veya manuel onay akışı
- [ ] **Rol tabanlı yetkilendirme** — `user`, `admin`, `moderator` rolleri
- [ ] **Admin paneli** sadece yetkili kullanıcılara açık olmalı

---

## 3. İlan Yönetimi

- [ ] **İlan oluşturma** — form verisi API'ye gönderilmeli ve DB'ye kaydedilmeli
- [ ] **İlan listeleme** — şehir, tür, durum filtrelemesi backend'de yapılmalı
- [ ] **İlan onay akışı** — admin onayı bekleme → onaylandı/reddedildi durumları
- [ ] **İlan raporlama (şikayet)** — kullanıcılar sahte ilan bildirebilmeli
- [ ] **İlan durumu takibi** — "Bekliyor", "Eşleşti", "Tamamlandı", "Yardım yolda"

---

## 4. Eşleştirme Motoru

- [ ] **Konum bazlı eşleştirme** — şehir/ilçe eşleşmesi (ileride lat/lng)
- [ ] **Eşleşme önerisi API'si** — tamamlayıcı ilanları öneren endpoint
- [ ] **Eşleşme isteği/kabul akışı** — kullanıcılar eşleşmeyi onaylayabilmeli

---

## 5. Harita ve Konum

- [ ] **Gerçek harita entegrasyonu** — Leaflet, Mapbox veya Google Maps
- [ ] **Pin'lerin dinamik gösterimi** — DB'deki ilanlar haritada otomatik görünmeli
- [ ] **Adres → Koordinat dönüşümü** (Geocoding)

---

## 6. Bağış Altyapısı

- [ ] **Ödeme entegrasyonu** — iyzico, PayTR veya Stripe
- [ ] **Bağış kaydı** — her bağışın DB'de saklanması
- [ ] **Bağış takip durumu** — "Alındı", "Hazırlanıyor", "Yolda", "Teslim edildi"

---

## 7. Gönüllü ve Görev Yönetimi

- [ ] **Göreve katılım kaydı** — backend'e kayıt atılmalı
- [ ] **Görev kapasitesi kontrolü** — kota dolunca katılım kapanmalı
- [ ] **Kullanıcı puanı/itibar sistemi** — tamamlanan yardımlara göre puan hesaplama

---

## 8. Gerçek Zamanlı ve Bildirimler

- [ ] **WebSocket/Socket.io** — canlı ilan güncellemeleri, yeni eşleşmeler
- [ ] **Push Notification** — FCM (Firebase Cloud Messaging) entegrasyonu
- [ ] **SMS bildirim** — ilan onayı, eşleşme, acil durum için SMS

---

## 9. Güvenlik (Asgari)

- [ ] **Sunucu taraflı form validasyonu** — tüm input'lar backend'de kontrol edilmeli
- [ ] **Rate limiting** — brute-force ve spam koruması
- [ ] **CORS yapılandırması**
- [ ] **Input sanitization** — XSS ve SQL/NoSQL injection koruması
- [ ] **Hassas veri şifreleme** — telefon, adres, TC kimlik no veritabanında şifreli tutulmalı

---

## 10. Yasal Uyumluluk

- [ ] **KVKK/GDPR uyumu** — kişisel veri saklama, işleme ve silme prosedürleri
- [ ] **Kullanıcı onay akışı** — üyelik sırasında kullanıcı sözleşmesi ve gizlilik politikası onayı

---

## Bu Liste Tamamlandığında Neler Olur?

| Özellik | Etki |
|---------|------|
| API + DB | Veriler kalıcı olur, uygulama gerçek hayatta çalışır |
| Auth | Her kullanıcı kendi hesabıyla işlem yapar, güvenlik sağlanır |
| İlan CRUD | Afetzedeler ve yardımseverler gerçekten ilan verebilir |
| Eşleştirme | İhtiyaç sahibi ile yardımsever buluşur |
| Harita | Yardım noktaları ve ilanlar coğrafi olarak görülebilir |
| Bağış | Finansal destek toplanabilir, takip edilebilir |
| Bildirimler | Kullanıcılar anlık olarak haberdar edilir |
| Güvenlik | Uygulama saldırılara karşı korunur |

---

> **Not:** Bu 10 madde tamamlandığında `avuc` MVP olarak canlıya alınabilir. Kalan her şey (dashboard, analitik, AI moderasyon, rota optimizasyonu vb.) sonraki iterasyonlara bırakılabilir.
