# avuc Projesi — Backend Eksiklikleri Raporu

> **Proje Türü:** React + Vite Frontend (SPA)  
> **Durum:** Sadece istemci taraflı (client-side) çalışan, statik dummy verilerle beslenen bir prototip. **Herhangi bir backend servisi, API veya veritabanı yok.**

---

## 1. API Katmanı ve Sunucu Mimarisi

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 1.1 | **Backend servisi yok** | Proje tamamen statik dosyalardan oluşuyor. Node.js/Python/Go/Java vb. herhangi bir sunucu tarafı runtime yok. | Kritik |
| 1.2 | **REST/GraphQL API endpointleri yok** | Tüm veri erişimi `src/data.js` içinden import edilen dummy array'ler üzerinden sağlanıyor. CRUD operasyonları için endpoint yok. | Kritik |
| 1.3 | **HTTP istemcisi (axios/fetch) yok** | Hiçbir yerde API çağrısı yapılmıyor. Veri alışverişi tamamen prop drilling ve statik import ile sınırlı. | Kritik |
| 1.4 | **API dökümantasyonu yok** | OpenAPI/Swagger veya benzeri bir sözleşme tanımlı değil. | Orta |
| 1.5 | **Versiyonlama stratejisi yok** | API versiyonlama (`/v1`, `/v2`) planlanmamış. | Düşük |

---

## 2. Veritabanı ve Veri Kalıcılığı

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 2.1 | **Veritabanı bağlantısı yok** | PostgreSQL, MySQL, MongoDB, SQLite vb. hiçbir veri saklama katmanı yok. | Kritik |
| 2.2 | **ORM/ODM kullanımı yok** | Prisma, TypeORM, Sequelize, Mongoose vb. veri modelleme aracı yok. | Kritik |
| 2.3 | **Veri kalıcılığı yok** | Sayfa yenilendiğinde tüm state sıfırlanıyor. İlanlar, bağışlar, görevler, kullanıcı tercihleri kayboluyor. | Kritik |
| 2.4 | **Veri migrasyon sistemi yok** | Şema değişikliklerini yönetecek migration aracı (Prisma Migrate, Flyway, Liquibase) yok. | Orta |
| 2.5 | **Yedekleme (backup) stratejisi yok** | Veritabanı yedeği alınacak mekanizma bulunmuyor. | Orta |
| 2.6 | **Transaction yönetimi yok** | Çok adımlı işlemlerde (örn: bağış + bildirim + puan güncelleme) ACID garantisi sağlanamıyor. | Yüksek |

---

## 3. Kimlik Doğrulama ve Yetkilendirme (AuthN/AuthZ)

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 3.1 | **Kullanıcı kayıt sistemi yok** | Üyelik formu yok. Profil sayfasındaki kullanıcı (`Elif Kaya`) hardcoded. | Kritik |
| 3.2 | **Giriş/Çıkış (Login/Logout) mekanizması yok** | Token tabanlı oturum yönetimi (JWT, session cookie) yok. | Kritik |
| 3.3 | **Şifre yönetimi yok** | Bcrypt, Argon2 vb. hashing mekanizması yok. Şifre sıfırlama akışı yok. | Kritik |
| 3.4 | **Telefon doğrulama yok** | SMS OTP entegrasyonu (Twilio, AWS SNS, Netgsm) yok. Sadece UI'da "Doğrulandı" yazısı var. | Yüksek |
| 3.5 | **Kimlik doğrulama (KYC) yok** | e-Devlet, Yeni Kimlik (NFC), selfie + ID kart karşılaştırması vb. entegrasyon yok. | Yüksek |
| 3.6 | **Rol tabanlı yetkilendirme (RBAC) yok** | Admin paneline erişim herkese açık. `isAdmin` gibi bir kontrol yok. | Kritik |
| 3.7 | **OAuth/Sosyal giriş yok** | Google, Apple, Twitter/X ile giriş entegrasyonu yok. | Orta |
| 3.8 | **Oturum güvenliği yok** | HttpOnly cookie, CSRF token, refresh token rotation yok. | Yüksek |

---

