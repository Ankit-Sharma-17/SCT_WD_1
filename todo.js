const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoDate = document.getElementById('todoDate');
const todoTime = document.getElementById('todoTime');
const todoPriority = document.getElementById('todoPriority');
const todoList = document.getElementById('todoList');
const categorySelect = document.getElementById('categorySelect');
const newCategoryInput = document.getElementById('newCategoryInput');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const filterBtns = document.querySelectorAll('.todo-btn.filter');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');

let todos = [];
let categories = ['General'];
let currentCategory = 'General';
let currentFilter = 'all';
let searchTerm = '';
let darkMode = false;
let dragSrcEl = null;

function loadTodos() {
  const saved = localStorage.getItem('internship-todos');
  if (saved) todos = JSON.parse(saved);
  const catSaved = localStorage.getItem('internship-todo-categories');
  if (catSaved) categories = JSON.parse(catSaved);
  const catSel = localStorage.getItem('internship-todo-current-category');
  if (catSel && categories.includes(catSel)) currentCategory = catSel;
  const filterSaved = localStorage.getItem('internship-todo-filter');
  if (filterSaved) currentFilter = filterSaved;
  renderCategories();
  renderTodos();
  highlightActiveFilter();
}
function saveTodos() {
  localStorage.setItem('internship-todos', JSON.stringify(todos));
}
function saveCategories() {
  localStorage.setItem('internship-todo-categories', JSON.stringify(categories));
  localStorage.setItem('internship-todo-current-category', currentCategory);
}
function saveFilter() {
  localStorage.setItem('internship-todo-filter', currentFilter);
  highlightActiveFilter();
}

addCategoryBtn.addEventListener('click', () => {
  const val = newCategoryInput.value.trim();
  if (val && !categories.includes(val)) {
    categories.push(val);
    currentCategory = val;
    newCategoryInput.value = '';
    saveCategories();
    renderCategories();
    renderTodos();
  }
});
categorySelect.addEventListener('change', e => {
  currentCategory = e.target.value;
  saveCategories();
  renderTodos();
});
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('add', 'selected-filter'));
    btn.classList.add('add', 'selected-filter');
    saveFilter();
    renderTodos();
  });
});

function highlightActiveFilter() {
  filterBtns.forEach(btn => {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add('selected-filter');
    } else {
      btn.classList.remove('selected-filter');
    }
  });
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  const date = todoDate.value;
  const time = todoTime.value;
  const priority = todoPriority.value;
  todos.push({
    id: Date.now(),
    text,
    completed: false,
    date,
    time,
    priority,
    category: currentCategory
  });
  todoInput.value = '';
  todoDate.value = '';
  todoTime.value = '';
  todoPriority.value = 'Medium';
  saveTodos();
  renderTodos(true);
});

function renderCategories() {
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === currentCategory) opt.selected = true;
    categorySelect.appendChild(opt);
  });
}

