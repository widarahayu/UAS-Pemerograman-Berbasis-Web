import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


import Home from './pages/user/Home';
import MovieDetail from './pages/user/MovieDetail';
import History from './pages/user/History';
import Search from './pages/user/Search';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import AddMovie from './pages/admin/AddMovie';
import ManageUsers from './pages/admin/ManageUsers';
import About from './pages/user/About';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route path="/history" element={<History />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<ManageMovies />} />
          <Route path="/admin/movies/add" element={<AddMovie />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
