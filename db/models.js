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