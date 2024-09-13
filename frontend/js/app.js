document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const editForm = document.getElementById('edit-form');
    const taskList = document.getElementById('task-list');
  
    function fetchTasks() {
      fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
          taskList.innerHTML = '';
          tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
              <div>
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small><br>
                <small>Category: ${task.category}</small>
              </div>
              <div>
                <button class="btn btn-warning btn-sm me-2" onclick="editTask('${task._id}', '${task.title}', '${task.description}', '${task.dueDate}', '${task.category}')">Edit</button>
                <button class="btn btn-danger btn-sm me-2" onclick="deleteTask('${task._id}')">Delete</button>
                <button class="btn btn-info btn-sm" onclick="toggleCompletion('${task._id}', ${task.completed})">${task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
              </div>
            `;
            taskList.appendChild(li);
          });
        });
    }
  
    form.addEventListener('submit', event => {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const dueDate = document.getElementById('dueDate').value;
      const category = document.getElementById('category').value;
  
      fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, category })
      })
      .then(response => response.json())
      .then(() => {
        form.reset();
        fetchTasks();
      });
    });
  
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      const id = document.getElementById('edit-id').value;
      const title = document.getElementById('edit-title').value;
      const description = document.getElementById('edit-description').value;
      const dueDate = document.getElementById('edit-dueDate').value;
      const category = document.getElementById('edit-category').value;
  
      fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, category })
      })
      .then(response => response.json())
      .then(() => {
        editForm.style.display = 'none';
        document.getElementById('task-form-container').style.display = 'block';
        fetchTasks();
      });
    });
  
    document.getElementById('cancel-edit').addEventListener('click', () => {
      editForm.style.display = 'none';
      document.getElementById('task-form-container').style.display = 'block';
    });
  
    window.editTask = function(id, title, description, dueDate, category) {
      document.getElementById('edit-id').value = id;
      document.getElementById('edit-title').value = title;
      document.getElementById('edit-description').value = description;
      document.getElementById('edit-dueDate').value = new Date(dueDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      document.getElementById('edit-category').value = category;
  
      editForm.style.display = 'block';
      document.getElementById('task-form-container').style.display = 'none';
    };
  
    window.deleteTask = function(id) {
      fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
        .then(() => fetchTasks());
    };
  
    window.toggleCompletion = function(id, currentStatus) {
      fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      })
      .then(() => fetchTasks());
    };
  
    fetchTasks();
  });
  