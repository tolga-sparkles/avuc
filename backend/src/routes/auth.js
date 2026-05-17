const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

// Telefon formatı: 05xx xxx xx xx veya 05xxxxxxxx
const phoneRegex = /^05[0-9]{9}$/;

router.post(
  '/register',
  validate([
    body('name').trim().notEmpty().withMessage('İsim gereklidir.').isLength({ min: 2, max: 100 }).withMessage('İsim 2-100 karakter arasında olmalıdır.'),
    body('phone').trim().notEmpty().withMessage('Telefon numarası gereklidir.').custom((value) => {
      const digits = value.replace(/\s/g, '');
      if (!phoneRegex.test(digits)) {
        throw new Error('Telefon numarası 05xx xxx xx xx formatında olmalıdır.');
      }
      return true;
    }),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Geçerli bir e-posta adresi girin.'),
    body('password')
      .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
      .matches(/[a-z]/).withMessage('Şifre en az bir küçük harf içermelidir.')
      .matches(/[A-Z]/).withMessage('Şifre en az bir büyük harf içermelidir.')
      .matches(/[0-9]/).withMessage('Şifre en az bir rakam içermelidir.'),
  ]),
  authController.register
);

router.post(
  '/login',
  validate([
    body('phone').trim().notEmpty().withMessage('Telefon numarası gereklidir.').custom((value) => {
      const digits = value.replace(/\s/g, '');
      if (!phoneRegex.test(digits)) {
        throw new Error('Geçerli bir telefon numarası girin.');
      }
      return true;
    }),
    body('password').notEmpty().withMessage('Şifre gereklidir.'),
  ]),
  authController.login
);

router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);

router.post('/forgot-password', validate([
  body('phone').trim().notEmpty().withMessage('Telefon numarası gereklidir.'),
]), authController.forgotPassword);

router.post('/reset-password', validate([
  body('phone').trim().notEmpty().withMessage('Telefon numarası gereklidir.'),
  body('newPassword').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır.'),
]), authController.resetPassword);

module.exports = router;
