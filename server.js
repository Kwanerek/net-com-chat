const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // <- definiujemy io tutaj

// Serwowanie plików statycznych
app.use(express.static(path.join(__dirname, 'public')));

// Domyślna strona
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obsługa połączenia z socket.io
io.on('connection', (socket) => {
  console.log('Użytkownik podłączony');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('delete message', (id) => {
    io.emit('delete message', id);
  });

  socket.on('disconnect', () => {
    console.log('Użytkownik odłączony');
  });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
