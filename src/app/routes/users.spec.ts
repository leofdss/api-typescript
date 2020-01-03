import request from 'supertest';

import app from '../app';

describe('POST /users/all', () => {
    it('status', () => {
        return request(app)
            .get('/users/all')
            .expect('Content-Type', /json/)
            .expect(200)
            .then();
    });

    it('resp', async () => {
        const response = await request(app)
            .get('/users/all').send();
        expect(response.body).toEqual([]);
    });
});
