const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/suggestions/:listingId', matchController.getSuggestions);

router.post(
  '/',
  authMiddleware,
  validate([
    body('listingId1').notEmpty().withMessage('İlan 1 gereklidir.'),
    body('listingId2').notEmpty().withMessage('İlan 2 gereklidir.'),
  ]),
  matchController.createMatch
);

router.patch(
  '/:id/status',
  authMiddleware,
  validate([body('status').notEmpty().withMessage('Durum gereklidir.')]),
  matchController.updateMatchStatus
);

module.exports = router;
