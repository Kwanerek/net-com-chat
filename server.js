require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Datastore = require('nedb');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// KONFIGURACJA CLOUDINARY (Zdjęcia)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'discord_clone', allowed_formats: ['jpg', 'png', 'gif'] },
});
const upload = multer({ storage: storage });

const db = new Datastore({ filename: 'messages.db', autoload: true });
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint do wysyłania zdjęć
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ url: req.file.path });
});

io.on('connection', (socket) => {
    socket.on('join channel', (channel) => {
        socket.join(channel);
        db.find({ channel }).sort({ timestamp: 1 }).exec((err, docs) => {
            socket.emit('load history', docs);
        });
    });

    socket.on('chat message', (data) => {
        const msgObject = {
            user: data.user,
            text: data.msg,
            type: data.type || 'text', // 'text' lub 'image'
            channel: data.channel,
            timestamp: Date.now()
        };
        db.insert(msgObject, (err, newDoc) => {
            io.to(data.channel).emit('chat message', newDoc);
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Działa na porcie ${PORT}`));
