import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Tentang MovieKu</h1>
                    <p className="text-xl text-base-content/70">
                        Destinasi utama bagi pecinta film untuk menemukan, melacak, dan mengelola film favorit mereka.
                    </p>
                </div>

                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Misi Kami</h2>
                        <p className="mb-4">
                            MovieKu dibangun dengan tujuan sederhana: menyediakan antarmuka yang bersih, modern, dan ramah pengguna untuk menjelajahi dunia sinema yang luas.
                            Didukung oleh API TMDB, kami menyajikan informasi terkini tentang ribuan film.
                        </p>
                        <p>
                            Baik Anda mencari film blockbuster terbaru, permata indie, atau klasik untuk ditonton ulang, MovieKu siap membantu.
                            Buat akun untuk melacak riwayat tontonan Anda dan jangan pernah melupakan film yang pernah Anda tonton.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
