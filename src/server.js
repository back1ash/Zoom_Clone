import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function closefn() {
  return console.log('Disconnected from the Browser');
}

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['nickname'] = 'Anon';
  console.log('Connect to Browser');
  socket.on('close', closefn);
  socket.on('message', (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payLoad}`)
        );
      case 'nickname':
        socket['nickname'] = message.payLoad;
    }
  });
});

server.listen(3000, handleListen);
