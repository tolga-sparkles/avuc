const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

router.patch(
  '/me',
  authMiddleware,
  validate([
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('İsim 2-100 karakter arasında olmalıdır.'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Geçerli bir e-posta adresi girin.'),
  ]),
  async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const data = {};
      if (name !== undefined) data.name = name;
      if (email !== undefined) data.email = email || null;

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          identityVerified: true,
          phoneVerified: true,
          score: true,
        },
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/me/password',
  authMiddleware,
  validate([
    body('currentPassword').notEmpty().withMessage('Mevcut şifre gereklidir.'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır.')
      .matches(/[a-z]/).withMessage('Şifre en az bir küçük harf içermelidir.')
      .matches(/[A-Z]/).withMessage('Şifre en az bir büyük harf içermelidir.')
      .matches(/[0-9]/).withMessage('Şifre en az bir rakam içermelidir.'),
  ]),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Mevcut şifre hatalı.' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

      res.json({ message: 'Şifreniz başarıyla güncellendi.' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
