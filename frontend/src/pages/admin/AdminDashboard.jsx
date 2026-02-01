import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMovies: 0,
        viewersData: [],
        popularMovies: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Loading />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">Total Pengguna</div>
                    <div className="stat-value text-primary">{stats.totalUsers}</div>
                    <div className="stat-desc">Pengguna terdaftar</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">Total Film</div>
                    <div className="stat-value text-secondary">{stats.totalMovies}</div>
                    <div className="stat-desc">Film dalam database</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Penonton Bulanan</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.viewersData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                    <Area type="monotone" dataKey="viewers" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Film Populer</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.popularMovies} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                    <Legend />
                                    <Bar dataKey="count" fill="#82ca9d" name="Tayangan" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Manajemen Film</h2>
                        <p>Tambah film baru dari TMDB, perbarui yang ada, atau hapus.</p>
                        <div className="card-actions justify-end">
                            <Link to="/admin/movies" className="btn btn-primary">Kelola Film</Link>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Manajemen Pengguna</h2>
                        <p>Lihat pengguna terdaftar, perbarui peran, atau hapus akun.</p>
                        <div className="card-actions justify-end">
                            <Link to="/admin/users" className="btn btn-secondary">Kelola Pengguna</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
