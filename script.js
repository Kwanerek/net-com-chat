const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const themeSwitch = document.getElementById('themeSwitch');

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
  document.body.classList.toggle('light', !themeSwitch.checked);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && usernameInput.value) {
    const message = { id: Date.now(), name: usernameInput.value, text: input.value };
    socket.emit('chat message', message);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg.name + ': ' + msg.text;
  item.dataset.id = msg.id;
  item.addEventListener('click', () => {
    socket.emit('delete message', msg.id);
  });
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('delete message', (id) => {
  const msg = document.querySelector(`li[data-id="${id}"]`);
  if (msg) msg.remove();
});