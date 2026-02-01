const prisma = require('../config/db');
const { hashPassword } = require('../utils/authUtils');

// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// POST /api/users
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check duplication
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER', // Default to USER if not specified
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const dataToUpdate = { name, email, role };

        if (password) {
            dataToUpdate.password = await hashPassword(password);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
};
