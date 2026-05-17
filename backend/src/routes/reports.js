const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
      },
    });

    res.status(201).json({ status: 'ok', data: report });
  } catch (err) {
    console.error('Report create error:', err);
    res.status(500).json({ message: 'İhbar kaydedilirken hata oluştu' });
  }
});

module.exports = router;
