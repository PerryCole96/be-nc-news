const express = require('express');
const { fetchTopics, fetchArticle, fetchArticles, fetchComments, postComment, patchArticle } = require('./controllers')
const app = express();
const { getApi } = require('./controllers'); 

app.use(express.json());

app.get('/api', getApi)
app.get('/api/topics', fetchTopics);
app.get('/api/articles', fetchArticles);
app.get('/api/articles/:article_id', fetchArticle);
app.get('/api/articles/:article_id/comments', fetchComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticle);

app.use((req, res) => {
  res.status(404).send({ message: 'Could not find Endpoint' })
});
app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500).send({ msg: err.message || 'Internal Server Error' })
});

module.exports = app;