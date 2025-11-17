import request from 'supertest';
import app from '../app.js'; 

describe('Users API /api/users', () => {
    let createdUserId: number;

    // GET /api/users (initial)
    it('should return an empty array initially', async () => {
        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    // POST /api/users
    it('should create a new user', async () => {
        const newUser = {
            email: "test.user@example.com",
            name: "Test User"
        };

        const response = await request(app)
            .post('/api/users')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBe(newUser.email);

        createdUserId = response.body.id;
    });

    // GET /api/users/:id
    it('should get the newly created user by id', async () => {
        const response = await request(app).get(`/api/users/${createdUserId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.name).toBe("Test User");
    });
    
    // GET /api/users (after create)
    it('should return all users (1 user)', async () => {
        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(createdUserId);
    });

    // PUT /api/users/:id
    it('should update the user', async () => {
        const updates = {
            name: "Updated Test User"
        };
        
        const response = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Test User");
        expect(response.body.email).toBe("test.user@example.com");
    });

    // DELETE /api/users/:id
    it('should delete the user', async () => {
        const response = await request(app).delete(`/api/users/${createdUserId}`);

        expect(response.status).toBe(204);
    });

    // GET /api/users/:id (after delete)
    it('should return 404 for the deleted user', async () => {
        const response = await request(app).get(`/api/users/${createdUserId}`);
        
        expect(response.status).toBe(404);
    });

    // GET /api/users (after delete)
    it('should return an empty array after deletion', async () => {
        const response = await request(app).get('/api/users');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});