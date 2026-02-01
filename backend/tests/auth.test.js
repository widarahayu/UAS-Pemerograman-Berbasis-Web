import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

const testUser = {
    name: 'Test Setup User',
    email: 'testsetup@example.com',
    password: 'password123',
};

describe('Auth Endpoints', () => {
    let token;

    // Cleanup before tests
    beforeAll(async () => {
        await prisma.watchHistory.deleteMany();
        await prisma.user.deleteMany({ where: { email: testUser.email } });
    });

    // Cleanup after tests
    afterAll(async () => {
        await prisma.watchHistory.deleteMany();
        await prisma.user.deleteMany({ where: { email: testUser.email } });
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; // Save token for protected routes
    });

    it('should get current user profile', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword',
            });

        expect(res.statusCode).toEqual(400);
    });
});
