import request from 'supertest';
import app from '../app.js';
import { TaskStatus } from './tasks.types.js';

describe('Tasks API Integration Tests', () => {
    let tokenUserA: string;
    let tokenUserB: string;
    let taskID_A: number;

    // Setup: Register two different users to test data isolation
    beforeAll(async () => {
        // Register User A
        await request(app).post('/api/auth/register').send({
            email: 'taskuserA@test.com',
            password: 'passwordA',
            name: 'User A'
        });
        const loginResA = await request(app).post('/api/auth/login').send({
            email: 'taskuserA@test.com',
            password: 'passwordA'
        });
        tokenUserA = loginResA.body.accessToken;

        // Register User B
        await request(app).post('/api/auth/register').send({
            email: 'taskuserB@test.com',
            password: 'passwordB',
            name: 'User B'
        });
        const loginResB = await request(app).post('/api/auth/login').send({
            email: 'taskuserB@test.com',
            password: 'passwordB'
        });
        tokenUserB = loginResB.body.accessToken;
    });

    describe('POST /api/tasks', () => {
        // Test creation with all available fields
        it('should create a task with full details (desc, status, deadline)', async () => {
            const newTask = { 
                title: 'Complex Task',
                description: 'Detailed description for testing',
                status: TaskStatus.IN_PROGRESS,
                deadline: new Date('2025-12-31').toISOString()
            };

            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send(newTask);

            expect(res.status).toBe(201);
            expect(res.body.title).toBe(newTask.title);
            expect(res.body.description).toBe(newTask.description);
            expect(res.body.status).toBe(TaskStatus.IN_PROGRESS);
            expect(res.body.deadline).toBe(newTask.deadline);
            expect(res.body.id).toBeDefined();
            
            taskID_A = res.body.id;
        });

        // Test validation for invalid data types
        it('should return 400 if deadline is invalid', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send({ 
                    title: 'Invalid Task',
                    deadline: "this-is-not-a-date" 
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/invalid/i);
        });
    });

    describe('GET /api/tasks', () => {
        // Verify User A sees their task
        it('should return the created task for User A', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            const task = res.body.find((t: any) => t.id === taskID_A);
            expect(task).toBeDefined();
            expect(task.title).toBe('Complex Task');
        });

        // Verify isolation: User B should see 0 tasks
        it('should return empty list for User B (isolation check)', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserB}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        // Test Full Update: Changing all fields at once
        it('should fully update the task (title, desc, status)', async () => {
            const fullUpdate = { 
                title: 'Completely New Title',
                description: 'New Description',
                status: TaskStatus.DONE
            };

            const res = await request(app)
                .put(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send(fullUpdate);

            expect(res.status).toBe(200);
            expect(res.body.title).toBe(fullUpdate.title);
            expect(res.body.description).toBe(fullUpdate.description);
            expect(res.body.status).toBe(TaskStatus.DONE);
        });

        // Test Partial Update: Changing only one field shouldn't erase others
        it('should partially update the task (only status) without erasing description', async () => {
            // We only send status, expecting title and desc to remain from previous test
            const partialUpdate = { 
                status: TaskStatus.TODO
            };

            const res = await request(app)
                .put(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserA}`)
                .send(partialUpdate);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(TaskStatus.TODO); // Changed
            expect(res.body.title).toBe('Completely New Title'); // Should be preserved
            expect(res.body.description).toBe('New Description'); // Should be preserved
        });

        // Security: User B cannot update User A's task
        it('should NOT allow User B to update User A task', async () => {
            const res = await request(app)
                .put(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserB}`)
                .send({ title: 'Hacked Title' });

            expect(res.status).toBe(404); 
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        // Security: User B cannot delete User A's task
        it('should NOT allow User B to delete User A task', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserB}`);

            expect(res.status).toBe(404);
        });

        // Success: User A deletes their own task
        it('should allow User A to delete own task', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${taskID_A}`)
                .set('Authorization', `Bearer ${tokenUserA}`);

            expect(res.status).toBe(204);

            // Verify it's gone
            const check = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${tokenUserA}`);
            const deletedTask = check.body.find((t: any) => t.id === taskID_A);
            expect(deletedTask).toBeUndefined();
        });
    });
});