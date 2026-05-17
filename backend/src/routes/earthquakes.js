const express = require('express');
const router = express.Router();

const KANDILLI_URL = 'http://www.koeri.boun.edu.tr/scripts/lst0.asp';

function parseKandilliText(text) {
  const results = [];
  const lines = text.split(/\r?\n/);

  // Satır formatı:
  // 2026.05.17 02:36:10  36.8760   29.1275        5.0      -.-  1.5  -.-   DARIYERI-DALAMAN (MUGLA)                          İlksel
  const regex = /^(\d{4}\.\d{2}\.\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s+(.*?)\s+(İlksel|Revize|Değerlendirme)\s*$/;

  for (const line of lines) {
    const m = line.match(regex);
    if (!m) continue;

    const [, dateStr, timeStr, lat, lng, depth, md, ml, mw, placeRaw] = m;
    const place = placeRaw.trim();

    // Magnitüd: MD varsa onu, yoksa ML, yoksa Mw kullan
    let magnitude = parseFloat(md);
    if (Number.isNaN(magnitude) || md === '-.-') {
      magnitude = parseFloat(ml);
    }
    if (Number.isNaN(magnitude) || ml === '-.-') {
      magnitude = parseFloat(mw);
    }
    if (Number.isNaN(magnitude)) {
      continue;
    }

    const [year, month, day] = dateStr.split('.');
    const isoDate = `${year}-${month}-${day}T${timeStr}`;

    results.push({
      detailUrl: 'http://www.koeri.boun.edu.tr/scripts/lst0.asp',
      magnitude,
      location: place,
      date: `${day} ${monthName(month)} ${timeStr}`,
      depthKm: parseFloat(depth),
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      source: 'Kandilli Rasathanesi',
    });
  }

  return results;
}

function monthName(m) {
  const names = {
    '01': 'Oca', '02': 'Şub', '03': 'Mar', '04': 'Nis',
    '05': 'May', '06': 'Haz', '07': 'Tem', '08': 'Ağu',
    '09': 'Eyl', '10': 'Eki', '11': 'Kas', '12': 'Ara',
  };
  return names[m] || m;
}

router.get('/', async (req, res) => {
  try {
    const response = await fetch(KANDILLI_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AVUC/1.0)',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ message: 'Kandilli verisi alınamadı' });
    }

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1254');
    const html = decoder.decode(buffer);

    // <pre> etiketi içindeki veriyi çıkar
    const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/i);
    if (!preMatch) {
      return res.status(502).json({ message: 'Deprem verisi parse edilemedi' });
    }

    const quakes = parseKandilliText(preMatch[1]).slice(0, 24);

    res.json({
      status: 'ok',
      data: quakes,
      source: 'Kandilli Rasathanesi',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Earthquake fetch error:', err);
    res.status(500).json({ message: 'Deprem verisi alınırken hata oluştu' });
  }
});

module.exports = router;
