import request from 'supertest';
import app from '../app.js';

describe('Tasks API /api/tasks', () => {
    let userIdA: number;
    let userIdB: number;
    let taskA_Id_1: number;
    let taskA_Id_2: number;
    
    beforeAll(async () => {
        const resA = await request(app)
            .post('/api/users')
            .send({ email: "userA@test.com", name: "User A" });
        userIdA = resA.body.id;

        const resB = await request(app)
            .post('/api/users')
            .send({ email: "userB@test.com", name: "User B" });
        userIdB = resB.body.id;
    });

    // POST /api/tasks (User A, Task 1)
    it('should create task 1 for User A', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ title: "Task A-1", userId: userIdA });
        
        expect(response.status).toBe(201);
        expect(response.body.id).toBe(1);
        taskA_Id_1 = response.body.id;
    });

    // POST /api/tasks (User A, Task 2)
    it('should create task 2 for User A', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ title: "Task A-2", userId: userIdA });
        
        expect(response.status).toBe(201);
        expect(response.body.id).toBe(2);
        taskA_Id_2 = response.body.id;
    });

    // POST /api/tasks (User B, Task 1)
    it('should create task 1 for User B', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ title: "Task B-1", userId: userIdB });
        
        expect(response.status).toBe(201);
        expect(response.body.id).toBe(1);
    });

    // POST /api/tasks (non-existent user)
    it('should return 404 when creating a task for a non-existent user', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ title: "Ghost task", userId: 9999 });
        
        expect(response.status).toBe(404);
        expect(response.body.message).toContain("User not found");
    });
    
    // GET /api/tasks?userId=A
    it('should get tasks ONLY for User A', async () => {
        const response = await request(app).get(`/api/tasks?userId=${userIdA}`);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe("Task A-1");
        expect(response.body[1].title).toBe("Task A-2");
    });

    // GET /api/tasks?userId=B
    it('should get tasks ONLY for User B', async () => {
        const response = await request(app).get(`/api/tasks?userId=${userIdB}`);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe("Task B-1");
    });

    // PUT /api/tasks/:id?userId=A
    it('should update a task for User A', async () => {
        const response = await request(app)
            .put(`/api/tasks/${taskA_Id_1}?userId=${userIdA}`)
            .send({ isCompleted: true });
            
        expect(response.status).toBe(200);
        expect(response.body.isCompleted).toBe(true);
    });

    // PUT /api/tasks/:id?userId=B (negative test)
    it('should return 404 when trying to update User A task as User B', async () => {
        const response = await request(app)
            .put(`/api/tasks/${taskA_Id_2}?userId=${userIdB}`)
            .send({ title: "Hacked!" });

        expect(response.status).toBe(404);
        expect(response.body.message).toContain("Task not found or user does not own this task");
    });

    // DELETE /api/tasks/:id?userId=B (negative test)
    it('should return 404 when trying to delete User A task as User B', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskA_Id_2}?userId=${userIdB}`);
            
        expect(response.status).toBe(404);
    });

    // DELETE /api/tasks/:id?userId=A
    it('should delete a task for User A', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskA_Id_1}?userId=${userIdA}`);

        expect(response.status).toBe(204);
    });
    
    // GET /api/tasks?userId=A (after delete)
    it('should return remaining tasks for User A after deletion', async () => {
        const response = await request(app).get(`/api/tasks?userId=${userIdA}`);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(taskA_Id_2);
    });
});