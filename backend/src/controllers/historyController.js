const prisma = require('../config/db');

// GET /api/history
const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await prisma.watchHistory.findMany({
            where: { userId },
            include: {
                movie: true, // Include movie details
            },
            orderBy: { watchedAt: 'desc' },
        });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching history' });
    }
};

// POST /api/history
// Body: { movieId: 123 }
const addToHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;

        // Check if duplicate? Spec says prevent duplicate history for same movie.
        // Schema has @@unique([userId, movieId]) -> It will throw error if duplicate.
        // Or we can simple upsert (update watchedAt) if user watches again?
        // "Mencegah duplikasi history untuk film yang sama" - usually means only one entry.
        // If they watch again, update timestamp? Or just ignore?
        // Let's use upsert or check.

        // Let's just create. If error (P2002), we can update or ignore.
        // Or simpler: find first.

        // Actually upsert is best.
        const history = await prisma.watchHistory.upsert({
            where: {
                userId_movieId: {
                    userId,
                    movieId: parseInt(movieId),
                },
            },
            update: {
                watchedAt: new Date(),
            },
            create: {
                userId,
                movieId: parseInt(movieId),
            },
        });

        res.status(201).json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to history' });
    }
};

module.exports = {
    getHistory,
    addToHistory,
};
