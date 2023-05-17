const socket = io();

let userName = '';
const loginForm = document.querySelector("#welcome-form");
const messagesSection = document.querySelector("#messages-section");
const messagesList = document.querySelector("#messages-list");
const addMessageForm = document.querySelector("#add-messages-form");
const userNameInput = document.querySelector("#username");
const messageContentInput = document.querySelector("#message-content");

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', function login(e) {
  e.preventDefault();

  if (userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', { author: userName });
  } else {
    alert('your login seems incorrect');
  }
});

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

addMessageForm.addEventListener('submit', function sendMessage(e) {
  e.preventDefault();
  if (messageContentInput.value.length > 0) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value })
    messageContentInput.value = '';
  } else {
    alert('seems that your message is incorrect');
  }
});

