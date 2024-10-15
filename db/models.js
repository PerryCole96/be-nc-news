const db = require('../db/connection');

exports.getTopics = (sortColumn) => {

  const queryStr = `SELECT * FROM topics ORDER BY ${sortColumn} ASC`;
  return db.query(queryStr)
    .then(({ rows }) => {
      return rows
    })
  };