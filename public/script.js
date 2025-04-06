const socket = io();
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const typingStatus = document.getElementById('typing-status');
const userList = document.getElementById('user-list');

let nickname = prompt("Enter your nickname");
socket.emit('set nickname', nickname);

let typingTimeout;

input.addEventListener('input', () => {
    socket.emit('typing');
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit('stop typing'), 1000);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        const item = document.createElement('li');
        item.textContent = `You: ${input.value}`;
        item.classList.add('own-message');
        messages.appendChild(item);
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', ({user, msg}) => {
    const item = document.createElement('li');
    item.textContent = `${user}: ${msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('typing', user => typingStatus.textContent = `${user} is typing...`);
socket.on('stop typing', () => typingStatus.textContent = '');

socket.on('user list', users => {
    userList.innerHTML = `Online (${users.length}): ${users.join(', ')}`;
});
