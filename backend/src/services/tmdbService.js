const axios = require('axios');

const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
    },
});

const getMovieById = async (tmdbId) => {
    try {
        const response = await tmdbClient.get(`/movie/${tmdbId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

const getMovieCredits = async (tmdbId) => {
    try {
        const response = await tmdbClient.get(`/movie/${tmdbId}/credits`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const searchMovies = async (query) => {
    try {
        const response = await tmdbClient.get('/search/movie', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getMoviesByCategory = async (category = 'popular', page = 1) => {
    try {
        const response = await tmdbClient.get(`/movie/${category}`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getMovieVideos = async (tmdbId) => {
    try {
        const response = await tmdbClient.get(`/movie/${tmdbId}/videos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getMovieImages = async (tmdbId) => {
    try {
        const response = await tmdbClient.get(`/movie/${tmdbId}/images?include_image_language=en,null`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getMovieById,
    searchMovies,
    getMoviesByCategory,
    getMovieCredits,
    getMovieVideos,
    getMovieImages
};
