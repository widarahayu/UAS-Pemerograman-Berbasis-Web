const express = require('express');
const { getHistory, addToHistory } = require('../controllers/historyController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getHistory);
router.post('/', addToHistory);

module.exports = router;
