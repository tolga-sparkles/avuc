import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as cheerio from 'cheerio'

const app = express()
const PORT = 3002

app.use(cors())
app.use(express.json())

// Cache mekanizması
let cache = {
  data: null,
  timestamp: 0,
}
const CACHE_DURATION = 120000 // 2 dakika (120 saniye)

async function fetchEarthquakesFromAFAD() {
  const { data: html } = await axios.get('https://deprem.afad.gov.tr/last-earthquakes.html', {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
    },
  })

  const $ = cheerio.load(html)
  const rows = []

  // AFAD tablosu: tbody > tr
  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td')
    if (tds.length >= 8) {
      const dateRaw = $(tds[0]).text().trim()
      const lat = $(tds[1]).text().trim()
      const lon = $(tds[2]).text().trim()
      const depth = $(tds[3]).text().trim()
      const type = $(tds[4]).text().trim()
      const magnitude = $(tds[5]).text().trim()
      const location = $(tds[6]).text().trim()
      const detailLink = $(tds[7]).find('a').attr('href') || ''

      // Sadece geçerli satırları al (tarih ve büyüklük kontrolü)
      if (dateRaw && magnitude && !isNaN(parseFloat(magnitude))) {
        rows.push({
          date: dateRaw,
          latitude: parseFloat(lat) || null,
          longitude: parseFloat(lon) || null,
          depthKm: parseFloat(depth) || null,
          type,
          magnitude: parseFloat(magnitude),
          location,
          detailUrl: detailLink,
        })
      }
    }
  })

  return rows
}

/**
 * GET /api/earthquakes
 * AFAD son depremler sayfasını çekip JSON olarak döner.
 * Cache mekanizması: 2 dakikada bir günceller.
 */
app.get('/api/earthquakes', async (req, res) => {
  try {
    const now = Date.now()
    
    // Cache kontrolü: Eğer veri var ve 2 dakikadan yeni ise cache'ten dön
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
      console.log(`[${new Date().toISOString()}] Cache'ten döndürüldü (${Math.round((now - cache.timestamp)/1000)}s önce güncellendi)`)
      return res.json({
        success: true,
        count: cache.data.length,
        source: 'https://deprem.afad.gov.tr/last-earthquakes.html',
        fetchedAt: new Date(cache.timestamp).toISOString(),
        cached: true,
        data: cache.data,
      })
    }

    // Cache boş veya eski, AFAD'dan çek
    console.log(`[${new Date().toISOString()}] AFAD'dan yeni veri çekiliyor...`)
    const rows = await fetchEarthquakesFromAFAD()
    
    // Cache'i güncelle
    cache = {
      data: rows,
      timestamp: now,
    }

    res.json({
      success: true,
      count: rows.length,
      source: 'https://deprem.afad.gov.tr/last-earthquakes.html',
      fetchedAt: new Date().toISOString(),
      cached: false,
      data: rows,
    })
  } catch (err) {
    console.error('AFAD çekme hatası:', err.message)
    
    // Hata durumunda eski cache varsa onu döndür (stale-while-revalidate)
    if (cache.data) {
      console.log(`[${new Date().toISOString()}] Hata oluştu, eski cache döndürülüyor...`)
      return res.json({
        success: true,
        count: cache.data.length,
        source: 'https://deprem.afad.gov.tr/last-earthquakes.html',
        fetchedAt: new Date(cache.timestamp).toISOString(),
        cached: true,
        stale: true,
        error: err.message,
        data: cache.data,
      })
    }
    
    res.status(502).json({
      success: false,
      error: 'AFAD verisi alınamadı',
      message: err.message,
    })
  }
})

// Basit sağlık kontrolü
app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true, 
    time: new Date().toISOString(),
    cacheAge: cache.data ? Math.round((Date.now() - cache.timestamp) / 1000) + 's' : 'no cache',
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend proxy çalışıyor: http://0.0.0.0:${PORT}/api/earthquakes`)
  console.log(`Cache süresi: ${CACHE_DURATION / 1000} saniye`)
})
