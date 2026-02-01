import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Berhasil mendaftar!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mendaftar');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center">Daftar</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nama</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                className="input input-bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Kata Sandi</span>
                            </label>
                            <input
                                type="password"
                                placeholder="********"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Daftar</button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p>Sudah punya akun? <Link to="/login" className="text-primary hover:underline">Masuk</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
