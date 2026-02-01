import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/history');
                setHistory(res.data);
            } catch (error) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <Loading />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Riwayat Tontonan</h1>

            {history.length === 0 ? (
                <p>Anda belum menonton film apapun.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {history.map(item => (
                        <div key={item.id} className="relative group">
                            {/* Reusing MovieCard but we need to pass 'movie' object. 
                                History API returns array of { id, movieId, movie: {...} } */}
                            <MovieCard movie={item.movie} />
                            <div className="absolute top-2 right-2 badge badge-neutral opacity-80">
                                {new Date(item.watchedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
