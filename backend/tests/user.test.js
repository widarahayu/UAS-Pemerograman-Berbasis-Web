import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

const adminUser = {
    name: 'Admin User Test',
    email: 'admin_users@example.com',
    password: 'password',
    role: 'ADMIN',
};

const targetUser = {
    name: 'Target User',
    email: 'target@example.com',
    password: 'password',
    role: 'USER',
};

describe('User Management Endpoints (Admin)', () => {
    let adminToken;
    let targetUserId;

    beforeAll(async () => {
        // Cleanup
        await prisma.watchHistory.deleteMany();
        await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, targetUser.email, 'updated@example.com'] } } });

        // Create Admin
        await request(app).post('/api/auth/register').send(adminUser);
        await prisma.user.update({ where: { email: adminUser.email }, data: { role: 'ADMIN' } });
        const loginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
        adminToken = loginRes.body.token;
    });

    afterAll(async () => {
        await prisma.watchHistory.deleteMany();
        await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, targetUser.email, 'updated@example.com'] } } });
        await prisma.$disconnect();
    });

    it('should create a new user by Admin', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(targetUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body.email).toEqual(targetUser.email);
        targetUserId = res.body.id;
    });

    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2); // Admin + Target
    });

    it('should update a user', async () => {
        const res = await request(app)
            .put(`/api/users/${targetUserId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Name', email: 'updated@example.com' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Updated Name');
        expect(res.body.email).toEqual('updated@example.com');
    });

    it('should delete a user', async () => {
        const res = await request(app)
            .delete(`/api/users/${targetUserId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);

        // Verify deletion
        const check = await prisma.user.findUnique({ where: { id: targetUserId } });
        expect(check).toBeNull();
    });
});
