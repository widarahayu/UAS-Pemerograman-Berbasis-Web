import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                // Determine if we are searching or listing all
                const endpoint = query ? `/movies?search=${query}` : '/movies';
                const res = await api.get(endpoint);
                setMovies(res.data.data);
            } catch (error) {
                console.error("Failed to search movies");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query]);

    if (loading) return <Loading />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                {query ? `Hasil Pencarian untuk "${query}"` : 'Semua Film'}
            </h1>

            {movies.length === 0 ? (
                <p>Tidak ada film ditemukan.</p>
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

export default Search;
