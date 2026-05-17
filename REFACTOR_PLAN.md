# AVUC Refactor ve Eksik Çözüm Planı

> Mevcut dosyalara dokunmadan önce bu planı oku. Her madde bağımsızdır; tek tek veya paralel çözülebilir.

---

## 0. ÇÖZÜM DOSYA YAPISI (Yeni Klasörler)

```
avuc/
├── src/
│   ├── pages/                    # Her sayfa ayrı dosya (App.jsx'ten kurtarma)
│   │   ├── HomePage.jsx
│   │   ├── ShelterPage.jsx
│   │   ├── HostPage.jsx
│   │   ├── MatchingPage.jsx
│   │   ├── DonationsPage.jsx
│   │   ├── MapPage.jsx
│   │   ├── UrgentNeedsPage.jsx
│   │   ├── VolunteerPage.jsx
│   │   ├── CreateListingPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AdminPage.jsx
│   │   └── EmergencyPage.jsx    # (mevcut EmergencyHub'ı saran)
│   │
│   ├── components/ui/           # Mevcut UI komponentleri (zaten var)
│   ├── components/effects/      # YENİ: WOW efekt komponentleri
│   │   ├── SeismographLine.jsx    # Sismograf çizgisi
│   │   ├── RadarScanner.jsx       # Radar tarama
│   │   ├── FakeAudioVisualizer.jsx# Ses dalgası
│   │   ├── MorseLed.jsx           # Morse kodu LED
│   │   ├── TerminalLog.jsx        # Sahte terminal
│   │   ├── AnimatedCounter.jsx    # Sayı sayacı
│   │   ├── LiveStatusBadge.jsx    # Pulse durum rozeti
│   │   ├── FakeRealtimeFeed.jsx   # Sahte gerçek zamanlı bildirimler
│   │   ├── ScreenShake.jsx        # Ekran titremesi
│   │   ├── GlitchText.jsx         # Glitch efekti
│   │   ├── TypewriterHeader.jsx   # Yazı makinesi efekti
│   │   ├── OfflineDetector.jsx    # Çevrimdışı bandı
│   │   ├── MatrixRain.jsx         # Matrix efekti (mini)
│   │   └── EmergencyMode.jsx      # Acil durum modu
│   │
│   ├── components/layout/       # YENİ: Layout parçaları
│   │   ├── Header.jsx
│   │   ├── MobileBottomNav.jsx
│   │   ├── FloatingEmergencyButton.jsx
│   │   ├── LoadingBar.jsx
│   │   ├── Toast.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── hooks/                   # YENİ: Custom hook'lar
│   │   ├── useOnlineStatus.js     # navigator.onLine dinleyici
│   │   ├── useIdleTimeout.js      # Hareketsizlik kapatma
│   │   ├── useGeolocation.js      # Konum alma
│   │   ├── useAnimatedCounter.js  # Sayaç animasyon hook'u
│   │   ├── useFakePolling.js      # Sahte API polling
│   │   └── useTheme.js            # Dark/light/acil modu
│   │
│   ├── utils/                   # YENİ: Yardımcı fonksiyonlar
│   │   ├── classNames.js
│   │   ├── formatters.js          # Tarih, sayı formatlama
│   │   ├── constants.js           # Renkler, status mapping'ler
│   │   └── fakeDataGenerators.js  # Rastgele canlı veri üreten fonksiyonlar
│   │
│   ├── context/
│   ├── services/
│   └── App.jsx                  # Sadece route/wrapper, max 100 satır
│
├── public/
│   └── sounds/                  # YENİ: alarm.mp3, beep.mp3 (küçük dosyalar)
│
└── .env                         # YENİ: API URL
```

---

## 1. KRİTİK HATALAR

### 1.1 API URL Hardcoded (`src/services/api.js`)
**Sorun:** `localhost:3002` deploy'da çalışmaz.

**Çözüm:**
1. Proje köküne `.env` dosyası ekle:
   ```
   VITE_API_BASE_URL=http://localhost:3002/api
   ```
