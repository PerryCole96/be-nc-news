const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json');


beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET - /api/topics', () => {
  it('responds with status 200 and an array of topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBeGreaterThan(0);
        expect(body.topics[0]).toHaveProperty('slug');
        expect(body.topics[0]).toHaveProperty('description');
      });
  });

  it('200 - responds with topics sorted by slug in ascending order as default', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeSortedBy('slug');
      });
  });

  it('200 - responds with topics sorted by description when passed a sort_by query', () => {
    return request(app)
      .get('/api/topics?sort_by=description')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeSortedBy('description');
      });
  });
});

describe('ERRORS - /api/topics', () => {
  it('400 - returns an error when given an invalid column as a sort_by', () => {
    return request(app)
      .get('/api/topics?sort_by=nonsense')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!');
      });
  });

  it('404 - responds with not found for invalid endpoint', () => {
    return request(app)
      .get('/api/non-existent-endpoint')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Could not find Endpoint');
      });
  });
});

describe('GET /api/articles', () => {
  it('should return an array of all articles with the correct properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        expect(body.articles[0]).toHaveProperty('author');
        expect(body.articles[0]).toHaveProperty('title');
        expect(body.articles[0]).toHaveProperty('article_id');
        expect(body.articles[0]).toHaveProperty('topic');
        expect(body.articles[0]).toHaveProperty('created_at');
        expect(body.articles[0]).toHaveProperty('votes');
        expect(body.articles[0]).toHaveProperty('article_img_url');
        expect(body.articles[0]).toHaveProperty('comment_count');
        expect(body.articles[0]).not.toHaveProperty('body');
      });
  });

  it('200 - responds with articles sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const sortedArticles = body.articles.map(article => ({
          ...article,
          created_at: new Date(article.created_at),
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
        expect(body.message).toBe('Bad Request!');
      });
  });

  it('200 - ensures articles do not contain a body property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach(article => {
          expect(article.body).toBeUndefined();
        });
      });
  });
});

describe('GET - /api/articles/:article_id', () => {
  it('200 - responds with an article object for a valid ID', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('author');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('article_id', 1);
        expect(body).toHaveProperty('topic');
        expect(body).toHaveProperty('created_at');
        expect(body).toHaveProperty('votes');
        expect(body).toHaveProperty('article_img_url');
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

describe('GET - /api/articles/:article_id/comments', () => {
  it('should return an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBeGreaterThan(0);
        body.comments.forEach(comment => {
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('body');
          expect(comment).toHaveProperty('article_id', 1);
        });
      });
  });

  it('should respond with 200 and an empty array for a valid article_id with no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });

  it('should return comments in descending order of created_at', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy('created_at', { descending: true });
      });
  });
});

describe('ERRORS - /api/articles/:article_id/comments', () => {
  it('should respond with 404 if the article_id does not exist', () => {
    return request(app)
      .get('/api/articles/9999/comments') 
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Article not found');
      });
  });

  it('should respond with 400 for an invalid article_id', () => {
    return request(app)
      .get('/api/articles/not-a-number/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!');
      });
  });
});

describe('POST - /api/articles/:article_id/comments', () => {
  it('201 - should add a comment for the given article_id', () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment."
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty('comment_id');
        expect(body.comment).toHaveProperty('author', newComment.username);
        expect(body.comment).toHaveProperty('body', newComment.body);
        expect(body.comment).toHaveProperty('article_id', 1);
        expect(body.comment).toHaveProperty('votes', 0);
        expect(body.comment).toHaveProperty('created_at');
      });
  });
});

describe('POST ERRORS - /api/articles/:article_id/comments', () => {
  it('400 - responds with an error when missing username or body', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: "butter_bridge" }) 
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request! Missing required fields.');
      });
  });

  it('404 - responds with an error if the article_id does not exist', () => {
    const newComment = {
      username: "butter_bridge",
      body: "This comment should not be added."
    };
    return request(app)
      .post('/api/articles/9999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Article not found');
      });
  });
});

describe('PATCH - /api/articles/:article_id', () => {
  it('200 - successfully increments the vote count of an article by the given value', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('article_id', 1);
        expect(body.article).toHaveProperty('votes');
        expect(body.article.votes).toBeGreaterThan(0);
      });
  });

  it('200 - decrements the vote count of an article by the given value', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -1001 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('article_id', 1);
        expect(body.article).toHaveProperty('votes');
        expect(body.article.votes).toBeLessThanOrEqual(0);
      });
  });
});

describe('ERRORS - PATCH /api/articles/:article_id', () => {
  it('400 - responds with an error for invalid article ID', () => {
    return request(app)
      .patch('/api/articles/not-a-number')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request!');
      });
  });

  it('400 - responds with an error for missing or invalid inc_votes in the request body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'not-a-number' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request! inc_votes must be a number.');
      });
  });

  it('404 - responds with an error if the article ID does not exist', () => {
    return request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Article not found');
      });
  });
});

describe('DELETE - /api/comments/:comment_id', () => {
    it('204 - successfully deletes the comment by ID', () => {
      return request(app)
        .delete('/api/comments/1') 
        .expect(204)
        .then(() => {
          return request(app)
            .get('/api/articles/1/comments') 
            .expect(200)
            .then(({ body }) => {
              const commentIds = body.comments.map(comment => comment.comment_id);
              expect(commentIds).not.toContain(1);
            });
        });
    });

  describe('ERRORS - invalid comment IDs', () => {
    it('404 - responds with an error if the comment_id does not exist', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe('Comment not found');
        });
    });

    it('400 - responds with an error for an invalid comment_id', () => {
      return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe('Bad Request!');
        });
    });
  });
});

describe('/api', () => {
  it('responds with an object detailing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('endpoints');
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});