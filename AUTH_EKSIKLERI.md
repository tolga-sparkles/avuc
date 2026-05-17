# avuc — Temel Login ve Kayıt İşlemleri Eksiklik Raporu

## 1. Frontend Eksiklikleri

| # | Eksiklik | Önem | Açıklama |
|---|----------|------|----------|
| 1.1 | **Şifre görünürlük toggle'ı** | Yüksek | Login ve kayıt formlarında şifreyi göster/gizle butonu yok. |
| 1.2 | **Telefon format maskesi** | Yüksek | Telefon input'u `05xx xxx xx xx` formatında otomatik bölünmüyor. |
| 1.3 | **Şifre güçlülük göstergesi** | Orta | Kayıt sırasında şifrenin ne kadar güçlü olduğunu gösteren bar yok. |
| 1.4 | **Beni hatırla (Remember me)** | Orta | Token'ın ne kadar saklanacağını seçme seçeneği yok. |
| 1.5 | **Form temizleme** | Orta | Modal kapandığında form verileri ve hata mesajları sıfırlanmıyor. |
| 1.6 | **Şifremi unuttum** | Yüksek | Şifre sıfırlama linki ve akışı tamamen yok. |
| 1.7 | **Telefon doğrulama UI'sı** | Yüksek | OTP giriş ekranı yok. `phoneVerified` sadece boolean. |
| 1.8 | **Kullanıcı bilgisi güncelleme** | Orta | Profil düzenleme, şifre değiştirme UI'sı yok. |
| 1.9 | **Spesifik hata mesajları** | Düşük | "Giriş yapılamadı" gibi genel hata yerine alan bazlı mesaj yok. |
| 1.10 | **Form validasyonu** | Yüksek | Gerçek zamanlı alan validasyonu (email formatı, telefon uzunluğu) yok. |

## 2. Backend Eksiklikleri

| # | Eksiklik | Önem | Açıklama |
|---|----------|------|----------|
| 2.1 | **JWT_SECRET fallback** | Kritik | `process.env.JWT_SECRET || 'secret'` — env yoksa tahmin edilebilir secret kullanılıyor. |
| 2.2 | **Brute-force koruması** | Kritik | Login endpoint'i rate-limited değil, sınırsız deneme yapılabilir. |
| 2.3 | **Telefon format validasyonu** | Yüksek | `05xx` formatında olup olmadığı kontrol edilmiyor. |
| 2.4 | **E-posta format validasyonu** | Orta | Email alanı opsiyonel ama girildiğinde formatı kontrol edilmiyor. |
| 2.5 | **Şifre sıfırlama endpoint'i** | Yüksek | Forgot password akışı yok. |
| 2.6 | **Telefon doğrulama endpoint'i** | Yüksek | OTP gönderme/doğrulama endpoint'i yok. |
| 2.7 | **Kullanıcı bilgilerini güncelleme** | Orta | `PATCH /users/me` endpoint'i yok. |
| 2.8 | **Token revoke/blacklist** | Orta | Çıkış yapıldığında token geçersiz kılınmıyor. |
| 2.9 | **User role middleware** | Orta | Admin ve moderatör yetki kontrolü sadece `isAdmin` üzerinden yapılıyor. |
| 2.10 | **`/auth/me` zenginleştirme** | Orta | Kullanıcı ilanları, görevleri, rozetleri dönülmüyor. |

## 3. Güvenlik Riskleri

| Risk | Seviye | Detay |
|------|--------|-------|
| Zayıf JWT secret | Kritik | `JWT_SECRET` ortam değişkeni yoksa `'secret'` kullanılıyor. |
| Brute-force saldırısı | Kritik | Login denemesi sınırı yok. |
| XSS/Injection | Orta | Input validasyonu yetersiz. |
| Token çalınması | Orta | Token'ın süresi ve refresh mekanizması güvenli ama revoke yok. |

## 4. Öncelikli Düzeltme Listesi

### Öncelik 1: Kritik Güvenlik
- [ ] JWT_SECRET fallback kaldırılacak, uygulama başlatılmadan önce kontrol edilecek.
- [ ] Brute-force koruması eklenecek (express-rate-limit).

### Öncelik 2: Temel Kullanıcı Deneyimi
- [ ] Şifre görünürlük toggle'ı eklenecek.
- [ ] Telefon format maskesi eklenecek.
- [ ] Form temizleme (modal kapanınca sıfırlama).
- [ ] Şifremi unuttum akışı eklenecek (basit telefon + yeni şifre).

### Öncelik 3: Validasyon ve Doğrulama
- [ ] Frontend ve backend telefon format validasyonu.
- [ ] Backend email format validasyonu.
- [ ] Şifre güçlülük kontrolü (min 6 karakter, büyük/küçük harf, sayı).

### Öncelik 4: Kullanıcı Yönetimi
- [ ] `/users/me` güncelleme endpoint'i.
- [ ] `/auth/me` zenginleştirme (listings, tasks, donations).
- [ ] Telefon doğrulama UI + backend (simülasyon).
