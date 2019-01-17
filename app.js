const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware')
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use('/v1', proxy({ target: 'http://127.0.0.1:5000', changeOrigin: true }))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);
