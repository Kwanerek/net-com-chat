const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serwuj pliki statyczne (HTML, CSS, JS) z bieżącego folderu
app.use(express.static(__dirname));

// Główna strona (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Obsługa Socket.IO
io.on('connection', (socket) => {
  console.log('Użytkownik połączony');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Użytkownik się rozłączył');
  });
});

// Port Rendera lub domyślnie 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
