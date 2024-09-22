const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Routes', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('token');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            await User.create({
                username: 'testuser',
                password: 'testpassword'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with incorrect credentials', async () => {
            await User.create({
                username: 'testuser',
                password: 'testpassword'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });
});