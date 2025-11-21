import request from 'supertest';
import app from '../app.js';

describe('Tasks API (Protected)', () => {
    let tokenA: string;
    let tokenB: string;
    let taskA_Id: number;

    beforeAll(async () => {
        await request(app).post('/api/auth/register').send({ email: "task-user-a@test.com", password: "123", name: "User A" });
        const resA = await request(app).post('/api/auth/login').send({ email: "task-user-a@test.com", password: "123" });
        tokenA = resA.body.accessToken;

        await request(app).post('/api/auth/register').send({ email: "task-user-b@test.com", password: "123", name: "User B" });
        const resB = await request(app).post('/api/auth/login').send({ email: "task-user-b@test.com", password: "123" });
        tokenB = resB.body.accessToken;
    });

    // POST /api/tasks (User A)
    it('should create task for User A', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: "Task A-1" });
        
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        taskA_Id = response.body.id;
    });

    // GET /api/tasks (User A)
    it('should get tasks ONLY for User A', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenA}`);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe("Task A-1");
    });

    // GET /api/tasks (User B - Isolation check)
    it('should get empty list for User B', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenB}`);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    // PUT /api/tasks/:id (User A)
    it('should update User A task', async () => {
        const response = await request(app)
            .put(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ isCompleted: true });
            
        expect(response.status).toBe(200);
        expect(response.body.isCompleted).toBe(true);
    });

    // DELETE /api/tasks/:id (User B - Security check)
    it('should NOT allow User B to delete User A task', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
            
        expect(response.status).toBe(404);
    });

    // DELETE /api/tasks/:id (User A)
    it('should delete User A task', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        expect(response.status).toBe(204);
    });

    // GET /api/tasks (No Token)
    it('should return 401 if no token provided', async () => {
        const response = await request(app).get('/api/tasks');
        expect(response.status).toBe(401);
    });
});