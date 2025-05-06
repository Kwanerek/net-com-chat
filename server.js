const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'main')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Użytkownik połączony');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('delete message', (id) => {
    io.emit('delete message', id);
  });

  socket.on('disconnect', () => {
    console.log('Użytkownik rozłączony');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
