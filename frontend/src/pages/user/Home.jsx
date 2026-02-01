import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import MovieCard from '../../components/MovieCard';
import HeroBanner from '../../components/HeroBanner';
import Loading from '../../components/Loading';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState('latest'); // 'latest', 'popular', 'oldest', 'a-z'
    const [headerTitle, setHeaderTitle] = useState('Film Terbaru');
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Determine sort param
                const res = await api.get(`/movies?sortBy=${filter}`);
                const movieList = res.data.data;
                setMovies(movieList);

                // Pick top 5 movies for the slider
                if (movieList.length > 0) {
                    // Randomize or just take top 5
                    // Let's shuffle a bit so it's not always the same if list is static
                    const shuffled = [...movieList].sort(() => 0.5 - Math.random());
                    setFeaturedMovies(shuffled.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching movies", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [filter]); // Re-fetch when filter changes

    if (loading) return <Loading />;

    return (
        <div>
            {featuredMovies.length > 0 && <HeroBanner movies={featuredMovies} />}

            <div className="flex justify-between items-center mb-4 border-l-4 border-primary pl-4">
                <h2 className="text-2xl font-bold">{headerTitle}</h2>
                <div className="join">
                    <button
                        className={`join-item btn btn-xs sm:btn-sm ${filter === 'latest' ? 'btn-active btn-primary' : ''}`}
                        onClick={() => { setFilter('latest'); setHeaderTitle('Film Terbaru'); }}
                    >
                        Terbaru
                    </button>
                    <button
                        className={`join-item btn btn-xs sm:btn-sm ${filter === 'popular' ? 'btn-active btn-primary' : ''}`}
                        onClick={() => { setFilter('popular'); setHeaderTitle('Film Populer'); }}
                    >
                        Populer
                    </button>
                    <button
                        className={`join-item btn btn-xs sm:btn-sm ${filter === 'release_date' ? 'btn-active btn-primary' : ''}`}
                        onClick={() => { setFilter('release_date'); setHeaderTitle('Berdasarkan Tanggal Rilis'); }}
                    >
                        Tanggal Rilis
                    </button>
                </div>
            </div>

            {movies.length === 0 ? (
                <div className="text-center py-10">
                    <p>Tidak ada film ditemukan. Silakan minta Admin untuk menambahkan film dari TMDB.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
