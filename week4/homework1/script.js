const style = document.createElement('style');
style.innerHTML = `
 body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f4f4f9;
  }
  .user-list {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #fff;
  }
  .user-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-item:last-child {
    border-bottom: none;
  }
  .user-item strong {
    font-size: 1.2em;
  }
  .delete-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  .delete-btn:hover {
    background-color: #d32f2f;
  }
`;
document.head.appendChild(style);

async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function getUsers() {
  const storedData = localStorage.getItem('users');
  const storedTime = localStorage.getItem('usersTime');
  const currentTime = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (storedData && storedTime && currentTime - storedTime < oneDay) {
    console.log('Data fetched from localStorage');
    return JSON.parse(storedData);
  }

  console.log('Data fetched from API');
  const users = await fetchUsers();
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('usersTime', currentTime);
  return users;
}

function displayUsers(users) {
  const container = document.querySelector('.ins-api-users');
  container.innerHTML = '';

  users.forEach((user) => {
    const userElement = createUserElement(user);
    container.appendChild(userElement);
  });
}

function createUserElement(user) {
  const userInfo = document.createElement('div');
  userInfo.classList.add('user-item');
  userInfo.innerHTML = `
    <strong>${user.name}</strong><br>
    <span>Email: ${user.email}</span><br>
    <span>Address: ${user.address.street}, ${user.address.city}, ${user.address.zipcode}</span>
    <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
  `;
  return userInfo;
}

async function deleteUser(userId) {
  const storedData = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = storedData.filter((user) => user.id !== userId);

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  displayUsers(updatedUsers);
}

getUsers()
  .then(displayUsers)
  .catch((error) => {
    console.error('Error occurred:', error.message);
    alert('An error occurred. Please try again later!');
  });
