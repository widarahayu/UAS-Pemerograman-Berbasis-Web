const prisma = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalUsers = await prisma.user.count();
        const totalMovies = await prisma.movie.count();

        // 2. Monthly Viewers (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await prisma.watchHistory.findMany({
            where: {
                watchedAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                watchedAt: true
            }
        });

        // Group by Month
        const months = {};
        monthlyData.forEach(entry => {
            const month = new Date(entry.watchedAt).toLocaleString('default', { month: 'short' });
            months[month] = (months[month] || 0) + 1;
        });

        const viewersData = Object.keys(months).map(key => ({
            name: key,
            viewers: months[key]
        }));

        // 3. Popular Movies (Top 5)
        const popularMoviesRaw = await prisma.watchHistory.groupBy({
            by: ['movieId'],
            _count: {
                movieId: true
            },
            orderBy: {
                _count: {
                    movieId: 'desc'
                }
            },
            take: 5
        });

        // Fetch movie details for these IDs
        const popularMovies = await Promise.all(popularMoviesRaw.map(async (item) => {
            const movie = await prisma.movie.findUnique({
                where: { id: item.movieId },
                select: { title: true }
            });
            return {
                name: movie ? movie.title : 'Unknown',
                count: item._count.movieId
            };
        }));

        res.json({
            totalUsers,
            totalMovies,
            viewersData,
            popularMovies
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = {
    getDashboardStats
};
