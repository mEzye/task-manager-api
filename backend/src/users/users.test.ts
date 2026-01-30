import request from 'supertest';
import app from '../app.js';
import prisma from '../prisma.js';

describe('Users API Integration Tests', () => {
    let authToken: string;
    let createdUserId: number;
    
    const uniqueId = Date.now();
    const testUser = {
        email: `profile-${uniqueId}@example.com`,
        password: "securePassword123",
        name: "Current User"
    };

    // Setup: Cleanup and prepare authenticated session
    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();

        // Register and Login to retrieve token
        await request(app).post('/api/auth/register').send(testUser);
        const loginRes = await request(app).post('/api/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });

        authToken = loginRes.body.accessToken;
    });

    describe('GET /api/users/me', () => {
        it('should return the current user profile when authenticated', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.name).toBe(testUser.name);
            expect(response.body.password).toBeUndefined();
        });

        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/users/me');
            expect(response.status).toBe(401);
        });
    });

    describe('User CRUD Operations', () => {
        it('should create a new user via users endpoint', async () => {
            const newUser = {
                email: `crud-${uniqueId}@example.com`,
                password: "password123",
                name: "Another User"
            };
    
            const response = await request(app)
                .post('/api/users')
                .send(newUser);
    
            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
            
            createdUserId = response.body.id;
        });
    
        it('should get the user by id', async () => {
            const response = await request(app).get(`/api/users/${createdUserId}`);
    
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(createdUserId);
        });
        
        it('should return a list of users', async () => {
            const response = await request(app).get('/api/users');
    
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });
    
        it('should update the user', async () => {
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .send({ name: "Updated Name" });
    
            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Updated Name");
        });
    
        it('should delete the user', async () => {
            const response = await request(app).delete(`/api/users/${createdUserId}`);
            expect(response.status).toBe(204);
        });
    });
});