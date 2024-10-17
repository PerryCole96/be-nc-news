const express = require('express');
const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  postComment,
  patchArticle,
  getApi,
} = require('./controllers');

const app = express();
app.use(express.json());

app.get('/api', getApi);
app.get('/api/topics', fetchTopics);
app.get('/api/articles', fetchArticles);
app.get('/api/articles/:article_id', fetchArticle);
app.get('/api/articles/:article_id/comments', fetchComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticle);


app.use((req, res) => {
  res.status(404).send({ message: 'Could not find Endpoint' });
});


app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send({ msg: message });
});

module.exports = app;