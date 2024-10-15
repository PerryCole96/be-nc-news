const { getTopics } = require('./db/models');
const fs = require('fs');
const path = require('path');
const endpoints = require('./endpoints.json');

exports.fetchTopics = (req, res, next) => {
  const { sort_by } = req.query;
  const validSortbys = ['slug', 'description']

  if (sort_by && !validSortbys.includes(sort_by)) {
    return res.status(400).send({ message: 'Bad Request!' })
  }
  const sortColumn = sort_by || 'slug'
  getTopics(sortColumn) 
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
};


exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};
