const express = require('express');
const { getDashboardStats } = require('../controllers/statsController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeAdmin, getDashboardStats);

module.exports = router;
