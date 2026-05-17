const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const validate = require('../middleware/validate');

router.get('/', donationController.getDonations);

router.post(
  '/',
  authMiddleware,
  validate([
    body('packageName').trim().notEmpty().withMessage('Paket adı gereklidir.'),
    body('amount').trim().notEmpty().withMessage('Miktar gereklidir.'),
  ]),
  donationController.createDonation
);

router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  validate([body('status').notEmpty().withMessage('Durum gereklidir.')]),
  donationController.updateDonationStatus
);

module.exports = router;
