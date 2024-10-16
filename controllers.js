const { getTopics, getArticleById, getArticles } = require('./db/models');
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

exports.fetchArticle = (req, res, next) => {
  const { article_id } = req.params;

  
  if (isNaN(article_id)) {
      return res.status(400).send({ message: 'Bad Request!' });
  }

  getArticleById(article_id)
      .then(article => {
          if (!article) {
              return res.status(404).send({ message: 'Article not found' });
          }
          res.status(200).send(article);
      })
      .catch(err => {
          console.error(err);
          next(err);
      });
};

exports.fetchArticles = (req, res, next) => {
  const { sort_by } = req.query;

  
  const validSortColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];

  
  if (sort_by && !validSortColumns.includes(sort_by)) {
    return res.status(400).send({ message: 'Bad Request!' })
  }

  
  const sortColumn = sort_by || 'created_at'
  
  getArticles(sortColumn)
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
  }

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints })
}

