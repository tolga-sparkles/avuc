function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Yetkisiz erişim.' });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
  }

  next();
}

module.exports = adminMiddleware;
