export function getStatusClass(status) {
  if (status === 'Acil') return 'bg-avuc-lightRed text-avuc-red border-avuc-red/20'
  if (status === 'Yardım yolda') return 'bg-avuc-lightOrange text-amber-700 border-amber-200'
  if (status === 'Tamamlandı') return 'bg-avuc-lightGreen text-avuc-success border-avuc-success/20'
  if (status === 'Eşleşti') return 'bg-avuc-lightBlue text-avuc-darkBlue border-avuc-blue/20'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export function getUrgencyClass(level) {
  if (level === 'Acil') return 'bg-avuc-lightRed text-avuc-red'
  if (level === 'Yüksek') return 'bg-avuc-lightOrange text-amber-700'
  return 'bg-avuc-lightGreen text-avuc-success'
}

export function cityFromLocation(location) {
  return location.split('/')[0].split('-')[0].trim()
}

export const aidTypes = [
  'Aracım var, yardım taşıyabilirim',
  'Erzağım var, araç arıyorum',
  'Depom var, yardımlar burada toplanabilir',
  'Gönüllüyüm, dağıtıma katılabilirim',
  'Yardım götürmek istiyorum ama ekip arıyorum',
  'Yardım bölgesinde ihtiyaç bildiriyorum',
]

export const createCategories = [
  'Kalacak yer sunuyorum',
  'Kalacak yer arıyorum',
  'Aracım var',
  'Erzağım var',
  'Depom var',
  'Gönüllüyüm',
  'Acil ihtiyaç bildiriyorum',
]

export const pageTitles = {
  home: 'Ana Sayfa',
  shelter: 'Barınma İlanları',
  host: 'Evimi Açmak İstiyorum',
  match: 'Yardım Eşleştirme',
  donations: 'Bağış Yap',
  map: 'Afet Haritası',
  urgent: 'Acil İhtiyaç Panosu',
  volunteer: 'Gönüllü Görevleri',
  create: 'İlan Oluştur',
  profile: 'Profil',
  admin: 'Admin Paneli',
  emergency: 'Acil Durum Merkezi',
  weather: 'Hava Durumu',
  prep: 'Afet Hazırlığı',
  radio: 'Acil Durum Radyosu',
  gathering: 'Acil Toplanma Alanları',
  reports: 'Anlık Afet İhbarları',
}
