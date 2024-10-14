const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require('../db/data/test-data');

beforeEach(() => {
  return seed(testData)

});

afterAll(() => {
  return db.end()

});

describe('GET - /api/topics', () => {
  it('responds with status 200 and an array of topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.topics)).toBe(true);
        expect(res.body.topics.length).toBeGreaterThan(0);
        expect(res.body.topics[0]).toHaveProperty('slug');
        expect(res.body.topics[0]).toHaveProperty('description')
      });
  });
});

describe('SORTING - /api/topics', () => {
  it('200 - responds with topics sorted by slug in ascending order as default', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeSortedBy('slug')
      });
  });

  it('200 - responds with topics sorted by description when passed a sort_by query', () => {
    return request(app)
      .get('/api/topics?sort_by=description')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeSortedBy('description')
      });
  });
});

describe('SORTING ERRORS - /api/topics', () => {
  it('400 - returns an error when given an invalid column as a sort_by', () => {
    return request(app)
      .get('/api/topics?sort_by=nonsense')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!')
      });
  });
  it('404 - responds with not found for invalid endpoint', () => {
    return request(app)
      .get('/api/non-existent-endpoint')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Could not find Endpoint")
      });
  });
});