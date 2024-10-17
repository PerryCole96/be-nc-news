const {
  getTopics,
  getArticleById,
  getArticles,
  checkIfArticleExists,
  getCommentsByArticleId,
  addComment,
  updateVotes,
  removeCommentById
} = require('./db/models');
const fs = require('fs');
const path = require('path');
const endpoints = require('./endpoints.json');

exports.fetchTopics = (req, res, next) => {
  const { sort_by } = req.query;
  const validSortbys = ['slug', 'description'];

  if (sort_by && !validSortbys.includes(sort_by)) {
    return res.status(400).send({ message: 'Bad Request!' }); 
  }

  const sortColumn = sort_by || 'slug';
  getTopics(sortColumn)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.fetchArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ message: 'Bad Request!' }); 
  }

  getArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: 'Article not found' });
      }
      res.status(200).send({ ...article });  
    })
    .catch(next);
};

exports.fetchArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const validSortColumns = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'article_img_url',
    'comment_count',
  ];

  if (sort_by && !validSortColumns.includes(sort_by)) {
    return res.status(400).send({ message: 'Bad Request!' });
  }

  const sortColumn = sort_by || 'created_at';

  getArticles(sortColumn)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.fetchComments = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ message: 'Bad Request!' });
  }

  getArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: 'Article not found' });
      }
      return getCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};


exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ message: 'Bad Request! Missing required fields.' });
  }
  if (isNaN(article_id)) {
    return res.status(400).send({ message: 'Bad Request!' });
  }

  checkIfArticleExists(article_id)
    .then(() => {
      return addComment(username, body, article_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) {
    return res.status(400).send({ message: 'Bad Request!' });
  }
  if (typeof inc_votes !== 'number') {
    return res.status(400).send({ message: 'Bad Request! inc_votes must be a number.' });
  }

  checkIfArticleExists(article_id)
    .then(() => {
      return updateVotes(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  if (isNaN(comment_id)) {
    return res.status(400).send({ message: 'Bad Request!' });
  }

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