## 4. İlan ve İçerik Yönetimi

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 4.1 | **İlan oluşturma sunucuya gitmiyor** | "Evimi Açmak İstiyorum" ve "İlan Ver" formları submit edildiğinde sadece `onToast()` çağrılıyor. Veri kaydedilmiyor. | Kritik |
| 4.2 | **İlan onay/reddetme süreci simülasyon** | Admin panelindeki Onayla/Reddet butonları sadece local state'ten kaldırıyor. Sunucuya istek gitmiyor. | Kritik |
| 4.3 | **İlan durumu takibi yok** | "Admin onayı bekliyor", "Doğrulanmış" gibi durumlar backend'de saklanmıyor. | Yüksek |
| 4.4 | **İlan raporlama (şikayet) sistemi yok** | "Sahte ilan raporu" sadece UI listesi. Gerçek bir şikayet kaydı ve moderasyon akışı yok. | Yüksek |
| 4.5 | **İlan arama ve filtreleme backend'de yok** | Tüm filtreleme (şehir, ilçe, kapasite, özellikler) client-side JavaScript ile yapılıyor. Büyük veri setinde performans sorunu yaşanır. | Yüksek |
| 4.6 | **İlan soft-delete (çöp kutusu) yok** | Silinen içerikler geri getirilemez şekilde yok olur. | Orta |
| 4.7 | **İlan versiyonlama yok** | Düzenlenen ilanların geçmişi tutulmuyor. | Düşük |
| 4.8 | **İlan görsel/belge yükleme yok** | Ev fotoğrafı, depo görseli, araç fotoğrafı vb. dosya yükleme (S3, MinIO, Cloudinary) entegrasyonu yok. | Yüksek |

---

## 5. Eşleştirme ve Koordinasyon Motoru

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 5.1 | **Akıllı eşleştirme algoritması yok** | `getSuggestions()` fonksiyonu sadece aynı şehri filtreleyen basit bir client-side fonksiyon. Gerçek bir matching engine yok. | Kritik |
| 5.2 | **Konum bazlı eşleştirme yok** | Coğrafi koordinat (lat/lng), mesafe hesaplama (Haversine), rota optimizasyonu yok. Sadece metin tabanlı şehir adı karşılaştırması var. | Kritik |
| 5.3 | **Eşleşme onay/ret akışı yok** | "Eşleşme öner" butonu sadece toast mesajı gösteriyor. Gerçek bir eşleşme isteği ve kabul/red mekanizması yok. | Kritik |
| 5.4 | **Eşleşme geçmişi ve loglama yok** | Hangi kullanıcı ne zaman kimiyle eşleşti bilgisi saklanmıyor. | Yüksek |
| 5.5 | **Öncelik sıralama algoritması yok** | Aciliyet, mesafe, kullanıcı puanı gibi kriterlere göre sıralama backend'de hesaplanmıyor. | Yüksek |

---

## 6. Harita ve Konum Servisleri

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 6.1 | **Gerçek harita entegrasyonu yok** | Google Maps, Leaflet, Mapbox, Yandex Maps vb. kullanılmıyor. Sadece CSS grid üzerinde renkli noktalar (dummy pin) var. | Kritik |
| 6.2 | **Konum doğrulama/coğrafi kodlama yok** | Adres → Koordinat (geocoding) ve Koordinat → Adres (reverse geocoding) servisi yok. | Yüksek |
| 6.3 | **Gerçek zamanlı konum takibi yok** | Araçların canlı konumunu gösterecek GPS/WebSocket entegrasyonu yok. | Yüksek |
| 6.4 | **Rota planlama API'si yok** | En kısa rota, trafik durumu, tahmini varış süresi hesaplanmıyor. | Orta |
| 6.5 | **Harita pinleri dinamik değil** | `mapPoints` array'i statik. Yeni ilanlar haritaya otomatik yansımıyor. | Yüksek |

---

## 7. Bağış ve Ödeme Altyapısı

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 7.1 | **Ödeme entegrasyonu yok** | iyzico, PayTR, Stripe, Papara vb. ödeme sağlayıcı entegrasyonu yok. | Kritik |
| 7.2 | **Bağış kaydı ve fiş/fatura yok** | Bağış makbuzu, vergi indirimi belgesi oluşturma yok. | Yüksek |
| 7.3 | **Bağış takibi backend'de yok** | "Araca yüklendi", "Teslim edildi" gibi durumlar sadece animasyon. Gerçek bir durum makinesi (state machine) yok. | Yüksek |
| 7.4 | **Bağışçı bilgileri saklanmıyor** | Anonim veya isimli bağışçı kaydı yok. | Yüksek |
| 7.5 | **Para transferi ve şeffaflık raporu yok** | Toplanan bağışların nereye harcandığına dair raporlama yok. | Orta |

---

