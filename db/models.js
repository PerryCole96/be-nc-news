// models.js
const db = require('../db/connection');

exports.getTopics = (sortColumn) => {
  const validSortColumns = ['slug', 'description']

  if (!validSortColumns.includes(sortColumn)) {
    return Promise.reject({ status: 400, message: 'Invalid sort column' })
  }

  const queryStr = `SELECT * FROM topics ORDER BY ${sortColumn} ASC`;
  return db.query(queryStr)
    .then(({ rows }) => {
      return rows
    })
  };