import request from 'supertest';
import app from '../app';
import usersService from '../users/users.service';
import { TaskStatus } from './tasks.types';

describe('Tasks API Integration Tests', () => {
    let tokenUserA: string;
    let tokenUserB: string;
    let taskID_A: number;

    beforeAll(async () => {
        // Clear data before tests (since we use in-memory storage)
        // Note: In a real DB, we would truncate tables here.
        // For now, restarting the test runner clears memory, 
        // but if we run multiple test files, we might need a clear method.
        
        // Register User A
        await request(app).post('/api/auth/register').send({
            email: 'userA@test.com',
            password: 'passwordA'
        });
        const loginResA = await request(app).post('/api/auth/login').send({
            email: 'userA@test.com',
            password: 'passwordA'
        });
        tokenUserA = loginResA.body.accessToken;

        // Register User B
        await request(app).post('/api/auth/register').send({
            email: 'userB@test.com',
            password: 'passwordB'
        });
        const loginResB = await request(app).post('/api/auth/login').send({
            email: 'userB@test.com',
            password: 'passwordB'
        });
        tokenUserB = loginResB.body.accessToken;
    });

    // GET /api/tasks (Empty)
    it('should return empty list initially for User A', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenUserA}`);
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    // POST /api/tasks (User A)
    it('should create a task for User A', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${tokenUserA}`)
            .send({ 
                title: 'Task A1',
                description: 'Description for A1',
                deadline: new Date().toISOString()
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Task A1');
        expect(res.body.status).toBe(TaskStatus.TODO);
        expect(res.body.id).toBeDefined();
        
        taskID_A = res.body.id;
    });

    // GET /api/tasks (User A - should have 1 task)
    it('should return 1 task for User A', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenUserA}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].id).toBe(taskID_A);
    });

    // GET /api/tasks (User B - should have 0 tasks)
    it('should return 0 tasks for User B (isolation)', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenUserB}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    // PUT /api/tasks/:id (User A - update status)
    it('should update User A task', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskID_A}`)
            .set('Authorization', `Bearer ${tokenUserA}`)
            .send({ 
                status: TaskStatus.DONE,
                title: 'Task A1 Updated'
            });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(TaskStatus.DONE);
        expect(res.body.title).toBe('Task A1 Updated');
    });

    // PUT /api/tasks/:id (User B - try to update User A's task)
    it('should NOT allow User B to update User A task', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskID_A}`)
            .set('Authorization', `Bearer ${tokenUserB}`)
            .send({ title: 'Hacked Title' });

        expect(res.status).toBe(404); 
    });

    // DELETE /api/tasks/:id (User B - try to delete User A's task)
    it('should NOT allow User B to delete User A task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskID_A}`)
            .set('Authorization', `Bearer ${tokenUserB}`);

        expect(res.status).toBe(404);
    });

    // DELETE /api/tasks/:id (User A - delete own task)
    it('should allow User A to delete own task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskID_A}`)
            .set('Authorization', `Bearer ${tokenUserA}`);

        expect(res.status).toBe(204);

        // Verify it's gone
        const check = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenUserA}`);
        expect(check.body.length).toBe(0);
    });
});