## 8. Gerçek Zamanlı Özellikler ve Bildirimler

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 8.1 | **WebSocket/SSE bağlantısı yok** | Canlı ilan güncellemeleri, yeni eşleşmeler, acil durum bildirimleri anlık iletilemiyor. | Kritik |
| 8.2 | **Push notification yok** | Firebase Cloud Messaging (FCM), OneSignal, Pusher vb. entegrasyon yok. | Yüksek |
| 8.3 | **SMS bildirim yok** | İlan onayı, eşleşme, acil durum için SMS gönderimi yok. | Yüksek |
| 8.4 | **E-posta servisi yok** | SendGrid, AWS SES, Mailgun vb. ile e-posta gönderimi yok. | Orta |
| 8.5 | **Bildirim tercihleri yok** | Kullanıcının hangi kanaldan (SMS/e-posta/push) bildirim alacağını ayarlayabileceği bir panel yok. | Orta |

---

## 9. Gönüllü Görev ve Operasyon Yönetimi

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 9.1 | **Göreve katılım kaydı yok** | "Katıl" butonu sadece local state güncelliyor. Sunucuya kayıt gitmiyor. | Kritik |
| 9.2 | **Görev kapasitesi ve kota yönetimi yok** | "Gerekli kişi sayısı: 12" yazıyor ama gerçek zamanlı doluluk oranı hesaplanmıyor. | Yüksek |
| 9.3 | **Gönüllü puanlama ve itibar sistemi yok** | Kullanıcı puanı (örn: 96) hardcoded. Gerçek bir değerlendirme algoritması yok. | Yüksek |
| 9.4 | **Gönüllü sertifikası/rozet sistemi yok** | Rozetler (`Doğrulanmış Gönüllü`, `5 Yardıma Katıldı`) backend'de doğrulanmıyor. | Orta |
| 9.5 | **Görev takvimi ve hatırlatma yok** | Google Calendar, ICS dosyası entegrasyonu yok. | Düşük |

---

## 10. Güvenlik ve Doğrulama

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 10.1 | **Sunucu taraflı form validasyonu yok** | Tüm formlar sadece HTML5 `required` attribütü ile doğrulanıyor. Backend validasyonu yok. | Kritik |
| 10.2 | **Rate limiting yok** | Brute-force saldırılarına karşı istek sınırlaması (throttling) yok. | Kritik |
| 10.3 | **CORS politikası tanımlı değil** | API olmadığı için CORS yapılandırması da yok. Gelecekteki API'de risk oluşturur. | Yüksek |
| 10.4 | **Input sanitization yok** | XSS, SQL Injection, NoSQL Injection koruması yok. | Kritik |
| 10.5 | **API güvenlik başlıkları yok** | Helmet, HSTS, CSP, X-Content-Type-Options vb. güvenlik başlıkları yok. | Yüksek |
| 10.6 | **Loglama ve denetim (audit log) yok** | Kim ne zaman hangi veriye erişti, hangi işlemi yaptı bilgisi saklanmıyor. | Yüksek |
| 10.7 | **WAF/DDoS koruması yok** | Cloudflare, AWS WAF vb. katman yok. | Orta |
| 10.8 | **Veri şifreleme (at rest) planı yok** | Hassas verilerin (telefon, adres, TC kimlik) veritabanında şifrelenmesi planlanmamış. | Kritik |

---

## 11. Admin Paneli ve Moderasyon

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 11.1 | **Admin yetkilendirme yok** | Admin paneli herkese açık. URL'ye `#admin` yazarak erişilebiliyor. | Kritik |
| 11.2 | **Kullanıcı yönetimi yok** | Kullanıcıları listeleme, banlama, rol atama özelliği yok. | Kritik |
| 11.3 | **İçerik moderasyon aracı yok** | AI tabanlı veya manuel içerik denetimi (örn: sahte içerik tespiti) yok. | Yüksek |
| 11.4 | **Dashboard ve analitik yok** | Gerçek zamanlı istatistik, aktif kullanıcı sayısı, başarılı eşleşme oranı gibi metrikler yok. | Orta |
| 11.5 | **Veri dışa aktarma yok** | Excel/CSV/PDF olarak rapor indirme özelliği yok. | Orta |

---

## 12. Test, CI/CD ve Operasyonel Altyapı

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 12.1 | **Backend testleri yok** | Unit test, integration test, E2E test (API testi) yok. | Kritik |
| 12.2 | **API test koleksiyonu yok** | Postman, Insomnia, Bruno koleksiyonu yok. | Orta |
| 12.3 | **CI/CD pipeline yok** | GitHub Actions, GitLab CI, Jenkins vb. otomatik derleme ve deploy akışı yok. | Orta |
| 12.4 | **Docker/containerization yok** | Dockerfile, docker-compose, Kubernetes manifest yok. | Orta |
| 12.5 | **Hata izleme (Sentry, Rollbar) yok** | Üretim ortamında oluşan hataların takibi yok. | Yüksek |
| 12.6 | **Performans monitörü (APM) yok** | New Relic, Datadog, Prometheus/Grafana entegrasyonu yok. | Orta |
| 12.7 | **Health check endpoint'i yok** | `/health`, `/ready`, `/alive` gibi sağlık kontrol endpointleri yok. | Orta |

