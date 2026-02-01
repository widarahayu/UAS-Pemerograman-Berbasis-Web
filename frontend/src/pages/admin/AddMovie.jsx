import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tmdbMovies, setTmdbMovies] = useState([]);
    const [category, setCategory] = useState('popular'); // 'popular', 'top_rated', 'upcoming', 'now_playing'
    const [isSearching, setIsSearching] = useState(false);
    const [existingMovies, setExistingMovies] = useState(new Set());

    // Modal State
    const [selectedId, setSelectedId] = useState(null);
    const [dateConfig, setDateConfig] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isPermanent: true
    });
    const [showModal, setShowModal] = useState(false);

    // Fetch existing movies to check for duplicates
    useEffect(() => {
        const fetchExisting = async () => {
            try {
                const res = await api.get('/movies?limit=1000');
                const ids = new Set(res.data.data.map(m => m.tmdbId));
                setExistingMovies(ids);
            } catch (error) {
                console.error("Failed to fetch existing movies");
            }
        };
        fetchExisting();
    }, []);

    const fetchTmdbMovies = async (cat = 'popular') => {
        setIsSearching(true);
        try {
            const res = await api.get(`/movies/tmdb/list?category=${cat}`);
            setTmdbMovies(res.data.results || []);
        } catch (error) {
            toast.error("Gagal mengambil film dari TMDB");
        } finally {
            setIsSearching(false);
        }
    };

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        setSearchTerm(''); // Clear search when changing category
        fetchTmdbMovies(newCat);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            fetchTmdbMovies(category);
            return;
        }
        setIsSearching(true);
        try {
            const res = await api.get(`/movies/tmdb/search?query=${searchTerm}`);
            setTmdbMovies(res.data.results || []);
        } catch (error) {
            toast.error("Gagal mencari di TMDB");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchTmdbMovies(category);
    }, []);

    const openAddModal = (id) => {
        setSelectedId(id);
        setDateConfig({
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isPermanent: true
        });
        setShowModal(true);
    };

    const confirmAddMovie = async () => {
        if (!selectedId) return;

        try {
            const payload = {
                tmdbId: parseInt(selectedId),
                availabilityStart: dateConfig.startDate ? new Date(dateConfig.startDate + 'T00:00:00') : null,
                availabilityEnd: (!dateConfig.isPermanent && dateConfig.endDate) ? new Date(dateConfig.endDate + 'T23:59:59') : null
            };

            await api.post('/movies', payload);
            toast.success('Film berhasil ditambahkan!');
            setExistingMovies(prev => new Set(prev).add(selectedId));
            setShowModal(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast("Film sudah ada di perpustakaan", { icon: 'ℹ️' });
            } else {
                toast.error(error.response?.data?.message || 'Gagal menambahkan film');
            }
        }
    };

    return (
        <div className="h-[calc(100vh-170px)] flex flex-col bg-base-100 rounded-xl shadow-xl overflow-hidden border border-base-300">
            {/* Header Section (Sticky/Fixed equivalent in flex) */}
            <div className="flex-none p-4 bg-base-100 border-b border-base-200 z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    {/* Title & Back */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin/movies')} className="btn btn-ghost btn-circle btn-sm">
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold">Tambah Film</h1>
                    </div>

                    {/* Controls Group */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                        {/* Tabs - Now cleaner */}
                        <div className="tabs tabs-boxed bg-base-200/50 p-1">
                            <a className={`tab tab-sm ${category === 'popular' && !searchTerm ? 'tab-active' : ''}`} onClick={() => handleCategoryChange('popular')}>Populer</a>
                            <a className={`tab tab-sm ${category === 'top_rated' && !searchTerm ? 'tab-active' : ''}`} onClick={() => handleCategoryChange('top_rated')}>Rating Tertinggi</a>
                            <a className={`tab tab-sm ${category === 'upcoming' && !searchTerm ? 'tab-active' : ''}`} onClick={() => handleCategoryChange('upcoming')}>Akan Datang</a>
                            <a className={`tab tab-sm ${category === 'now_playing' && !searchTerm ? 'tab-active' : ''}`} onClick={() => handleCategoryChange('now_playing')}>Sedang Tayang</a>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="join w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Cari TMDB..."
                                className="input input-sm input-bordered join-item w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="btn btn-sm btn-primary join-item">
                                Cari
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-base-200/50">
                {tmdbMovies.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <p>Tidak ada film ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {tmdbMovies.map(movie => {
                            const added = existingMovies.has(movie.id);
                            return (
                                <div key={movie.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 group h-full">
                                    <figure className="relative pt-[150%] overflow-hidden">
                                        <img
                                            src={movie.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w300${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
                                            alt={movie.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {added ? (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <span className="badge badge-success font-bold gap-1"><FaPlus className="rotate-45" /> Ditambahkan</span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <button
                                                    onClick={() => openAddModal(movie.id)}
                                                    className="btn btn-primary btn-sm gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform"
                                                >
                                                    <FaPlus /> Tambah
                                                </button>
                                            </div>
                                        )}
                                    </figure>
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm truncate" title={movie.title}>{movie.title}</h3>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] bg-base-300 px-1 rounded opacity-70">
                                                {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                                            </span>
                                            <span className="text-[10px] opacity-70">⭐ {movie.vote_average?.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Availability Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Atur Ketersediaan</h3>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={dateConfig.isPermanent}
                                    onChange={(e) => setDateConfig({ ...dateConfig, isPermanent: e.target.checked })}
                                />
                                <span className="label-text font-semibold">Buat Permanen (Tanpa Tanggal Selesai)</span>
                            </label>
                            <p className="text-xs text-base-content/60 ml-10 mb-4">Film akan tersedia selamanya.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Tanggal Mulai</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={dateConfig.startDate}
                                    onChange={(e) => setDateConfig({ ...dateConfig, startDate: e.target.value })}
                                />
                            </div>
                            {!dateConfig.isPermanent && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Tanggal Selesai</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered"
                                        value={dateConfig.endDate}
                                        min={dateConfig.startDate}
                                        onChange={(e) => setDateConfig({ ...dateConfig, endDate: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
                            <button className="btn btn-primary" onClick={confirmAddMovie}>Konfirmasi Tambah</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setShowModal(false)}>close</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddMovie;
