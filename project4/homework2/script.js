$(function () {
  const appendLocation = '.ins-api-users';

  function applyStyles() {
    $(appendLocation).css({
      padding: '10px',
      'border-bottom': '1px solid #ddd',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
    });

    $('.delete-btn').css({
      'background-color': '#f44336',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      cursor: 'pointer',
      'border-radius': '5px',
    });

    $('.fetch-btn').css({
      padding: '10px 20px',
      'background-color': '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      'border-radius': '5px',
      'margin-top': '20px',
    });
  }
  applyStyles();

  async function fetchUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  }

  function getUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length) return Promise.resolve(users);
    return fetchUsers().then((fetchedUsers) => {
      localStorage.setItem('users', JSON.stringify(fetchedUsers));
      return fetchedUsers;
    });
  }

  function displayUsers(users) {
    $(appendLocation).empty();
    users.forEach((user) => {
      $(appendLocation).append(createUserElement(user));
    });
    checkIfUsersEmpty();
  }

  function createUserElement(user) {
    return `
      <div class="user-item">
        <strong>${user.name}</strong><br>
        <span>Email: ${user.email}</span><br>
        <span>Address: ${user.address.street}, ${user.address.city}, ${user.address.zipcode}</span>
        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
      </div>
    `;
  }

  function checkIfUsersEmpty() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0 && !sessionStorage.getItem('fetchRequested')) {
      $('<button class="fetch-btn">Fetch Users</button>')
        .appendTo('body')
        .on('click', fetchUsersButton);
    }
  }

  function fetchUsersButton() {
    sessionStorage.setItem('fetchRequested', 'true');
    getUsers().then(displayUsers);
    $(this).remove();
  }

  function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter((user) => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(users);
  }

  getUsers()
    .then(displayUsers)
    .catch((error) => {
      console.error('Error occurred:', error.message);
      alert('An error occurred. Please try again later!');
    });

  const observer = new MutationObserver(() => {
    if ($(appendLocation).children().length === 0) {
      checkIfUsersEmpty();
    }
  });

  observer.observe(document.querySelector(appendLocation), { childList: true });
});
