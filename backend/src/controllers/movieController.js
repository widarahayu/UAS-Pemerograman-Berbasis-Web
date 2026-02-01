const prisma = require('../config/db');
const tmdbService = require('../services/tmdbService');

// GET /api/movies
// Query params: search, genre, page, limit
const getMovies = async (req, res) => {
    try {
        const { search, genre, sortBy = 'latest', page = 1, limit = 20 } = req.query;

        const where = {};
        if (search) {
            where.title = { contains: search };
        }
        if (genre) {
            where.genres = { contains: genre };
        }

        let orderBy = { createdAt: 'desc' }; // Default
        if (sortBy === 'popular') {
            orderBy = { voteAverage: 'desc' };
        } else if (sortBy === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sortBy === 'a-z') {
            orderBy = { title: 'asc' };
        } else if (sortBy === 'release_date') {
            orderBy = { releaseDate: 'desc' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const movies = await prisma.movie.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy,
        });

        const total = await prisma.movie.count({ where });

        res.json({
            data: movies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

// GET /api/movies/:id
const getMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await prisma.movie.findUnique({ where: { id: parseInt(id) } });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};

// POST /api/movies
// Body: { tmdbId: 123 }
const addMovieFromTMDB = async (req, res) => {
    try {
        const { tmdbId } = req.body;

        // Check if already exists
        const existing = await prisma.movie.findUnique({ where: { tmdbId: parseInt(tmdbId) } });
        if (existing) {
            return res.status(400).json({ message: 'Movie already exists in library' });
        }

        // Fetch from TMDB
        const tmdbData = await tmdbService.getMovieById(tmdbId);
        if (!tmdbData) {
            return res.status(404).json({ message: 'Movie not found on TMDB' });
        }

        // Map data
        const genres = tmdbData.genres ? tmdbData.genres.map(g => g.name).join(',') : '';

        // Create in DB
        const movie = await prisma.movie.create({
            data: {
                tmdbId: tmdbData.id,
                title: tmdbData.title,
                overview: tmdbData.overview || '',
                posterPath: tmdbData.poster_path,
                backdropPath: tmdbData.backdrop_path,
                releaseDate: tmdbData.release_date,
                voteAverage: tmdbData.vote_average,
                genres,
                isFeatured: false,
                videoUrl: null,
                availabilityStart: req.body.availabilityStart ? new Date(req.body.availabilityStart) : null,
                availabilityEnd: req.body.availabilityEnd ? new Date(req.body.availabilityEnd) : null,
            },
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding movie' });
    }
};

// PUT /api/movies/:id
const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, overview, genres, isFeatured, videoUrl } = req.body;

        const movie = await prisma.movie.update({
            where: { id: parseInt(id) },
            data: {
                title,
                overview,
                genres,
                isFeatured,
                videoUrl,
                availabilityStart: req.body.availabilityStart !== undefined ? (req.body.availabilityStart ? new Date(req.body.availabilityStart) : null) : undefined,
                availabilityEnd: req.body.availabilityEnd !== undefined ? (req.body.availabilityEnd ? new Date(req.body.availabilityEnd) : null) : undefined,
            },
        });

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie' });
    }
};

// DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.movie.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie' });
    }
};

// POST /api/movies/sync-tmdb-popular (Optional)
// Bulk add popular movies
const syncPopularMovies = async (req, res) => {
    try {
        const popular = await tmdbService.getPopularMovies();
        if (!popular || !popular.results) {
            return res.status(500).json({ message: 'Failed to fetch popular movies' });
        }

        let addedCount = 0;
        for (const tmdbMovie of popular.results) {
            const existing = await prisma.movie.findUnique({ where: { tmdbId: tmdbMovie.id } });
            if (!existing) {
                const genres = "Action,Drama"; // Simplified for bulk as TMDB list gives genre_ids, simpler to skip or fetch detail. 
                // Actually, fetching detail for each might be slow.
                // For now, let's just insert basic info
                await prisma.movie.create({
                    data: {
                        tmdbId: tmdbMovie.id,
                        title: tmdbMovie.title,
                        overview: tmdbMovie.overview,
                        posterPath: tmdbMovie.poster_path,
                        backdropPath: tmdbMovie.backdrop_path,
                        releaseDate: tmdbMovie.release_date,
                        voteAverage: tmdbMovie.vote_average,
                        genres: "", // Empty for now or map IDs if we have a map
                    }
                });
                addedCount++;
            }
        }
        res.json({ message: `Synced ${addedCount} new movies` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error syncing movies' });
    }
};

const searchTmdb = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const results = await tmdbService.searchMovies(query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching TMDB' });
    }
};

const getTmdbMovies = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const category = req.query.category || 'popular';

        const validCategories = ['popular', 'top_rated', 'upcoming', 'now_playing'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const data = await tmdbService.getMoviesByCategory(category, page);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movies from TMDB' });
        res.status(500).json({ message: 'Error fetching movies from TMDB' });
    }
}

const getTmdbCredits = async (req, res) => {
    try {
        const { id } = req.params; // Using tmdbId
        const data = await tmdbService.getMovieCredits(id);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching credits from TMDB' });
    }
}

const getTmdbMedia = async (req, res) => {
    try {
        const { id } = req.params; // tmdbId
        const [videos, images] = await Promise.all([
            tmdbService.getMovieVideos(id),
            tmdbService.getMovieImages(id)
        ]);

        res.json({
            videos: videos.results,
            backdrops: images.backdrops,
            posters: images.posters
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching media from TMDB' });
    }
}

module.exports = {
    getMovies,
    getMovie,
    addMovieFromTMDB,
    updateMovie,
    deleteMovie,
    syncPopularMovies,
    searchTmdb,
    getTmdbMovies,
    getTmdbCredits,
    getTmdbMedia
};
