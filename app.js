const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware')
const app = express();
const host = '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const apiPort = Number(port + 2000);
const api = 'http://' + host + ':' + apiPort;

app.use(express.static(path.join(__dirname, 'build')));
app.use('/v1', proxy({ target: api, changeOrigin: true }))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, host);
