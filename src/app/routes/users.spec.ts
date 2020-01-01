import request from 'supertest';
import app from '../app';
describe('POST /users', () => {
    it('responds with json', () => {
        return request(app)
            .get('/users/all')
            .expect('Content-Type', /json/)
            .expect(200)
            .then();
    });
});
