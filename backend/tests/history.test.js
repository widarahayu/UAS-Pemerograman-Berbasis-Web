import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

const user = {
    name: 'History User',
    email: 'history@example.com',
    password: 'password',
};

describe('Watch History Endpoints', () => {
    let token;
    let movieId;

    beforeAll(async () => {
        await prisma.watchHistory.deleteMany();
        await prisma.user.deleteMany({ where: { email: user.email } });

        // Create User
        const regRes = await request(app).post('/api/auth/register').send(user);
        token = regRes.body.token;

        // Ensure a movie exists (using raw query or setup)
        // We'll Create a dummy movie directly in DB to rely less on TMDB/External
        const movie = await prisma.movie.create({
            data: {
                tmdbId: 999999,
                title: 'Test Movie History',
                overview: 'Test Overview',
                isFeatured: false
            }
        });
        movieId = movie.id;
    });

    afterAll(async () => {
        await prisma.watchHistory.deleteMany();
        await prisma.movie.deleteMany({ where: { tmdbId: 999999 } });
        await prisma.user.deleteMany({ where: { email: user.email } });
        await prisma.$disconnect();
    });

    it('should add a movie to watch history', async () => {
        const res = await request(app)
            .post('/api/history')
            .set('Authorization', `Bearer ${token}`)
            .send({ movieId });

        expect(res.statusCode).toEqual(201);
        expect(res.body.movieId).toEqual(movieId);
    });

    it('should get watch history', async () => {
        const res = await request(app)
            .get('/api/history')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].movieId).toEqual(movieId);
        expect(res.body[0].movie).toHaveProperty('title', 'Test Movie History'); // Check relation
    });
});
