const express = require('express');
const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  postComment,
  patchArticle,
  getApi,
  deleteComment,
  fetchAllUsers
} = require('./controllers');

const app = express();
app.use(express.json());

app.get('/api', getApi);
app.get('/api/topics', fetchTopics);
app.get('/api/articles', fetchArticles);
app.get('/api/articles/:article_id', fetchArticle);
app.get('/api/articles/:article_id/comments', fetchComments);
app.get('/api/users', fetchAllUsers);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticle);

app.delete('/api/comments/:comment_id', deleteComment);


app.use((req, res) => {
  res.status(404).send({ message: 'Could not find Endpoint' });
});


app.use((err, req, res, next) => {
  console.log('Error:', err.message || 'An error occurred');

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
