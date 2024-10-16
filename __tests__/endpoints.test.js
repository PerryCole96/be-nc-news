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
      .then(({body}) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBeGreaterThan(0);
        expect(body.topics[0]).toHaveProperty('slug');
        expect(body.topics[0]).toHaveProperty('description')
      });
  });
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


describe('ERRORS - /api/topics', () => {
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
        expect(body.message).toBe('Could not find Endpoint')
      });
  });
});

describe('GET /api/articles', () => {
  it('should return an array of all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        expect(body.articles[0]).toHaveProperty('author');
        expect(body.articles[0]).toHaveProperty('title');
        expect(body.articles[0]).toHaveProperty('article_id');
        expect(body.articles[0]).toHaveProperty('topic')
        expect(body.articles[0]).toHaveProperty('created_at')
        expect(body.articles[0]).toHaveProperty('votes');
        expect(body.articles[0]).toHaveProperty('article_img_url')
        expect(body.articles[0]).toHaveProperty('comment_count')
      });
  });
  it('200 - responds with articles sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const sortedArticles = body.articles.map(article => ({
          ...article,
          created_at: new Date(article.created_at)
        }));
        expect(sortedArticles).toBeSortedBy('created_at', { descending: true });
      });
  });
});

describe('ERRORS - /api/articles', () => {
  it('400 - returns an error when given an invalid column as a sort_by query for /api/articles', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_column')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!')
      });
  });
  it('200 - ensures articles do not contain a body property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach(article => {
          expect(article.body).toBeUndefined()
        });
      });
  });
})

describe('GET - /api/articles/:article_id', () => {
  it('200 - responds with an article object for a valid ID', () => {
    return request(app)
      .get('/api/articles/1') 
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('author')
        expect(body).toHaveProperty('title')
        expect(body).toHaveProperty('article_id', 1)
        expect(body).toHaveProperty('topic')
        expect(body).toHaveProperty('created_at')
        expect(body).toHaveProperty('votes')
        expect(body).toHaveProperty('article_img_url')
      });
  });
});


describe('ERRORS - /api/articles/:article_id', () => {
  it('404 - responds with an error message for a non-existent article ID', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Article not found');
      });
  });
it('400 - responds with an error message for an invalid article ID', () => {
    return request(app)
      .get('/api/articles/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!');
      });
  });
});


describe('/api', () => {
  it('responds with an object detailing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('endpoints')
        expect(body.endpoints).toHaveProperty('GET /api')
        expect(body.endpoints).toHaveProperty('GET /api/topics')
        expect(body.endpoints).toHaveProperty('GET /api/articles')
        expect(body.endpoints['GET /api']).toEqual({
          description: 'serves up a json representation of all the available endpoints of the api'
        });
      });
  });
});
