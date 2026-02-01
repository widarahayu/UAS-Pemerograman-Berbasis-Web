import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            try {
                const res = await api.get(`/movies?search=${value}&limit=5`);
                setSuggestions(res.data.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (movieId) => {
        navigate(`/movie/${movieId}`);
        setShowSuggestions(false);
        setQuery('');
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${query}`);
            setShowSuggestions(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center px-4 gap-4">
                {/* Navbar Start */}
                <div className="flex-none flex items-center gap-2">


                    <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">MovieKu</Link>
                    <div className="hidden md:flex">
                        <Link to="/" className="btn btn-ghost btn-sm">Beranda</Link>
                        <Link to="/about" className="btn btn-ghost btn-sm">Tentang</Link>
                        {user?.role === 'ADMIN' && (
                            <>
                                <Link to="/admin" className="btn btn-ghost btn-sm">Dashboard</Link>
                                <Link to="/admin/movies" className="btn btn-ghost btn-sm">Film</Link>
                                <Link to="/admin/users" className="btn btn-ghost btn-sm">Pengguna</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Navbar Center */}
                <div className="flex-1 flex justify-center">
                    <div className="form-control hidden sm:block w-full max-w-md relative" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari film..."
                                className="input input-bordered input-sm w-full pr-10"
                                value={query}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                                onFocus={() => query.length > 0 && setShowSuggestions(true)}
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs text-base-content/50"
                                onClick={() => navigate(`/search?query=${query}`)}
                            >
                                <FaSearch />
                            </button>
                        </div>

                        {/* Live Search Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-base-100 shadow-lg rounded-box mt-1 max-h-60 overflow-y-auto z-50">
                                {suggestions.map((movie) => (
                                    <li key={movie.id}>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-3 transition-colors"
                                            onClick={() => handleSuggestionClick(movie.id)}
                                        >
                                            <img
                                                src={movie.posterPath ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w92${movie.posterPath}` : 'https://via.placeholder.com/40'}
                                                alt={movie.title}
                                                className="w-8 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <div className="font-bold text-sm truncate">{movie.title}</div>
                                                <div className="text-xs opacity-70">{movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}</div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Navbar End */}
                <div className="flex-none flex justify-end gap-4">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <FaUserCircle size={40} className="w-full h-full text-neutral-content" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="menu-title px-4 py-2">Hai, {user.name}</li>
                                <li><Link to="/">Beranda</Link></li>
                                <li><Link to="/about">Tentang</Link></li>
                                <li><Link to="/history">Riwayat Tontonan</Link></li>
                                {user.role === 'ADMIN' && (
                                    <>
                                        <li><Link to="/admin">Dashboard</Link></li>
                                        <li><Link to="/admin/movies">Kelola Film</Link></li>
                                        <li><Link to="/admin/users">Kelola Pengguna</Link></li>
                                    </>
                                )}
                                <div className="divider my-0"></div>
                                <li><button onClick={handleLogout} className="text-error">Keluar</button></li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
