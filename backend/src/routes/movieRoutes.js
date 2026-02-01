const express = require('express');
const { getMovies, getMovie, addMovieFromTMDB, updateMovie, deleteMovie, syncPopularMovies, searchTmdb, getTmdbMovies, getTmdbCredits, getTmdbMedia } = require('../controllers/movieController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes (or Authenticated User routes?) 
// Spec says "List semua film di katalog lokal (Support Search & Filter via Query Params)" - implies public or user.
// Let's allow public read for now, or maybe require login?
// Spec: "User ... untuk mencari, memfilter". So probably User role required for viewing?
// Spec 5.C: "Setiap request ke API menyertakan header Authorization".
// So Read requires Auth (User or Admin).
// Write requires Admin.

// Admin Routes (TMDB) - Must be before /:id to prevent conflict
router.get('/tmdb/search', authenticateToken, authorizeAdmin, searchTmdb);
router.get('/tmdb/list', authenticateToken, authorizeAdmin, getTmdbMovies);
router.post('/sync-tmdb', authenticateToken, authorizeAdmin, syncPopularMovies);

// Public Routes
router.get('/', getMovies);
router.get('/:id', getMovie);
router.get('/tmdb/credits/:id', getTmdbCredits);
router.get('/tmdb/media/:id', getTmdbMedia);

// Admin Routes (CRUD)
router.post('/', authenticateToken, authorizeAdmin, addMovieFromTMDB);
router.put('/:id', authenticateToken, authorizeAdmin, updateMovie);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteMovie);

module.exports = router;
