import { useState } from 'react'
import {
  Check,
  Backpack,
  Shield,
  Flame,
  Waves,
  Activity,
  Wind,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Droplets,
  Thermometer,
  HeartPulse,
  Radio,
  Phone,
  MapPin,
  Utensils,
  Baby,
  Pill,
  Battery,
  Flashlight,
  Shirt,
  CreditCard,
  FileText,
  Key,
  Smartphone,
  Headphones,
  Wrench,
  Tent,
  Cookie,
  X,
  Sparkles,
  Eye,
  BookOpen,
} from 'lucide-react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

const BAG_ITEMS = [
  {
    category: 'Temel Yaşam',
    icon: Utensils,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      { label: 'Su (kişi başı 3 litre)', critical: true },
      { label: 'Konserve ve kuru gıda', critical: true },
      { label: 'Enerji barı / kuruyemiş', critical: false },
      { label: 'Teneke açacağı / bıçak', critical: true },
      { label: 'Termos ve kupa', critical: false },
    ],
  },
  {
    category: 'Sağlık ve İlk Yardım',
    icon: HeartPulse,
    color: 'text-red-600',
    bg: 'bg-red-50',
    items: [
      { label: 'İlk yardım çantası', critical: true },
      { label: 'Reçeteli ilaçlar (7 günlük)', critical: true },
      { label: 'Ateş düşürücü / ağrı kesici', critical: true },
      { label: 'Yara bandı / gazlı bez', critical: true },
      { label: 'Dezenfektan / antiseptik', critical: true },
      { label: 'Maske ve eldiven', critical: false },
    ],
  },
  {
    category: 'Işık ve İletişim',
    icon: Flashlight,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    items: [
      { label: 'El feneri ve yedek pil', critical: true },
      { label: 'Radyo (pilli veya kranklı)', critical: true },
      { label: 'Powerbank ve şarj kablosu', critical: true },
      { label: 'Düdük (acil sinyal)', critical: true },
      { label: 'Kibrit / çakmak (su geçirmez)', critical: true },
      { label: 'Mum', critical: false },
    ],
  },
  {
    category: 'Giyim ve Isınma',
    icon: Shirt,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    items: [
      { label: 'Yedek iç çamaşırı ve çorap', critical: true },
      { label: 'Yağmurluk / mont', critical: true },
      { label: 'Termal içlik', critical: true },
      { label: 'Bere ve eldiven', critical: true },
      { label: 'Uyku tulumu / battaniye', critical: true },
      { label: 'Suya dayanıklı ayakkabı', critical: true },
    ],
  },
  {
    category: 'Hijyen',
    icon: Droplets,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    items: [
      { label: 'Islak mendil / ıslak havlu', critical: true },
      { label: 'Sabun / şampuan (seyahat boy)', critical: true },
      { label: 'Diş fırçası ve macun', critical: true },
      { label: 'Tuvalet kağıdı', critical: true },
      { label: 'Ped / hijyenik ürünler', critical: true },
      { label: 'Çöp poşeti', critical: false },
    ],
  },
  {
    category: 'Evrak ve Para',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    items: [
      { label: 'Kimlik / pasaport fotokopisi', critical: true },
      { label: 'Tapu / sigorta evrakları', critical: true },
      { label: 'Nakit para (bozuk para dahil)', critical: true },
      { label: 'Kredi kartı fotokopisi', critical: false },
      { label: 'Aile fotoğrafları', critical: false },
    ],
  },
  {
    category: 'Bebek ve Çocuk',
    icon: Baby,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    items: [
      { label: 'Mama ve biberon', critical: true },
      { label: 'Bebek bezi', critical: true },
      { label: 'Islak mendil (bebek)', critical: true },
      { label: 'Bebek battaniyesi', critical: true },
      { label: 'Oyuncak / avurt susturucu', critical: false },
    ],
  },
]

