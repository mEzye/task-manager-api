import request from 'supertest';
import app from '../app.js';

describe('Users API Integration Tests', () => {
    let authToken: string;
    let createdUserId: number;
    
    const testUser = {
        email: "current.user@example.com",
        password: "securePassword123",
        name: "Current User"
    };

    // Setup: Register and Login to get a token before running user tests
    beforeAll(async () => {
        // Register a user via Auth API to ensure we have a valid user in the system
        await request(app).post('/api/auth/register').send(testUser);

        // Login to retrieve the access token
        const loginRes = await request(app).post('/api/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });

        authToken = loginRes.body.accessToken;
    });

    describe('GET /api/users/me', () => {
        // Positive Test: Should return profile with valid token
        it('should return the current user profile when authenticated', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.name).toBe(testUser.name);
            
            // Security Check: Password should NEVER be returned
            expect(response.body.password).toBeUndefined();
        });

        // Negative Test: Should fail without token
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/users/me');
            expect(response.status).toBe(401);
        });

        // Negative Test: Should fail with invalid token
        it('should return 401 if token is invalid', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', 'Bearer invalid_token_string');
            
            expect(response.status).toBe(401);
        });
    });

    describe('User CRUD Operations', () => {
        // POST /api/users (Admin-like creation or direct creation)
        it('should create a new user via users endpoint', async () => {
            const newUser = {
                email: "another.user@example.com",
                password: "password123",
                name: "Another User"
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
        it('should get the user by id', async () => {
            const response = await request(app).get(`/api/users/${createdUserId}`);
    
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(createdUserId);
            expect(response.body.name).toBe("Another User");
        });
        
        // GET /api/users
        it('should return a list of users including the new one', async () => {
            const response = await request(app).get('/api/users');
    
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // We expect at least 2 users now (the one from beforeAll and the one from CRUD)
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });
    
        // PUT /api/users/:id
        it('should update the user name and email', async () => {
            const updates = {
                name: "Updated Name",
                email: "updated.email@example.com"
            };
            
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .send(updates);
    
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updates.name);
            expect(response.body.email).toBe(updates.email);
        });
    
        // DELETE /api/users/:id
        it('should delete the user', async () => {
            const response = await request(app).delete(`/api/users/${createdUserId}`);
    
            expect(response.status).toBe(204);
        });
    
        // GET /api/users/:id (Verify deletion)
        it('should return 404 for the deleted user', async () => {
            const response = await request(app).get(`/api/users/${createdUserId}`);
            
            expect(response.status).toBe(404);
        });
    });
});