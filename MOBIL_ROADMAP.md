# Mobil Uyumluluk Yol Haritası (Mobile Roadmap)

## Mevcut Durum Analizi

| Alan | Durum | Risk |
|------|-------|------|
| Viewport meta tag | ✅ Var | Düşük |
| Mobile bottom navigation | ✅ Var | Düşük |
| Responsive grid (Tailwind) | ✅ Kısmen | Orta |
| PWA / Manifest | ❌ Yok | **Yüksek** |
| Service Worker / Offline | ❌ Yok | **Yüksek** |
| Touch target boyutları | ⚠️ Değişken | Orta |
| iOS input zoom | ⚠️ Muhtemel | Orta |
| JS bundle size (~700KB) | ⚠️ Büyük | **Yüksek** |
| Safe area (notch/curve) | ❌ Yok | Orta |
| Pull-to-refresh | ❌ Yok | Düşük |
| Push notifications | ❌ Yok | Orta |

---

## Aşama 1: Hemen Yapılabilir (Quick Wins) — 1-2 gün

### 1.1. iOS Input Zoom Engellemesi
Safari'de `<input>` ve `<select>` odaklandığında sayfa yakınlaşır.

```html
<!-- index.html içinde viewport'u güncelle -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

> **Not:** `user-scalable=no` erişilebilirliği azaltır. Alternatif: input font-size ≥ 16px kullanmak.

### 1.2. Touch Target Boyutları
Mobilde tıklanabilir alanlar en az **44×44px** olmalı (WCAG 2.1).

```css
/* Tailwind config veya global CSS'e ekle */
@layer base {
  button, a, input, select, textarea, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### 1.3. Safe Area Desteği (Notch / Dinamik Island)
iPhone X+ ve Android curve ekranlar için padding.

```css
/* index.html veya global CSS */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

```html
<meta name="viewport" content="... viewport-fit=cover" />
```

### 1.4. Momentum Scroll
Mobilde doğal kaydırma hissi.

```css
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
```

---

## Aşama 2: Kısa Vadeli (1 hafta)

### 2.1. PWA Dönüşümü
Kullanıcı ana ekrana uygulama ekleyebilsin, tam ekran çalışsın.

**Gerekli dosyalar:**
- `public/manifest.json` — tema rengi, ikonlar, display: standalone
- `public/icons/` — 192×192, 512×512 PNG ikonlar
- `index.html` — `<link rel="manifest" href="/manifest.json" />`
- iOS için `<meta name="apple-mobile-web-app-capable" content="yes" />`

**manifest.json örneği:**
```json
{
  "name": "AVUC Afet Koordinasyon",
  "short_name": "AVUC",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ef4444",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

### 2.2. Code Splitting / Lazy Loading
Build uyarısı: JS chunk >500KB. Leaflet, harita sayfaları ve ağır bileşenler dinamik import edilmeli.

```jsx
// Harita bileşenleri lazy load
const MapPicker = lazy(() => import('@/components/MapPicker'));
const GatheringPointsPage = lazy(() => import('@/pages/GatheringPointsPage'));

// Suspense ile sarmala
<Suspense fallback={<LoadingSkeleton />}>
  <MapPicker />
</Suspense>
```

**vite.config.js:**
```js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet', 'react-leaflet'],
          vendor: ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
  },
}
```

### 2.3. Mobile Bottom Nav İyileştirmesi
Mevcut bottom nav 5 öğeli. İkon ekleme ve aktif durumu belirginleştirme.

```jsx
// mobileNavItems içine icon alanı ekle
// Aktif sekmede sadece nokta değil, Lucide ikonu + label göster
```

### 2.4. Floating Action Button (FAB) Pozisyonu
Acil yardım butonu bottom nav'ın üzerinde kalıyor mu kontrol et.

```css
/* Bottom nav height ~64px olduğundan */
.fab-emergency {
  bottom: calc(1rem + 64px + env(safe-area-inset-bottom));
}
```

---

## Aşama 3: Orta Vadeli (2-4 hafta)

### 3.1. Service Worker + Offline First
Workbox veya Vite PWA plugin kullanarak temel asset'leri cache'le.

```bash
npm install vite-plugin-pwa -D
```

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:3003\/api\/earthquakes/,
            handler: 'NetworkFirst',
            options: { cacheName: 'earthquakes-cache' },
          },
        ],
      },
    }),
  ],
}
```

### 3.2. Push Notifications (Acil Durum Bildirimleri)
Backend'den anlık deprem veya afet ihbarı geldiğinde mobil cihaza bildirim.

```js
// Frontend service worker içinde
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag,
    })
  );
});
```

**Backend:**
```js
// web-push ile FCM entegrasyonu
const webpush = require('web-push');
webpush.sendNotification(subscription, payload);
```

### 3.3. Network Resilience
Mobil bağlantı zayıf olduğunda form verilerini localStorage'a kuyruk at, bağlantı gelince senkronize et.

```js
// services/syncQueue.js
const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');

window.addEventListener('online', () => {
  flushQueue(); // Kuyruktaki POST isteklerini gönder
});
```

### 3.4. Harita Mobil Optimizasyonu
Leaflet mobilde dokunmatik kaydırmayla çatışabilir.

```jsx
<MapContainer
  dragging={!isMobile} // Mobilde tek parmak kaydırma sayfayı kaydırsın
  tap={false}
  touchZoom={true}
  scrollWheelZoom={false}
>
```

### 3.5. Pull-to-Refresh
Mobilde sayfayı aşağı çekince veri yenilensin.

```jsx
// hooks/usePullToRefresh.js
useEffect(() => {
  let startY = 0;
  const onTouchStart = (e) => { startY = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    const y = e.touches[0].clientY;
    if (window.scrollY === 0 && y - startY > 100) {
      onRefresh();
    }
  };
  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  return () => { ... };
}, []);
```

---

## Aşama 4: İleri Seviye (Opsiyonel)

| Özellik | Fayda | Maliyet |
|---------|-------|---------|
| Capacitor / Cordova ile Native APK/IPA | Tam native his | Yüksek |
| Background geolocation | Acil durumda konum takibi | Orta |
| Wake Lock API (ekranı açık tut) | Siren / LED çalışırken | Düşük |
| Vibration API | Sirenle birlikte titreşim | Düşük |
| Camera API (dosya input yerine) | Doğrudan kamera | Düşük |

---

## Özet: Öncelik Sırası

```
1. Gün:  iOS zoom + touch target + safe area
2. Gün:  manifest.json + PWA temelleri
3-5. Gün: Lazy loading + code splitting (performans)
6-7. Gün: Service worker + offline cache
8-14. Gün: Push notifications + sync queue
15-30. Gün: Harita optimizasyon + pull-to-refresh + native wrap
```

Başlangıç olarak **Aşama 1 + 2.1 (PWA manifest)**'i hemen uygulamak ister misin?
