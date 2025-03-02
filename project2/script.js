document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#taskList').innerHTML = '';
  document.querySelector('.open-task').addEventListener('click', openTask);
  document.querySelector('.close-task').addEventListener('click', closeTask);
  document.querySelector('#taskForm').addEventListener('submit', addTask);
  document
    .querySelector('#taskList')
    .addEventListener('click', manageTaskActions);
  document
    .querySelector('#showCompleted')
    .addEventListener('click', showCompleted);
  document
    .querySelector('#sortPriority')
    .addEventListener('click', sortPriority);
});

function openTask() {
  document.getElementById('taskModal').style.display = 'block';
}

function closeTask() {
  document.getElementById('taskModal').style.display = 'none';
}

function addTask(event) {
  event.preventDefault();

  try {
    let title = document.querySelector('#taskTitle').value.trim();
    let description = document.querySelector('#taskDescription').value.trim();
    let priority = document.querySelector(
      'input[name="priority"]:checked'
    )?.value;
    let error = document.querySelector('#error');

    if (!title) {
      openErrorPopup('Title is required!');
      return;
    }

    if (!priority) {
      openErrorPopup('Priority is required.Please choose a priority!');
      return;
    }

    error.textContent = '';

    let taskItem = document.createElement('div');
    taskItem.classList.add('task-item', priority.toLowerCase());
    taskItem.setAttribute('data-priority', priority.toLowerCase());
    taskItem.innerHTML = `
      <h3>Title: ${title}</h3>
      <p>Description:${description}</p>
      <p>Priority: <span class="priority-label">${priority}</span></p>
      <button class="delete-btn">Delete</button>
      <button class="mark-completed-btn">Completed</button>
    `;

    document.querySelector('#taskList').appendChild(taskItem);
    document.querySelector('#taskForm').reset();
    closeTask();
  } catch (error) {
    console.error('Error occurred!', error);
    openErrorPopup('An unexpected error occurred!');
  }
}

function showCompleted() {
  let tasks = document.querySelectorAll('.task-item');
  let showAll =
    document.querySelector('#showCompleted').dataset.showAll === 'true';
  tasks.forEach((task) => {
    if (!task.classList.contains('completed')) {
      task.style.display = showAll ? 'block' : 'none';
    }
  });
  document.querySelector('#showCompleted').dataset.showAll = !showAll;
}

function sortPriority() {
  const taskList = document.querySelector('#taskList');
  const tasks = Array.from(taskList.children);
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  tasks.sort((a, b) => {
    let priorityA = a.getAttribute('data-priority');
    let priorityB = b.getAttribute('data-priority');
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  });

  tasks.forEach((task) => taskList.appendChild(task));
}

function manageTaskActions(event) {
  event.stopPropagation();
  if (event.target.classList.contains('delete-btn')) {
    let taskItem = event.target.closest('.task-item');
    taskItem.remove();
  } else if (event.target.classList.contains('mark-completed-btn')) {
    let taskItem = event.target.closest('.task-item');
    taskItem.classList.toggle('completed');
  }
}

function markAsComplete(button) {
  const taskItem = button.closest('.task-item');
  taskItem.classList.add('completed');
  taskItem.style.backgroundColor = 'green';
}

function deleteTask(button) {
  const taskItem = button.closest('.task-item');
  taskItem.remove();
}

function openErrorPopup(message) {
  console.log('Opening error popup with message:', message);

  document.querySelector('#errorMessage').textContent = message;
  document.querySelector('#errorPopup').style.display = 'flex';
}

function closeErrorPopup() {
  console.log('Closing error popup');

  document.querySelector('#errorPopup').style.display = 'none';
}