---

## 13. Yasal ve Uyumluluk

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 13.1 | **KVKK/GDPR uyumlu veri yönetimi yok** | Kişisel verilerin saklanması, işlenmesi ve silinmesi için yasal altyapı yok. | Kritik |
| 13.2 | **Kullanıcı sözleşmesi ve gizlilik politikası endpoint'i yok** | Metinler sadece statik sayfalarda olabilir ama onay mekanizması ve kayıt yok. | Yüksek |
| 13.3 | **Veri erişim ve silme hakkı (right to be forgotten) yok** | Kullanıcı hesabını ve verilerini tamamen silme mekanizması yok. | Yüksek |
| 13.4 | **Çerez (cookie) yönetimi ve izin mekanizması yok** | Cookie consent banner ve tercih yönetimi yok. | Orta |

---

## 14. Ölçeklenebilirlik ve Altyapı

| # | Eksiklik | Detay | Önem |
|---|----------|-------|------|
| 14.1 | **Load balancing yok** | Tek sunucu üzerinde çalışacak şekilde tasarlanmış. | Orta |
| 14.2 | **Cache katmanı yok** | Redis, Memcached ile sık erişilen verilerin önbelleğe alınması yok. | Yüksek |
| 14.3 | **CDN kullanımı yok** | Statik asset'ler (görseller, JS, CSS) için CDN yapılandırması yok. | Orta |
| 14.4 | **Veritabanı indeksleme ve optimizasyon planı yok** | İlan arama, konum bazlı sorgular için indeks stratejisi belirlenmemiş. | Yüksek |
| 14.5 | **Asenkron iş kuyruğu yok** | Redis/RabbitMQ/Bull ile e-posta, SMS, bildirim gibi ağır işlemlerin arka planda işlenmesi yok. | Yüksek |

---

## 15. Önerilen Backend Teknoloji Yığını (MVP İçin)

Projenin hızlı ve güvenli şekilde hayata geçirilmesi için önerilen minimum backend altyapısı:

| Katman | Öneri |
|--------|-------|
| **Runtime** | Node.js (Express/NestJS) veya Python (FastAPI/Django) |
| **Veritabanı** | PostgreSQL (ilişkisel veri) + Redis (cache & session) |
| **ORM** | Prisma (Node.js) veya SQLAlchemy (Python) |
| **Auth** | JWT (Access + Refresh Token) + bcrypt |
| **SMS/Email** | Twilio / AWS SES / Netgsm |
| **Dosya Depolama** | AWS S3 veya MinIO |
| **Harita** | Leaflet (frontend) + Mapbox/Google Maps API (geocoding) |
| **Ödeme** | iyzico / PayTR |
| **Gerçek Zamanlı** | Socket.io (WebSocket) |
| **Container** | Docker + docker-compose |
| **Monitoring** | Sentry (hata takibi) + UptimeRobot (sağlık kontrolü) |

---

## Sonuç

`avuc` projesi şu anda **yüksek kaliteli bir frontend prototipi** olarak değerlendirilebilir. Ancak **herhangi bir backend altyapısı olmadığı için üretim ortamında kullanılamaz**. Kritik eksiklikler şunlardır:

1. **API ve veritabanı**
2. **Kimlik doğrulama ve yetkilendirme**
3. **Veri kalıcılığı**
4. **Gerçek zamanlı iletişim**
5. **Güvenlik katmanları**

Bu eksiklikler giderilmeden proje sadece bir demo/tanıtım sitesi olarak kalacaktır.
Avuç

Burada sel var gibi anlık ihbar oluşturulabilir.

Hava durumu widget çekilecek hava durumu olayları kodları.

Telefon numaraları acil bütün servislerin.

Bir ses butonu olacak çok yüksek ses çıkarması için.

Konum izni whatpsapp tan konum atama.

En yakın acil toplanma yerini bulma rota oluşturucu.

Deprem öncesi deprem çantası hazırlama için güzel bir css ile hazırlanmış sayfa.

Deprem hareket ve yangın gibi afetlerde nasıl korunman gerektiğini anlatacak.

Mors kodu ledi yani o an acil mesajınızı mors koduna çevirip hepsini ışık ile iletir.

Acil durum radyosu anlık acil olarak yayın yapan yayıncıların yayını yapılacak.

Afet öncesi ve sonrası şeklinde bölümlendirmek.
