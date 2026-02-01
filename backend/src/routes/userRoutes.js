const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes here require Admin privileges
router.use(authenticateToken, authorizeAdmin);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
