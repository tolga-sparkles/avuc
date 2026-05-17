const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const matchRoutes = require('./routes/matches');
const taskRoutes = require('./routes/tasks');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');
const earthquakeRoutes = require('./routes/earthquakes');
const reportRoutes = require('./routes/reports');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// Genel API rate limiting
const generalLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 saniye
  max: 1000,
  message: { message: 'Çok fazla istek gönderildi. Lütfen 10 saniye sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Auth route'ları için daha katı limit (brute-force koruması)
const authLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 saniye
  max: 100, // 10 saniyede max 100 deneme
  skipSuccessfulRequests: true,
  message: { message: 'Çok fazla giriş denemesi. Lütfen 10 saniye sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/earthquakes', earthquakeRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