const GUIDES = [
  {
    id: 'earthquake',
    title: 'Deprem Anında Korunma',
    icon: Activity,
    color: 'bg-red-50 text-red-600 border-red-200',
    steps: [
      'Sakin olun, panik yapmayın. Panik en büyük düşmandır.',
      'İçerideyseniz: Çömel, kafanı koru, tutunacak yer bul (masa, sandalye altı).',
      'Cam, balkon, vitrin, dolap gibi devrilebilecek eşyalardan uzak durun.',
      'Asansöre binmeyin. Merdivenleri kullanın.',
      'Dışarıdaysanız: Binalardan, ağaçlardan, elektrik direklerinden uzaklaşın.',
      'Açık alandaysanız: Yere çömelin, başınızı kollarınızla koruyun.',
      'Deprem bittikten sonra: Gaz, su ve elektrik vanalarını kapatın.',
      'Radyo ve resmi kanalları takip edin, söylentilere kulak asmayın.',
    ],
  },
  {
    id: 'fire',
    title: 'Yangında Korunma',
    icon: Flame,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    steps: [
      'Yangın alarmını çalın ve diğerlerini uyarım.',
      'Asansör kullanmayın, merdivenleri tercih edin.',
      'Kapıları açmadan önce sıcaklık kontrolü yapın (arka tarafı elinizle kontrol edin).',
      'Duman varsa: Eğilerek hareket edin, ağzınızı ve burnunuzu ıslak bezle kapatın.',
      'Geri dönüş yolunuz kapandıysa: Kapı ve pencereleri ıslak bezle kapatın, yardım bekleyin.',
      'Bina dışına çıktıysanız: Güvenli mesafede toplanma alanına gidin.',
      'Kıyafetiniz yanıyorsa: Yere yatın, ellerinizle yüzünüzü koruyun, yuvarlanın.',
      'Küçük yangınlarda: Yangın söndürücü veya battaniye kullanın, suyu kontrollü kullanın.',
    ],
  },
  {
    id: 'flood',
    title: 'Sel / Su Baskınında Korunma',
    icon: Waves,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    steps: [
      'Hemen yüksek zemine çıkın. Bodrum ve zemin katlardan uzaklaşın.',
      'Elektrik ve gaz vanalarını kapatın.',
      'Asla su birikintisinde yürümeyin — akıntıya kapılabilir veya çukura düşebilirsiniz.',
      'Aracınızda yakalanırsanız: Emniyet kemerini çözün, camı kırın, çıkın.',
      'Radyo ve resmi uyarıları takip edin. Tahliye emri varsa hemen uyun.',
      'Bozulmuş yiyecek ve su kullanmayın. Şişe suyu tercih edin.',
      'Elektrik direklerine ve kopan kablolara yaklaşmayın.',
      'Tahliye sonrası evi temizlerken eldiven ve maske kullanın.',
    ],
  },
  {
    id: 'storm',
    title: 'Fırtına / Hortumda Korunma',
    icon: Wind,
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    steps: [
      'İçerideyseniz: Pencere ve kapıları kapatın, camlardan uzak durun.',
      'Dışarıdaysanız: Sığınacak sağlam bir yapı bulun. Açık alanda kalmayın.',
      'Arabadaysanız: Emniyet kemerini bağlayın, camdan uzak durun, durun.',
      'Ağaçların, direklerin ve reklam panolarının altında durmayın.',
      'Suya kapılmamak için alçak zeminden uzak durun.',
      'Hortum uyarısı varsa: Bodrum veya en iç odada yere yatın, battaniye ile örtün.',
      'Güç hatlarına dokunmayın, kopan kabloları görürseniz uzak durun.',
      'Radyo ve resmi uyarıları sürekli takip edin.',
    ],
  },
  {
    id: 'landslide',
    title: 'Heyelanda Korunma',
    icon: AlertTriangle,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    steps: [
      'Toprak hareketini fark ederseniz hemen bölgeden uzaklaşın.',
      'Heyelan eğiminin dışına doğru kaçın, asla aşağı doğru koşmayın.',
      'Aracınızdaysanız: Hemen terk edin ve sağlam zemine geçin.',
      'Sel sularıyla birlikte geliyorsa yüksek bir yere çıkın.',
      'Toprak kayması sesini duyarsanız uyanık olun ve hazır olun.',
      'Evdeyseniz: Katlara çıkmayın, dışarı çıkın ve uzağa kaçın.',
      'Geri dönüş yolunuz kapandıysa: Güvenli bir yerde bekleyin, 112\'yi arayın.',
      'Heyelan sonrası: Zemini kontrol edin, çatlakları rapor edin.',
    ],
  },
]

