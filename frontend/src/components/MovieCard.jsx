import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
            <figure className="relative pt-[150%]">
                <img
                    src={movie.posterPath ? `${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${movie.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                    alt={movie.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {!movie.availabilityEnd && !movie.availabilityStart ? null : (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 text-center backdrop-blur-sm">
                        {movie.availabilityStart && !movie.availabilityEnd && `Tersedia mulai ${new Date(movie.availabilityStart).toLocaleDateString()}`}
                        {!movie.availabilityStart && movie.availabilityEnd && `Berakhir: ${new Date(movie.availabilityEnd).toLocaleDateString()}`}
                        {movie.availabilityStart && movie.availabilityEnd && `${new Date(movie.availabilityStart).toLocaleDateString()} - ${new Date(movie.availabilityEnd).toLocaleDateString()}`}
                    </div>
                )}
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-base line-clamp-1" title={movie.title}>{movie.title}</h2>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <FaStar />
                    <span>{movie.voteAverage ? movie.voteAverage.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
