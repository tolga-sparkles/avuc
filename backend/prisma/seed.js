const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const cities = ['Gaziantep', 'Hatay', 'Kahramanmaraş', 'Adıyaman', 'Malatya', 'Şanlıurfa'];

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      phone: '05000000000',
      passwordHash: adminPassword,
      identityVerified: true,
      phoneVerified: true,
      role: 'ADMIN',
      score: 0,
    },
  });

  // Sample users
  const userPassword = await bcrypt.hash('user123', 10);
  const users = [];
  for (let i = 1; i <= 6; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        phone: `0500000000${i}`,
        passwordHash: userPassword,
        identityVerified: i % 2 === 0,
        phoneVerified: true,
        role: 'USER',
        score: 10 * i,
      },
    });
    users.push(user);
  }

  // Shelter listings
  const shelterData = [
    {
      city: 'Gaziantep',
      district: 'Şahinbey',
      capacity: 3,
      duration: '7 gün',
      amenities: JSON.stringify(['Isınma', 'Banyo', 'Mutfak']),
      title: 'Gaziantep / Şahinbey 3 kişilik oda',
      description: 'Gaziantep / Şahinbey’de 3 kişilik aile için uygun bir oda. Çocuklu aile kabul edilir.',
      verified: true,
      status: 'APPROVED',
    },
    {
      city: 'Hatay',
      district: 'Dörtyol',
      capacity: 5,
      duration: '10 gün',
      amenities: JSON.stringify(['Isınma', 'Banyo', 'Mutfak', 'Ulaşım']),
      title: 'Hatay / Dörtyol zemin kat ev',
      description: 'Zemin kat, engelli birey için uygun. Evcil hayvan kabul edilir.',
      verified: true,
      status: 'APPROVED',
    },
    {
      city: 'Malatya',
      district: 'Battalgazi',
      capacity: 2,
      duration: '5 gün',
      amenities: JSON.stringify(['Isınma', 'Banyo']),
      title: 'Malatya / Battalgazi misafir odası',
      description: 'Kadın afetzedeler için güvenli misafir odası. Admin onayı bekliyor.',
      verified: false,
      status: 'PENDING',
    },
    {
      city: 'Şanlıurfa',
      district: 'Eyyübiye',
      capacity: 4,
      duration: '14 gün',
      amenities: JSON.stringify(['Isınma', 'Banyo', 'Mutfak', 'Ulaşım']),
      title: 'Şanlıurfa / Eyyübiye apart daire',
      description: 'Toplu taşıma yakını, mutfak ortak kullanılabilir.',
      verified: true,
      status: 'APPROVED',
    },
  ];

  for (let i = 0; i < shelterData.length; i++) {
    await prisma.listing.create({
      data: {
        type: 'shelter',
        category: 'Kalacak yer sunuyorum',
        city: shelterData[i].city,
        district: shelterData[i].district,
        location: `${shelterData[i].city} / ${shelterData[i].district}`,
        title: shelterData[i].title,
        description: shelterData[i].description,
        capacity: shelterData[i].capacity,
        duration: shelterData[i].duration,
        amenities: shelterData[i].amenities,
        status: shelterData[i].status,
        verified: shelterData[i].verified,
        userId: users[i % users.length].id,
      },
    });
  }

  // Aid listings
  const aidData = [
    {
      type: 'vehicle',
      category: 'Aracım var',
      city: 'Gaziantep',
      district: 'Şehitkamil',
      title: 'Minibüs ve sürücü desteği',
      description: 'Minibüs ile yardım taşıyabilirim. Bugün 18.00 saatine kadar uygun.',
      status: 'APPROVED',
    },
    {
      type: 'food',
      category: 'Erzağım var',
      city: 'Gaziantep',
      district: 'Merkez',
      title: '50 koli kuru gıda',
      description: '50 koli kuru gıda var. Hatay yönüne araç desteği arıyorum.',
      status: 'APPROVED',
    },
    {
      type: 'depot',
      category: 'Depom var',
      city: 'Adıyaman',
      district: 'Merkez',
      title: '200 m2 kapalı depo',
      description: '200 m2 kapalı depo. Paketleme gönüllüleri bekleniyor.',
      status: 'APPROVED',
    },
    {
      type: 'volunteer',
      category: 'Gönüllüyüm',
      city: 'Hatay',
      district: 'Antakya',
      title: '4 kişilik dağıtım ekibi',
      description: '4 kişilik dağıtım ekibi. Araç ve rota bilgisi bekleniyor.',
      status: 'APPROVED',
    },
    {
      type: 'urgent',
      category: 'İhtiyaç bildiriyorum',
      city: 'Malatya',
      district: 'Battalgazi',
      title: 'Bebek maması, bez, battaniye ihtiyacı',
      description: 'Teslim alacak koordinatör mevcut. 15 aile için acil destek.',
      status: 'PENDING',
    },
    {
      type: 'vehicle',
      category: 'Aracım var',
      city: 'Kahramanmaraş',
      district: 'Onikişubat',
      title: 'Araç ve yakıt desteği',
      description: '2 gönüllü ve paketleme desteği arıyorum. Bu akşam uygun.',
      status: 'COMPLETED',
    },
  ];

  for (let i = 0; i < aidData.length; i++) {
    await prisma.listing.create({
      data: {
        type: aidData[i].type,
        category: aidData[i].category,
        city: aidData[i].city,
        district: aidData[i].district,
        location: `${aidData[i].city} / ${aidData[i].district}`,
        title: aidData[i].title,
        description: aidData[i].description,
        status: aidData[i].status,
        verified: true,
        userId: users[i % users.length].id,
      },
    });
  }

  // Donations
  const donationData = [
    { packageName: 'Gıda Kolisi', items: 'Kuru bakliyat, konserve, çay, makarna', amount: '650 TL', donorName: 'Anonim', status: 'LOADED' },
    { packageName: 'Hijyen Paketi', items: 'Sabun, şampuan, dezenfektan, ıslak mendil', amount: '420 TL', donorName: 'M. Yılmaz', status: 'PREPARING' },
    { packageName: 'Kış Paketi', items: 'Mont, çorap, bere, termal içlik', amount: '1250 TL', donorName: 'A. Öz', status: 'DELIVERED' },
    { packageName: 'Bebek Destek Paketi', items: 'Mama, bebek bezi, ıslak mendil, pişik kremi', amount: '780 TL', donorName: 'Elif K.', status: 'RECEIVED' },
    { packageName: 'Kadın Hijyen Paketi', items: 'Ped, iç çamaşırı, hijyen mendili, sabun', amount: '360 TL', donorName: null, status: 'ARRIVED' },
    { packageName: 'Su Desteği', items: '120 adet 0.5L su, taşıma kolisi', amount: '300 TL', donorName: 'Koruma Der.', status: 'LOADED' },
    { packageName: 'Battaniye Paketi', items: '2 battaniye, polar örtü, uyku matı', amount: '540 TL', donorName: 'S. Demir', status: 'PREPARING' },
    { packageName: 'Evcil Hayvan Mama Paketi', items: 'Kedi maması, köpek maması, su kabı', amount: '480 TL', donorName: 'Haysever', status: 'RECEIVED' },
  ];

  for (const d of donationData) {
    await prisma.donation.create({ data: d });
  }

  // Volunteer tasks
  const taskData = [
    { title: 'Erzak paketleme', location: 'Gaziantep / Şehitkamil', time: 'Bugün 16.00 - 20.00', people: 12, description: 'Gıda kolileri aile sayısına göre ayrıştırılacak.' },
    { title: 'Yardım dağıtımı', location: 'Hatay / Antakya', time: 'Yarın 09.00', people: 8, description: 'Koordinatör eşliğinde mahalle bazlı dağıtım yapılacak.' },
    { title: 'Araçla taşıma', location: 'Adıyaman / Merkez', time: 'Bugün 18.00', people: 4, description: 'Minibüs ve kamyonet sahipleri için kısa mesafe taşıma.' },
    { title: 'Depo düzenleme', location: 'Şanlıurfa / Haliliye', time: 'Her gün 10.00', people: 10, description: 'Koliler içerik ve son kullanma tarihine göre etiketlenecek.' },
    { title: 'Barınma koordinasyonu', location: 'Kahramanmaraş / Merkez', time: 'Bugün 14.00', people: 6, description: 'Kalacak yer ilanları telefon doğrulamasıyla kontrol edilecek.' },
    { title: 'Yaşlı ve engelli bireylere destek', location: 'Malatya / Battalgazi', time: 'Yarın 11.00', people: 5, description: 'İlaç, ulaşım ve refakat ihtiyacı olan kişiler ziyaret edilecek.' },
  ];

  for (const t of taskData) {
    await prisma.volunteerTask.create({ data: t });
  }

  // Notifications
  const notifications = [
    { type: 'welcome', message: 'AVUC platformuna hoş geldiniz.', userId: admin.id },
    { type: 'listing', message: 'Yeni barınma ilanı onaylandı.', userId: users[0].id },
    { type: 'match', message: 'Yardım eşleştirmesi tamamlandı.', userId: users[1].id },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
