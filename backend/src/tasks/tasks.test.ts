import request from 'supertest';
import app from '../app.js';
import prisma from '../prisma.js';
import { TaskStatus } from './tasks.types.js';

describe('Tasks API Integration Tests', () => {
    let tokenUserA: string;
    let tokenUserB: string;
    let taskID_A: number;
    const uniqueId = Date.now();

    // Setup: Cleanup DB and register two users for isolation tests
    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();

        // Setup User A
        const emailA = `userA-${uniqueId}@test.com`;
        await request(app).post('/api/auth/register').send({
            email: emailA,
            password: 'passwordA',
            name: 'User A'
        });
        const loginA = await request(app).post('/api/auth/login').send({ email: emailA, password: 'passwordA' });
        tokenUserA = loginA.body.accessToken;

        // Setup User B
        const emailB = `userB-${uniqueId}@test.com`;
        await request(app).post('/api/auth/register').send({
            email: emailB,
            password: 'passwordB',
            name: 'User B'
        });
        const loginB = await request(app).post('/api/auth/login').send({ email: emailB, password: 'passwordB' });
        tokenUserB = loginB.body.accessToken;
    });

    describe('POST /api/tasks', () => {
        it('should create a task with full details', async () => {
            const newTask = { 
                title: 'Complex Task',
                description: 'Detailed description',
                status: TaskStatus.IN_PROGRESS,
                deadline: new Date('2026-12-31').toISOString()
            };

            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send(newTask);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            taskID_A = res.body.id;
        });
    });

    describe('GET /api/tasks', () => {
        it('should return the task for User A', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`);

            expect(res.status).toBe(200);
            expect(res.body.some((t: any) => t.id === taskID_A)).toBe(true);
        });

        it('should return empty list for User B (isolation check)', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserB}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('should partially update status without erasing title', async () => {
            const res = await request(app)
                .put(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send({ status: TaskStatus.DONE });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(TaskStatus.DONE);
            expect(res.body.title).toBe('Complex Task');
        });

        it('should NOT allow User B to update User A task', async () => {
            const res = await request(app)
                .put(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserB}`)
                .send({ title: 'Hacked' });

            expect(res.status).toBe(404); 
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('should allow User A to delete own task', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserA}`);

            expect(res.status).toBe(204);
        });
    });
});