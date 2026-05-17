const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { name, phone, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email: email || undefined }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Bu telefon veya e-posta zaten kayıtlı.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        identityVerified: true,
        phoneVerified: true,
        score: true,
        createdAt: true,
      },
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz telefon veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz telefon veya şifre.' });
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        identityVerified: user.identityVerified,
        phoneVerified: user.phoneVerified,
        score: user.score,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token gereklidir.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken({ userId: decoded.userId, role: decoded.role });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        identityVerified: true,
        phoneVerified: true,
        score: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { phone } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      // Güvenlik için kullanıcı var mı yok mu fark etmeksizin aynı mesaj
      return res.json({ message: 'Telefon numarası kayıtlıysa şifre sıfırlama bağlantısı gönderildi.' });
    }

    // TODO: Gerçek SMS entegrasyonu eklenecek (Twilio, Netgsm vb.)
    // Şimdilik sadece basit bir yanıt dönüyoruz.
    // Gelecekte: OTP kodu üret, SMS ile gönder, verify endpoint'i ekle.

    return res.json({ message: 'Telefon numarası kayıtlıysa şifre sıfırlama bağlantısı gönderildi.' });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { phone, newPassword } = req.body;

    if (!phone || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Telefon ve yeni şifre gereklidir. Şifre en az 6 karakter olmalıdır.' });
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({ message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  refresh,
  me,
  forgotPassword,
  resetPassword,
};
