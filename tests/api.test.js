
const request = require('supertest');
const app = require('../app');
const { initDb, closeDb } = require('../db/connect');

describe('SchoolFlow GET endpoints', () => {
    const collections = [
        { path: '/students' },
        { path: '/teachers' },
        { path: '/classes' },
        { path: '/grades' }
    ];

    beforeAll(async () => {
        await initDb();
    });

    afterAll(async () => {
        await closeDb();
    });

    test.each(collections)(
        'GET $path returns 200',
        async ({ path }) => {
            const response = await request(app).get(path);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }
    );

    test.each(collections)(
        'GET $path/:id returns 400 for an invalid ID',
        async ({ path }) => {
            const response = await request(app).get(`${path}/invalid-id`);

            expect(response.status).toBe(400);
        }
    );
});