function DisasterBag() {
  const [checked, setChecked] = useState({})
  const [openCategory, setOpenCategory] = useState(null)

  const toggleItem = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = BAG_ITEMS.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const progress = Math.round((checkedCount / totalItems) * 100)

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
          <Backpack className="h-7 w-7 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-avuc-text">Deprem Çantası Kontrol Listesi</h3>
          <p className="text-sm text-avuc-muted">Hazırlık tamamlandığında çantanız afete hazır</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-avuc-text">{progress}%</p>
        </div>
      </div>

      <div className="mb-5 h-3 rounded-full bg-slate-100">
        <div
          className={classNames('h-full rounded-full transition-all', progress === 100 ? 'bg-green-500' : 'bg-avuc-blue')}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {BAG_ITEMS.map((cat) => {
          const Icon = cat.icon
          const isOpen = openCategory === cat.category
          const catTotal = cat.items.length
          const catChecked = cat.items.filter((item, i) => checked[`${cat.category}-${i}`]).length
          return (
            <div key={cat.category} className="rounded-2xl border border-avuc-line overflow-hidden">
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.category)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className={classNames('flex h-10 w-10 items-center justify-center rounded-xl', cat.bg)}>
                    <Icon className={classNames('h-5 w-5', cat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-avuc-text">{cat.category}</p>
                    <p className="text-xs text-avuc-muted">{catChecked} / {catTotal} tamamlandı</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-avuc-muted" /> : <ChevronDown className="h-5 w-5 text-avuc-muted" />}
              </button>
              {isOpen && (
                <div className="grid gap-2 border-t border-avuc-line p-3">
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`
                    const isChecked = checked[key]
                    return (
                      <label
                        key={key}
                        className={classNames(
                          'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition',
                          isChecked ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={classNames('flex h-6 w-6 items-center justify-center rounded-md border', isChecked ? 'border-green-500 bg-green-500' : 'border-slate-300 bg-white')}>
                            {isChecked && <Check className="h-4 w-4 text-white" />}
                          </div>
                          <span className={classNames('text-sm font-bold', isChecked ? 'text-green-700 line-through' : 'text-avuc-text')}>{item.label}</span>
                        </div>
                        {item.critical && <Badge className="border-red-200 bg-red-50 text-red-600 text-[10px]">Zorunlu</Badge>}
                        <input type="checkbox" className="hidden" checked={!!isChecked} onChange={() => toggleItem(key)} />
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {progress === 100 && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-bold">Tebrikler! Deprem çantanız tamamen hazır.</p>
        </div>
      )}
    </div>
  )
}

function SurvivalGuide() {
  const [openGuide, setOpenGuide] = useState('earthquake')

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <Shield className="h-7 w-7 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-avuc-text">Afette Korunma Rehberi</h3>
          <p className="text-sm text-avuc-muted">Deprem, yangın, sel ve daha fazlası</p>
        </div>
      </div>

      <div className="space-y-3">
        {GUIDES.map((guide) => {
          const Icon = guide.icon
          const isOpen = openGuide === guide.id
          return (
            <div key={guide.id} className={classNames('rounded-2xl border overflow-hidden', guide.color)}>
              <button
                onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                className={classNames('flex w-full items-center justify-between p-4 text-left transition', isOpen ? 'opacity-100' : 'opacity-80 hover:opacity-100')}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <p className="text-sm font-black">{guide.title}</p>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {isOpen && (
                <div className="border-t border-current border-opacity-20 p-4">
                  <ol className="space-y-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-6 text-avuc-text">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DisasterPrep() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="border-green-200 bg-green-50 text-green-600">Afet Öncesi Hazırlık</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-avuc-text sm:text-4xl">
          Deprem Çantası ve Korunma Rehberi
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-avuc-muted">
          Afet gelmeden önce hazırlıklı olun. Çanta kontrol listesi, korunma adımları ve hayatta kalma rehberi.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DisasterBag />
        <SurvivalGuide />
      </div>
    </main>
  )
}
