// Dodaj to do obsługi wysyłania (form.addEventListener)
async function sendMessage() {
    const fileInput = document.getElementById('file-input');
    const msg = input.value;
    const user = usernameInput.value || 'Anonim';

    // Jeśli jest plik, najpierw go wyślij na serwer
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        const res = await fetch('/upload', { method: 'POST', body: formData });
        const data = await res.json();
        
        socket.emit('chat message', { channel: currentChannel, msg: data.url, user, type: 'image' });
        fileInput.value = '';
    } else if (msg) {
        socket.emit('chat message', { channel: currentChannel, msg, user, type: 'text' });
    }
    input.value = '';
}

// Zaktualizuj funkcję wyświetlania wiadomości
function appendMessage(data) {
    const item = document.createElement('div');
    item.className = 'message-item';
    
    let content = data.type === 'image' 
        ? `<img src="${data.text}" style="max-width: 300px; border-radius: 8px; display: block; margin-top: 5px;">` 
        : `<span class="message-text">${data.text}</span>`;

    item.innerHTML = `<span class="message-user">${data.user}:</span> ${content}`;
    messagesDiv.appendChild(item);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
