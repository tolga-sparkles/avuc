function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Yetkisiz erişim.' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Bu kayıt zaten mevcut.' });
  }

  return res.status(500).json({ message: 'Sunucu hatası oluştu.', error: err.message });
}

module.exports = errorHandler;
