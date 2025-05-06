const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let messages = [];

app.use(express.static(path.join(__dirname, 'public'))); // zakładamy, że index.html i style.css są w folderze 'public'

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
  console.log('Użytkownik połączony');

  socket.on('chat message', (msg) => {
    messages.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('delete message', (id) => {
    messages = messages.filter(msg => msg.id !== id);
    io.emit('delete message', id);
  });

  socket.on('disconnect', () => {
    console.log('Użytkownik rozłączony');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
