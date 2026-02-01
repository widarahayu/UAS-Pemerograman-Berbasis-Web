import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Edit Modal State
    const [editingMovie, setEditingMovie] = useState(null);
    const [dateConfig, setDateConfig] = useState({
        startDate: '',
        endDate: '',
        isPermanent: true
    });
    const [showEditModal, setShowEditModal] = useState(false);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies?limit=100'); // fetch more for admin
            setMovies(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch movies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = (movie) => {
        setMovieToDelete(movie);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!movieToDelete) return;
        try {
            await api.delete(`/movies/${movieToDelete.id}`);
            toast.success('Film dihapus');
            setMovies(movies.filter(m => m.id !== movieToDelete.id));
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Gagal menghapus film');
        }
    };

    const handleEditClick = (movie) => {
        setEditingMovie(movie);
        const start = movie.availabilityStart ? movie.availabilityStart.split('T')[0] : '';
        const end = movie.availabilityEnd ? movie.availabilityEnd.split('T')[0] : '';

        setDateConfig({
            startDate: start || new Date().toISOString().split('T')[0],
            endDate: end,
            isPermanent: !movie.availabilityEnd
        });
        setShowEditModal(true);
    };

    const confirmEdit = async () => {
        if (!editingMovie) return;
        try {
            const payload = {
                availabilityStart: dateConfig.startDate ? new Date(dateConfig.startDate + 'T00:00:00') : null,
                availabilityEnd: (!dateConfig.isPermanent && dateConfig.endDate) ? new Date(dateConfig.endDate + 'T23:59:59') : null
            };

            await api.put(`/movies/${editingMovie.id}`, payload);
            toast.success('Film berhasil diperbarui');
            setShowEditModal(false);
            fetchMovies(); // Refresh list
        } catch (error) {
            toast.error('Gagal memperbarui film');
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Film</h1>
                <Link to="/admin/movies/add" className="btn btn-primary gap-2">
                    <FaPlus /> Tambah Film
                </Link>
            </div>

            {/* Movie List */}
            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Rilis</th>
                            <th>Ketersediaan</th>
                            <th>Rating</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">Tidak ada film di perpustakaan.</td>
                            </tr>
                        ) : (
                            movies.map(movie => (
                                <tr key={movie.id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={movie.posterPath ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w200${movie.posterPath}` : 'https://via.placeholder.com/50'} alt="Poster" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{movie.title}</div>
                                                <div className="text-sm opacity-50">{movie.genres}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{movie.releaseDate}</td>
                                    <td>
                                        {movie.availabilityEnd ? (
                                            <div className="flex flex-col text-xs">
                                                <span className="text-success">Mulai: {new Date(movie.availabilityStart).toLocaleDateString()}</span>
                                                <span className="text-error">Selesai: {new Date(movie.availabilityEnd).toLocaleDateString()}</span>
                                            </div>
                                        ) : (
                                            <span className="badge badge-info badge-sm">Permanen</span>
                                        )}
                                    </td>
                                    <td>{movie.voteAverage}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(movie)} className="btn btn-warning btn-xs mr-2">
                                            <FaEdit /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(movie)} className="btn btn-error btn-xs">
                                            <FaTrash /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Edit Modal */}
            {showEditModal && (

                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Ketersediaan: {editingMovie?.title}</h3>

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
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
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
                            <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Batal</button>
                            <button className="btn btn-primary" onClick={confirmEdit}>Simpan Perubahan</button>
                        </div>
                    </div>
                </div>
            )
            }
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
                        <p>Apakah Anda yakin ingin menghapus <span className="font-bold">{movieToDelete?.title}</span>? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>Batal</button>
                            <button className="btn btn-error" onClick={confirmDelete}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMovies;