2. `api.js` içinde şu satırı değiştir:
   ```js
   // ESKİ:
   baseURL: 'http://localhost:3002/api',
   refresh: 'http://localhost:3002/api/auth/refresh'

   // YENİ:
   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api',
   refresh: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api'}/auth/refresh`
   ```

---

### 1.2 App.jsx 1900 Satır — Bölünme Zorunlu
**Sorun:** Tek dosyada 15 sayfa + utility + UI komponentleri.

**Çözüm:**
- `src/pages/` klasörü oluştur.
- Her sayfa fonksiyonu (örn. `function HomePage(...)`) kendi `src/pages/HomePage.jsx` dosyasına taşınır.
- `src/utils/classNames.js` ve `src/utils/constants.js` oluştur; `getStatusClass`, `getUrgencyClass`, `cityFromLocation`, `classNames` oraya taşınır.
- `src/components/layout/` altına `Header.jsx`, `MobileBottomNav.jsx`, `FloatingEmergencyButton.jsx`, `LoadingBar.jsx`, `Toast.jsx`, `EmptyState.jsx`, `EmergencyModal.jsx` taşınır.
- Sonuç: `App.jsx` sadece state management ve route switching yapar (~80-120 satır).

**Not:** Eğer Vite `React.lazy` + `Suspense` kullanırsan code-splitting de olur:
```jsx
const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
```

---

## 2. EKSİK ÖZELLİKLER (Sırayla Dosyalar)

### 2.1 Loading State'ler — Skeleton Loader
**Şu an:** Her yerde `<div>Yükleniyor...</div>`.

**Çözüm Dosyası:** `src/components/effects/SkeletonCard.jsx`
```jsx
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-avuc-line bg-white p-5">
      <div className="h-5 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 grid gap-2">
        <div className="h-10 rounded-xl bg-slate-200" />
        <div className="h-10 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
```
Kullanım: `loading ? <div className="grid ...">{Array(4).fill(0).map((_,i)=><SkeletonCard key={i}/>)}</div> : <gerçek veri />`

---

### 2.2 "Canlı" Hissiyat — Sahte Realtime Feed
**Şu an:** "Canlı akış" rozeti var ama hiçbir şey canlı değil.

**Çözüm Dosyası:** `src/components/effects/FakeRealtimeFeed.jsx`
```jsx
import { useEffect, useState } from 'react';

const MESSAGES = [
  'Hatay / Antakya: Yeni acil ihtiyaç bildirildi',
  'Gaziantep: Minibüs eşleşmesi tamamlandı',
  'Kahramanmaraş: 3 gönüllü göreve katıldı',
  'Admin: Yeni barınma ilanı onaylandı',
  'Sistem: Depo kapasitesi %87 doldu',
];

export function FakeRealtimeFeed({ onToast }) {
  useEffect(() => {
    const id = setInterval(() => {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      onToast(msg); // veya özel bir sidebar feed'e ekle
    }, 12000);
    return () => clearInterval(id);
  }, [onToast]);
  return null;
}
```
Kullanım: `App.jsx`'in en üst seviyesine `<FakeRealtimeFeed onToast={showToast} />` ekle.

---

### 2.3 Ekran Titreşimi (Deprem Simülasyonu)
**Şu an:** Yok.

**Çözüm Dosyası:** `src/components/effects/ScreenShake.jsx`
```jsx
import { useEffect, useState } from 'react';

export function ScreenShake({ trigger }) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 600);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!shaking) return null;
  return (
    <style>{`
      @keyframes shake {
        0%,100%{transform:translate(0,0)}
        10%{transform:translate(-5px,-5px)}
        20%{transform:translate(5px,5px)}
        30%{transform:translate(-5px,5px)}
        40%{transform:translate(5px,-5px)}
        50%{transform:translate(-3px,3px)}
        60%{transform:translate(3px,-3px)}
      }
      body { animation: shake 0.6s ease-in-out; }
    `}</style>
  );
}
```
Kullanım: Acil yardım bildir butonuna basılınca veya belirli bir sahte olayda `trigger={true}` verilir.

---

### 2.4 Sismograf Çizgisi (Canlı Dalga)
**Şu an:** Yok.

**Çözüm Dosyası:** `src/components/effects/SeismographLine.jsx`
```jsx
export function SeismographLine() {
  return (
    <div className="relative h-12 w-full overflow-hidden rounded-xl bg-slate-900">
      <svg className="absolute inset-0 h-full w-full">
        <polyline
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
          points="0,24 20,20 40,28 60,18 80,26 100,22 120,30 ..."
          style={{ animation: 'seismograph 2s linear infinite' }}
        />
      </svg>
      <div className="absolute left-2 top-1 text-[10px] font-mono text-green-400">SISMOGRAF: AKTIF</div>
    </div>
  );
}
```
Daha iyi versiyon: CSS `clip-path` veya basit bir Canvas ile `requestAnimationFrame` içinde rastgele sinüs dalgası çizilir.

---

### 2.5 Terminal Log Paneli
**Şu an:** Yok.

**Çözüm Dosyası:** `src/components/effects/TerminalLog.jsx`
```jsx
import { useEffect, useState } from 'react';

