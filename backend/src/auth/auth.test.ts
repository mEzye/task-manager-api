import request from "supertest";
import app from "../app.js";
import prisma from "../prisma.js";

describe('Auth API', () => {
    // Generate unique email to avoid conflicts
    const uniqueId = Date.now();
    const testUser = {
        email: `auth-${uniqueId}@example.com`,
        password: "password123",
        name: "Auth Tester"
    };

    let refreshToken: string;

    // Cleanup: Clear users table before running auth tests
    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        
        expect(response.status).toBe(201);
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.password).toBeUndefined();
    });

    it('should not register user with existing email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("exists");
    });

    it('should login user and return tokens', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();

        refreshToken = response.body.refreshToken;
    });

    it('should fail login with wrong password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
    });

    it('should refresh tokens', async () => {
        const response = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: refreshToken });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        expect(response.body.refreshToken).not.toBe(refreshToken);
    });
});