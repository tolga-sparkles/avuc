const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/stats', authMiddleware, adminMiddleware, adminController.getStats);
router.get('/pending-listings', authMiddleware, adminMiddleware, adminController.getPendingListings);
router.get('/reports', authMiddleware, adminMiddleware, adminController.getReports);
router.post('/reports/:id/resolve', authMiddleware, adminMiddleware, adminController.resolveReport);
router.get('/disaster-reports', authMiddleware, adminMiddleware, adminController.getDisasterReports);
router.post('/disaster-reports/:id/resolve', authMiddleware, adminMiddleware, adminController.resolveDisasterReport);

module.exports = router;
