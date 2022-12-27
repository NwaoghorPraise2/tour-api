const request = require('supertest');
const app = require('../../app');

// jest.setTimeout(5000000);

// eslint-disable-next-line no-undef
describe('testing for tours get end point', () => {
  test('testing response from /get all tours', async () => {
    const res = await request(app).get('/api/v1/tours/top-5-cheap');
    console.log(res);
    expect(res.statusCode).toBe(200);
  });
});
