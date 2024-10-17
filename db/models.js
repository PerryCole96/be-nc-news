const db = require('../db/connection');

exports.getTopics = (sortColumn) => {
  const queryStr = `SELECT * FROM topics ORDER BY ${sortColumn} ASC`
  return db.query(queryStr)
    .then(({ rows }) => rows)
};

exports.getArticleById = (articleId) => {
  const queryStr = 'SELECT * FROM articles WHERE article_id = $1'
  return db.query(queryStr, [articleId])
    .then(({ rows }) => rows[0])
};

exports.getArticles = (sortColumn) => {
  const queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sortColumn} DESC;
  `;

  return db.query(queryStr)
    .then(({ rows }) => rows)
};

exports.getCommentsByArticleId = (articleId) => {
  const queryStr = `
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC;
  `;
  
  return db.query(queryStr, [articleId])
    .then(({ rows }) => rows)
};

exports.addComment = (username, body, articleId) => {
  const queryStr = `
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  return db.query(queryStr, [body, username, articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      throw { status: 404, message: 'Article not found' };
    }
    return rows[0];
  });
};
exports.updateVotes = (articleId, incVotes) => {
  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  return db.query(queryStr, [incVotes, articleId])
    .then(({ rows }) => rows[0]);
};
exports.checkIfArticleExists = (articleId) => {
  const queryStr = 'SELECT * FROM articles WHERE article_id = $1';
  return db.query(queryStr, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        const err = new Error('Article not found');
        err.status = 404;
        throw err;
      }
    });
};

exports.removeCommentById = (commentId) => {
  const queryStr = 'DELETE FROM comments WHERE comment_id = $1';
  return db.query(queryStr, [commentId]).then(({ rowCount }) => {
    if (rowCount === 0) {
      const err = new Error('Comment not found');
      err.status = 404;
      throw err;
    }
  });
};