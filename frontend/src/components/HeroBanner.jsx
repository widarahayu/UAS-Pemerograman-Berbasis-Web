import React from 'react';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

const HeroBanner = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!movies || movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 5000); // Slide every 5 seconds

        return () => clearInterval(interval);
    }, [movies]);

    if (!movies || movies.length === 0) return null;

    const movie = movies[currentIndex];

    // Preload next image for smoother transition
    const nextIndex = (currentIndex + 1) % movies.length;
    const nextMovie = movies[nextIndex];
    if (nextMovie?.backdropPath) {
        const img = new Image();
        img.src = `${import.meta.env.VITE_TMDB_IMAGE_URL}/original${nextMovie.backdropPath}`;
    }

    const backdropUrl = movie.backdropPath
        ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/original${movie.backdropPath}`
        : 'https://via.placeholder.com/1920x800?text=No+Backdrop';

    return (
        <div className="hero min-h-[60vh] rounded-box overflow-hidden relative mb-8 transition-all duration-1000 ease-in-out"
            key={movie.id} // Key helps React trigger animation/re-render
            style={{ backgroundImage: `url(${backdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="hero-overlay bg-opacity-60 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
            <div className="hero-content text-neutral-content text-left absolute bottom-0 left-0 p-8 w-full">
                <div className="max-w-xl animate-fade-in-up">
                    <h1 className="mb-5 text-4xl md:text-5xl font-bold drop-shadow-lg">{movie.title}</h1>
                    <p className="mb-5 line-clamp-3 drop-shadow-md text-lg">{movie.overview}</p>
                    <div className="flex gap-2">
                        <Link to={`/movie/${movie.id}`} className="btn btn-primary">Tonton Sekarang</Link>
                        {/* Dots Indicator */}
                        <div className="flex items-center gap-1 ml-4">
                            {movies.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-4' : 'bg-white/50'}`}
                                    onClick={() => setCurrentIndex(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
