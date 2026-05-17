const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public: sadece onaylanmış (ACTIVE) ihbarları göster
router.get('/', async (req, res) => {
  try {
    const reports = await prisma.disasterReport.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ status: 'ok', data: reports });
  } catch (err) {
    console.error('Reports fetch error:', err);
    res.status(500).json({ message: 'İhbarlar alınırken hata oluştu' });
  }
});

// Public: yeni ihbar oluştur (varsayılan olarak PENDING, admin onayı gerekir)
router.post('/', async (req, res) => {
  try {
    const { type, description, city, district, lat, lng, name, phone } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: 'Tür ve açıklama zorunludur' });
    }

    const report = await prisma.disasterReport.create({
      data: {
        type,
        description,
        city: city || null,
        district: district || null,
        lat: lat != null ? parseFloat(lat) : null,
        lng: lng != null ? parseFloat(lng) : null,
        name: name || null,
        phone: phone || null,
        status: 'PENDING',
      },
    });

    res.status(201).json({ status: 'ok', message: 'İhbar alındı. Admin onayından sonra yayınlanacak.', data: report });
  } catch (err) {
    console.error('Report create error:', err);
    res.status(500).json({ message: 'İhbar kaydedilirken hata oluştu' });
  }
});

// Admin: tüm ihbarları listele (PENDING + ACTIVE + REJECTED)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reports = await prisma.disasterReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ status: 'ok', data: reports });
  } catch (err) {
    console.error('Admin reports fetch error:', err);
    res.status(500).json({ message: 'İhbarlar alınırken hata oluştu' });
  }
});

// Admin: ihbarı onayla (ACTIVE yap)
router.patch('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await prisma.disasterReport.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    res.json({ status: 'ok', message: 'İhbar onaylandı ve yayınlandı.', data: report });
  } catch (err) {
    console.error('Report approve error:', err);
    res.status(500).json({ message: 'İhbar onaylanırken hata oluştu' });
  }
});

// Admin: ihbarı reddet
router.patch('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await prisma.disasterReport.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    res.json({ status: 'ok', message: 'İhbar reddedildi.', data: report });
  } catch (err) {
    console.error('Report reject error:', err);
    res.status(500).json({ message: 'İhbar reddedilirken hata oluştu' });
  }
});

// Admin: ihbarı sil
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.disasterReport.delete({ where: { id } });
    res.json({ status: 'ok', message: 'İhbar silindi' });
  } catch (err) {
    console.error('Report delete error:', err);
    res.status(500).json({ message: 'İhbar silinirken hata oluştu' });
  }
});

module.exports = router;