const LOGS = [
  '[14:32:01] Sunucuya bağlanıyor...',
  '[14:32:02] WebSocket kanalı açıldı',
  '[14:32:04] 3 yeni ihbar alındı (Hatay)',
  '[14:32:08] Konum verisi senkronize edildi',
  '[14:32:15] AI hasar analizi tamamlandı',
];

export function TerminalLog() {
  const [lines, setLines] = useState(LOGS.slice(0, 3));

  useEffect(() => {
    let i = 3;
    const id = setInterval(() => {
      if (i >= LOGS.length) i = 0;
      setLines((prev) => [...prev.slice(1), LOGS[i]]);
      i++;
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-green-400">
      {lines.map((l, i) => (
        <div key={i} className="opacity-80">{l}</div>
      ))}
      <span className="inline-block h-3 w-1.5 animate-pulse bg-green-400" />
    </div>
  );
}
```

---

### 2.6 Offline Detector
**Şu an:** Yok.

**Çözüm Dosyası:** `src/hooks/useOnlineStatus.js`
```js
import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}
```
Kullanım: Header'a veya alt kısma küçük bir bant: `!online && <div className="fixed top-0 ... bg-amber-500 text-white">Çevrimdışı mod: Veriler yerel olarak saklanıyor</div>`

---

### 2.7 Acil Durum Modu (Kırmızı Tema)
**Şu an:** Dark/Light var (`next-themes`) ama acil modu yok.

**Çözüm:** `src/hooks/useTheme.js` veya doğrudan state:
```jsx
const [emergencyMode, setEmergencyMode] = useState(false);
```
`App.jsx`'in en dış wrapper'ına class ekle:
```jsx
<div className={emergencyMode ? 'emergency-mode' : ''}>
```
`index.css`'e ekle:
```css
.emergency-mode {
  filter: grayscale(0.3) contrast(1.1);
}
.emergency-mode .bg-white {
  background: #fef2f2 !important;
  border-color: #fecaca !important;
}
```

---

### 2.8 Sayı Sayaç Animasyonu
**Şu an:** Statik rakamlar (`248`, `71`, `96%`).

**Çözüm Dosyası:** `src/components/effects/AnimatedCounter.jsx`
```jsx
import { useEffect, useState } from 'react';

export function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(id); }
      setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
}
```
Kullanım: `<AnimatedCounter target={248} />`

---

### 2.9 Glitch Efekti
**Şu an:** Yok.

**Çözüm Dosyası:** `src/components/effects/GlitchText.jsx`
```jsx
export function GlitchText({ children }) {
  return (
    <span className="relative inline-block">
      <span className="glitch-original">{children}</span>
      <span className="glitch-red" aria-hidden="true">{children}</span>
      <span className="glitch-blue" aria-hidden="true">{children}</span>
      <style>{`
        .glitch-original { position:relative; z-index:2; }
        .glitch-red, .glitch-blue { position:absolute; top:0; left:0; width:100%; opacity:0.8; }
        .glitch-red { color:red; z-index:1; animation: glitch-anim 2s infinite; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
        .glitch-blue { color:cyan; z-index:1; animation: glitch-anim 2s infinite reverse; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }
        @keyframes glitch-anim { 0%{transform:translate(0)} 20%{transform:translate(-2px,2px)} 40%{transform:translate(-2px,-2px)} 60%{transform:translate(2px,2px)} 80%{transform:translate(2px,-2px)} 100%{transform:translate(0)} }
      `}</style>
    </span>
  );
}
```

---

### 2.10 Sesli Uyarı (Acil Buton)
**Şu an:** Yok.

**Çözüm:** `public/sounds/alarm.mp3` (1-2 saniyelik kısa dosya) koy.
Kullanım:
```jsx
const playAlarm = () => {
  const audio = new Audio('/sounds/alarm.mp3');
  audio.volume = 0.3;
  audio.play().catch(() => {}); // kullanıcı etkileşimi gerekebilir
};
```
Acil butonuna `onClick`'te çağır.

---

## 3. GÜVENLİK ve DOĞRULAMA

### 3.1 Form Validasyonu
**Şu an:** Sadece HTML5 `required`.

**Çözüm:** `src/utils/validators.js` oluştur.
```js
export const validators = {
  phone: (v) => /^05[0-9]{9}$/.test(v.replace(/\s/g,'')),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  minLength: (n) => (v) => v.length >= n,
};
```
`HostPage` ve `CreateListingPage`'de submit öncesi çalıştır:
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validators.phone(formData.phone)) { onToast('Geçersiz telefon'); return; }
  // ... API call
};
```

