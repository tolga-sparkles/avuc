const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const validate = require('../middleware/validate');

router.get('/', listingController.getListings);

router.post(
  '/',
  authMiddleware,
  validate([
    body('type').trim().notEmpty().withMessage('Tip gereklidir.'),
    body('category').trim().notEmpty().withMessage('Kategori gereklidir.'),
    body('city').trim().notEmpty().withMessage('Şehir gereklidir.'),
    body('district').trim().notEmpty().withMessage('İlçe gereklidir.'),
    body('title').trim().notEmpty().withMessage('Başlık gereklidir.'),
    body('description').trim().notEmpty().withMessage('Açıklama gereklidir.'),
  ]),
  listingController.createListing
);

router.get('/:id', listingController.getListingById);

router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  validate([body('status').notEmpty().withMessage('Durum gereklidir.')]),
  listingController.updateListingStatus
);

router.post(
  '/:id/report',
  authMiddleware,
  validate([body('reason').trim().notEmpty().withMessage('Sebep gereklidir.')]),
  listingController.reportListing
);

module.exports = router;
