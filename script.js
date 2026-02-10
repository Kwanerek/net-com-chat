const socket = io();
let currentChannel = 'general';

const channelList = document.querySelectorAll('.channel');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const usernameInput = document.getElementById('username');

// Dołącz do kanału startowego
socket.emit('join channel', currentChannel);

// Obsługa zmiany kanału
channelList.forEach(ch => {
    ch.addEventListener('click', () => {
        const newChannel = ch.getAttribute('data-name');
        if (newChannel === currentChannel) return;

        messagesDiv.innerHTML = ''; // Czyścimy ekran
        currentChannel = newChannel;
        
        // Aktualizacja UI
        document.querySelector('.channel.active').classList.remove('active');
        ch.classList.add('active');
        document.getElementById('current-channel-name').innerText = `# ${newChannel}`;
        
        socket.emit('join channel', currentChannel);
    });
});

// Wysłanie wiadomości
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value;
    const user = usernameInput.value || 'Anonim';
    
    if (msg) {
        socket.emit('chat message', { channel: currentChannel, msg, user });
        input.value = '';
    }
});

// Odbieranie wiadomości
socket.on('chat message', (data) => {
    appendMessage(data);
});

// Ładowanie historii
socket.on('load history', (history) => {
    history.forEach(appendMessage);
});

function appendMessage(data) {
    const item = document.createElement('div');
    item.className = 'message-item';
    item.innerHTML = `
        <span class="message-user">${data.user}:</span>
        <span class="message-text">${data.text}</span>
    `;
    messagesDiv.appendChild(item);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}
