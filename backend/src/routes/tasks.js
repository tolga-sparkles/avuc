const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.get('/', taskController.getTasks);
router.post('/:id/join', authMiddleware, taskController.joinTask);

module.exports = router;