function renderTodos(animateAdd = false) {
  todoList.innerHTML = '';
  let filtered = todos.filter(t => t.category === currentCategory);
  if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);
  if (currentFilter === 'pending') filtered = filtered.filter(t => !t.completed);
  if (searchTerm) filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm));
  if (filtered.length === 0) {
    todoList.innerHTML = '<li class="text-center text-gray-400 py-4">No tasks yet. Add one above!</li>';
    return;
  }
  filtered.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item flex-wrap' + (todo.completed ? ' completed' : '');
    li.style.transition = 'all 0.3s cubic-bezier(.4,0,.2,1)';
    li.setAttribute('draggable', true);
    li.dataset.id = todo.id;
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);
    if (animateAdd && idx === filtered.length - 1) {
      li.style.opacity = 0;
      setTimeout(() => { li.style.opacity = 1; }, 30);
    }
    // Task text or edit input
    if (todo.editing) {
      li.innerHTML = `
        <span class='drag-handle' title='Drag to reorder' aria-label='Drag to reorder' style='cursor:grab;user-select:none;'><i class='fas fa-grip-lines'></i></span>
        <input class=\"todo-edit-input\" type=\"text\" value=\"${todo.text}\" aria-label=\"Edit task description\" />
        <button class=\"todo-btn edit flex items-center\" title=\"Save changes\" aria-label=\"Save changes\"><i class=\"fas fa-check mr-1\"></i><span>Save</span></button>
        <button class=\"todo-btn cancel flex items-center\" title=\"Cancel editing\" aria-label=\"Cancel editing\"><i class=\"fas fa-times mr-1\"></i><span>Cancel</span></button>
      `;
      const editInput = li.querySelector('input');
      editInput.focus();
      li.querySelector('.edit').onclick = () => {
        const newText = editInput.value.trim();
        if (newText) {
          todo.text = newText;
          delete todo.editing;
          saveTodos();
          renderTodos();
        }
      };
      li.querySelector('.cancel').onclick = () => {
        delete todo.editing;
        renderTodos();
      };
      editInput.onkeydown = e => {
        if (e.key === 'Enter') li.querySelector('.edit').click();
        if (e.key === 'Escape') li.querySelector('.cancel').click();
      };
    } else {
      li.innerHTML = `
        <span class='drag-handle' title='Drag to reorder' aria-label='Drag to reorder' style='cursor:grab;user-select:none;'><i class='fas fa-grip-lines'></i></span>
        <span class=\"flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}\">${todo.text}</span>
        <span class=\"todo-meta\">
          ${todo.date ? `<i class='far fa-calendar-alt mr-1'></i>${todo.date}` : ''}
          ${todo.time ? `<i class='far fa-clock ml-2 mr-1'></i>${todo.time}` : ''}
          <span class=\"ml-2 font-bold ${priorityColor(todo.priority)}\">${todo.priority || 'Medium'}</span>
        </span>
        <div class=\"flex gap-2 ml-2\">
          <button class=\"todo-btn complete flex items-center\" title=\"${todo.completed ? 'Mark as pending' : 'Mark as completed'}\" aria-label=\"${todo.completed ? 'Mark as pending' : 'Mark as completed'}\"><i class=\"fas fa-check mr-1\"></i><span>${todo.completed ? 'Undo' : 'Complete'}</span></button>
          <button class=\"todo-btn edit flex items-center\" title=\"Edit task\" aria-label=\"Edit task\"><i class=\"fas fa-edit mr-1\"></i><span>Edit</span></button>
          <button class=\"todo-btn delete flex items-center\" title=\"Delete task\" aria-label=\"Delete task\"><i class=\"fas fa-trash mr-1\"></i><span>Delete</span></button>
        </div>
      `;
      // Complete
      li.querySelector('.complete').onclick = () => {
        todo.completed = !todo.completed;
        li.style.background = todo.completed ? '#e0e7ff' : 'rgba(255,255,255,0.85)';
        li.style.color = todo.completed ? '#a0aec0' : '';
        li.style.transform = 'scale(0.96)';
        setTimeout(() => { li.style.transform = ''; }, 180);
        saveTodos();
        renderTodos();
      };
      // Edit
      li.querySelector('.edit').onclick = () => {
        todo.editing = true;
        renderTodos();
      };
      // Delete
      li.querySelector('.delete').onclick = () => {
        li.style.opacity = 1;
        li.style.transform = 'scale(1)';
        li.style.transition = 'all 0.25s cubic-bezier(.4,0,.2,1)';
        li.style.opacity = 0;
        li.style.transform = 'scale(0.85)';
        setTimeout(() => {
          todos = todos.filter(t => t.id !== todo.id);
          saveTodos();
          renderTodos();
        }, 220);
      };
      // Click on text to toggle complete
      li.querySelector('span.flex-1').onclick = () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      };
    }
    todoList.appendChild(li);
  });
}

function priorityColor(priority) {
  if (priority === 'High') return 'text-pink-500';
  if (priority === 'Low') return 'text-green-500';
  return 'text-indigo-500';
}

// Search functionality
searchInput.addEventListener('input', e => {
  searchTerm = e.target.value.toLowerCase();
  renderTodos();
});

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  darkModeToggle.innerHTML = darkMode
    ? '<i class="fas fa-sun mr-2"></i><span>Light Mode</span>'
    : '<i class="fas fa-moon mr-2"></i><span>Dark Mode</span>';
});

// Drag-and-drop (HTML5)
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  this.classList.add('over');
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDragLeave(e) {
  this.classList.remove('over');
}
function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (dragSrcEl !== this) {
    const fromId = dragSrcEl.dataset.id;
    const toId = this.dataset.id;
    const fromIdx = todos.findIndex(t => t.id == fromId);
    const toIdx = todos.findIndex(t => t.id == toId);
    if (fromIdx > -1 && toIdx > -1) {
      const [moved] = todos.splice(fromIdx, 1);
      todos.splice(toIdx, 0, moved);
      saveTodos();
      renderTodos();
    }
  }
  return false;
}
function handleDragEnd(e) {
  this.classList.remove('dragElem');
  const items = document.querySelectorAll('.todo-item');
  items.forEach(i => i.classList.remove('over'));
}

// Dark mode CSS
const darkModeStyle = document.createElement('style');
darkModeStyle.innerHTML = `
  body.dark-mode {
    background: linear-gradient(135deg, #181c23 0%, #232946 100%) !important;
  }
  body.dark-mode .glass-card {
    background: rgba(35, 42, 54, 0.92) !important;
    border-color: #232946 !important;
  }
  body.dark-mode .todo-input, body.dark-mode .todo-edit-input {
    background: #232946 !important;
    color: #fff !important;
    border-color: #6366f1 !important;
  }
  body.dark-mode .todo-btn.add, body.dark-mode .todo-btn.selected-filter {
    background: linear-gradient(90deg, #ff7c7c, #6366f1) !important;
    color: #fff !important;
  }
  body.dark-mode .todo-item {
    background: #232946 !important;
    color: #fff !important;
  }
  body.dark-mode .todo-item.completed {
    background: #232946 !important;
    color: #a0aec0 !important;
  }
`;
document.head.appendChild(darkModeStyle);

loadTodos(); 