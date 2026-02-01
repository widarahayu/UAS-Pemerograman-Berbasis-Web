import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { FaPlay, FaCalendar, FaStar, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [media, setMedia] = useState({ videos: [], backdrops: [], posters: [] });
    const [activeTab, setActiveTab] = useState('videos');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await api.get(`/movies/${id}`);
                setMovie(res.data);

                // Fetch Cast if TMDB ID exists
                if (res.data.tmdbId) {
                    const creditsRes = await api.get(`/movies/tmdb/credits/${res.data.tmdbId}`);
                    setCast(creditsRes.data.cast || []);
                    setCrew(creditsRes.data.crew || []);

                    const mediaRes = await api.get(`/movies/tmdb/media/${res.data.tmdbId}`);
                    setMedia(mediaRes.data || { videos: [], backdrops: [], posters: [] });
                }
            } catch (error) {
                toast.error('Gagal memuat detail film');
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleWatch = async () => {
        if (!user) {
            toast.error("Silakan masuk untuk menonton film");
            navigate('/login');
            return;
        }
        try {
            await api.post('/history', { movieId: movie.id });
            toast.success('Film dimulai! Ditambahkan ke riwayat.');
            // Here you would normally route to a video player page or open a modal
        } catch (error) {
            console.error(error);
            toast.error('Gagal memperbarui riwayat', { id: 'history-error' }); // prevent duplicate toasts
        }
    };

    if (loading) return <Loading />;
    if (!movie) return <div className="text-center p-10">Film tidak ditemukan</div>;

    const backdropUrl = movie.backdropPath
        ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/original${movie.backdropPath}`
        : 'https://via.placeholder.com/1920x800?text=No+Backdrop';


    const isUpcoming = movie?.availabilityStart && new Date() < new Date(movie.availabilityStart);
    const isEnded = movie?.availabilityEnd && new Date() > new Date(movie.availabilityEnd);
    const availableDate = movie?.availabilityStart ? new Date(movie.availabilityStart).toLocaleDateString() : '';

    return (
        <div className="min-h-screen -m-6 relative">
            {/* Backdrop Background */}
            <div className="absolute inset-0 z-0">
                <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover opacity-30 mask mask-image-gradient" />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/90 to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <Link to="/" className="btn btn-ghost gap-2 mb-6"><FaArrowLeft /> Kembali ke Beranda</Link>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <img
                            src={movie.posterPath ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${movie.posterPath}` : 'https://via.placeholder.com/300x450'}
                            alt={movie.title}
                            className="rounded-lg shadow-2xl w-[300px]"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                        <div className="flex flex-wrap gap-4 mb-6 opacity-80">
                            {movie.releaseDate && (
                                <div className="flex items-center gap-2"><FaCalendar /> {movie.releaseDate.split('-')[0]}</div>
                            )}
                            <div className="flex items-center gap-2 text-yellow-500"><FaStar /> {movie.voteAverage?.toFixed(1)}</div>
                            {movie.genres && (
                                <div className="badge badge-outline">{movie.genres}</div>
                            )}
                            {/* Availability Badges */}
                            {isUpcoming && <div className="badge badge-info gap-1"><FaCalendar /> Rilis {availableDate}</div>}
                            {isEnded && <div className="badge badge-error gap-1"><FaCalendar /> Berakhir</div>}
                        </div>

                        <p className="text-lg mb-8 leading-relaxed max-w-3xl">
                            {movie.overview}
                        </p>


                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                            {crew.find(m => m.job === 'Director') && (
                                <div>
                                    <h3 className="font-bold border-b border-white/20 pb-1 mb-2 inline-block">Sutradara</h3>
                                    <p>{crew.find(m => m.job === 'Director').name}</p>
                                </div>
                            )}
                            {crew.filter(m => m.department === 'Writing' || m.job === 'Screenplay' || m.job === 'Writer').length > 0 && (
                                <div>
                                    <h3 className="font-bold border-b border-white/20 pb-1 mb-2 inline-block">Penulis</h3>
                                    <p>{crew.filter(m => m.department === 'Writing' || m.job === 'Screenplay' || m.job === 'Writer').slice(0, 2).map(m => m.name).join(', ')}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {isUpcoming ? (
                                <button className="btn btn-disabled btn-lg gap-2 opacity-50 cursor-not-allowed">
                                    <FaCalendar /> Segera Tayang
                                </button>
                            ) : isEnded ? (
                                <button className="btn btn-disabled btn-lg gap-2 opacity-50 cursor-not-allowed">
                                    <FaCalendar /> Tidak Tersedia
                                </button>
                            ) : (
                                <button onClick={handleWatch} className="btn btn-primary btn-lg gap-2">
                                    <FaPlay /> Tonton Sekarang
                                </button>
                            )}
                            {/* <button className="btn btn-secondary btn-lg gap-2">Trailer</button> */}
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {cast.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Pemeran Utama</h2>
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
                            {cast.slice(0, 10).map(actor => (
                                <div key={actor.id} className="flex-shrink-0 w-32 md:w-40 bg-base-100 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
                                    <div className="w-full aspect-[2/3] bg-base-300">
                                        <img
                                            src={actor.profile_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                            alt={actor.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm truncate" title={actor.name}>{actor.name}</h3>
                                        <p className="text-xs opacity-70 truncate" title={actor.character}>{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media Section */}
                {(media.videos.length > 0 || media.backdrops.length > 0 || media.posters.length > 0) && (
                    <div className="mt-12">
                        <div className="flex items-center gap-6 mb-6">
                            <h2 className="text-2xl font-bold">Media</h2>
                            <div className="tabs tabs-boxed bg-transparent p-0 gap-2">
                                <a className={`tab ${activeTab === 'videos' ? 'tab-active' : ''}`} onClick={() => setActiveTab('videos')}>Video {media.videos.length}</a>
                                <a className={`tab ${activeTab === 'backdrops' ? 'tab-active' : ''}`} onClick={() => setActiveTab('backdrops')}>Latar Belakang {media.backdrops.length}</a>
                                <a className={`tab ${activeTab === 'posters' ? 'tab-active' : ''}`} onClick={() => setActiveTab('posters')}>Poster {media.posters.length}</a>
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-6 scrollbar-thin">
                            <div className="flex gap-4">
                                {activeTab === 'videos' && media.videos.map(video => (
                                    <div key={video.id} className="flex-shrink-0 w-80 md:w-96 aspect-video bg-black rounded-lg overflow-hidden relative group">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${video.key}`}
                                            title={video.name}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ))}
                                {activeTab === 'backdrops' && media.backdrops.map((img, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-80 md:w-96 aspect-video bg-base-300 rounded-lg overflow-hidden">
                                        <img src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${img.file_path}`} alt="Backdrop" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                ))}
                                {activeTab === 'posters' && media.posters.map((img, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-40 md:w-48 aspect-[2/3] bg-base-300 rounded-lg overflow-hidden">
                                        <img src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w300${img.file_path}`} alt="Poster" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                ))}
                            </div>
                            {((activeTab === 'videos' && media.videos.length === 0) ||
                                (activeTab === 'backdrops' && media.backdrops.length === 0) ||
                                (activeTab === 'posters' && media.posters.length === 0)) && (
                                    <div className="text-center w-full py-10 opacity-50">Tidak ada media dalam kategori ini.</div>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;
