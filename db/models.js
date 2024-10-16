const db = require('../db/connection');

exports.getTopics = (sortColumn) => {

  const queryStr = `SELECT * FROM topics ORDER BY ${sortColumn} ASC`;
  return db.query(queryStr)
    .then(({ rows }) => {
      return rows
    })
  };

  exports.getArticleById = (articleId) => {
    const queryStr = 'SELECT * FROM articles WHERE article_id = $1';
    return db.query(queryStr, [articleId])
      .then(({ rows }) => {
        return rows[0]; 
      });
  };

  exports.getArticles = () => {
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
      ORDER BY articles.created_at DESC;
    `;
  
    return db.query(queryStr)
      .then(({ rows }) => {
        return rows; 
      });
  };