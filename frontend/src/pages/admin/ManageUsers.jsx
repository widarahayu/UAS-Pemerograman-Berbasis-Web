import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/users/${userToDelete.id}`);
            toast.success('Pengguna dihapus');
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Gagal menghapus pengguna');
        }
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setFormData({ name: '', email: '', password: '', role: 'USER' });
        setShowModal(true);
    };

    const handleEditClick = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Don't send empty password

                await api.put(`/users/${currentUser.id}`, payload);
                toast.success('Pengguna berhasil diperbarui');
            } else {
                await api.post('/users', formData);
                toast.success('Pengguna berhasil dibuat');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operasi gagal');
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Pengguna</h1>
                <button onClick={handleAddClick} className="btn btn-primary gap-2">
                    <FaPlus /> Tambah Pengguna
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Peran</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover">
                                <td>
                                    <div className="font-bold">{user.name}</div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'ADMIN' ? (
                                        <span className="badge badge-primary">Admin</span>
                                    ) : (
                                        <span className="badge badge-ghost">User</span>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(user)} className="btn btn-warning btn-xs mr-2">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(user)} className="btn btn-error btn-xs">
                                        <FaTrash /> Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control w-full mb-3">
                                <label className="label"><span className="label-text">Nama</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control w-full mb-3">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control w-full mb-3">
                                <label className="label"><span className="label-text">Kata Sandi {isEditing && '(Kosongkan untuk tetap menggunakan yang lama)'}</span></label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditing}
                                />
                            </div>
                            <div className="form-control w-full mb-4">
                                <label className="label"><span className="label-text">Peran</span></label>
                                <select
                                    className="select select-bordered"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Perbarui' : 'Buat'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
                        <p>Apakah Anda yakin ingin menghapus <span className="font-bold">{userToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.</p>
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

export default ManageUsers;