### 3.2 Auth Loading State
**Şu an:** `AuthContext` `loading` var ama kullanılmıyor.

**Çözüm:** `App.jsx`'in ilk satırlarında:
```jsx
const { loading: authLoading } = useAuth();
if (authLoading) return <div className="flex h-screen items-center justify-center"><SkeletonCard /></div>;
```

---

## 4. PERFORMANS

### 4.1 Pagination / Virtualization
**Şu an:** `.map()` ile tüm veriler render ediliyor.

**Çözüm:** Sayfalama için `src/hooks/usePagination.js`:
```js
export function usePagination(items, perPage = 12) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const current = items.slice((page - 1) * perPage, page * perPage);
  return { current, page, setPage, totalPages };
}
```

### 4.2 React.lazy + Suspense
**Şu an:** Tüm sayfalar upfront yükleniyor.

**Çözüm:** `App.jsx`'te:
```jsx
const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
// ... diğer sayfalar

// render içinde:
<React.Suspense fallback={<SkeletonCard />}>
  {page}
</React.Suspense>
```

---

## 5. ÖZEL ETKİNLİKLER (Senin En Sevdiğin Kısım)

### 5.1 Confetti Başarı Animasyonu
```bash
npm install canvas-confetti
```
`src/components/effects/ConfettiButton.jsx`:
```jsx
import confetti from 'canvas-confetti';
export function triggerConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}
```
Bağış tamamlanınca veya eşleşme olunca çağır.

### 5.2 Radar Scanner
`src/components/effects/RadarScanner.jsx`:
```jsx
export function RadarScanner() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-200 bg-slate-50">
      <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.4) 60deg, transparent 90deg)', animation: 'spin 2s linear infinite' }} />
      <div className="h-2 w-2 rounded-full bg-green-500" />
    </div>
  );
}
```

### 5.3 Sahte Drone Tracker
`src/components/effects/DroneTracker.jsx`:
```jsx
export function DroneTracker() {
  const [pos, setPos] = useState({ x: 36.20, y: 36.16, alt: 120, bat: 87 });
  useEffect(() => {
    const id = setInterval(() => {
      setPos(p => ({ ...p, x: p.x + (Math.random()-0.5)*0.001, y: p.y + (Math.random()-0.5)*0.001, bat: Math.max(0, p.bat - 0.1) }));
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-green-400">
      <div>İHA-07 | BAT: %{pos.bat.toFixed(0)}</div>
      <div>ENLEM: {pos.x.toFixed(5)} BOYLAM: {pos.y.toFixed(5)}</div>
      <div>İRTİFA: {pos.alt}m HIZ: 45 km/s</div>
    </div>
  );
}
```

---

## 6. SIRALI İŞ AKIŞI (Nereden Başlanır?)

### Faz 1: Yapısal Temel (En Önemli)
1. `.env` + `api.js` düzelt
2. `src/pages/` klasörü + sayfaları ayır
3. `src/utils/` + `src/hooks/` klasörleri
4. `App.jsx`'i 120 satıra indir

### Faz 2: Etki (Kullanıcı Deneyimi)
5. `AnimatedCounter` — Hero sayıları canlansın
6. `FakeRealtimeFeed` — Toast'lar periyodik gelsin
7. `SkeletonCard` — Loading ekranları şıklaşsın
8. `OfflineDetector` — Çevrimdışı bandı ekle

### Faz 3: WOW (Gösteriş)
9. `SeismographLine` — Sayfanın tepesine veya haritaya
10. `TerminalLog` — Admin paneli altına veya footer'a
11. `RadarScanner` — Harita sayfasına
12. `ScreenShake` — Acil butonuna bağla
13. `GlitchText` — Başlıklara ara sıra

### Faz 4: Güvenlik ve Detay
14. Form validasyonu
15. `AuthContext` loading kullanımı
16. Search/Pagination hook'ları

---

## 7. NOTLAR

- **Mevcut dosyalara dokunmadan** yeni dosyalar yazma prensibi korunur. Sadece `App.jsx`'in import path'leri değişir.
- Her yeni efekt komponenti **kendi dosyasındadır**; App'e sadece import edilir.
- `framer-motion` zaten `package.json`'da. Sayfa geçişlerine `<AnimatePresence>` ile enter/exit animasyonu eklenebilir.
- Tailwind zaten kurulu. Glassmorphism için: `backdrop-blur-md bg-white/10 border border-white/20`.

---

*Bu plan hazır. Hangi fazdan başlamak istersin?*
