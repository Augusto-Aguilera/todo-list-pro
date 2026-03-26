// Referencias a elementos
const input = document.getElementById("task-input");
const dateInput = document.getElementById("task-date");
const btn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// 1. Actualizar el contador de pendientes
function updateCounter() {
  const pending = tasks.filter(t => !t.completed).length;
  counter.textContent = `Pendientes: ${pending}`;
}

// 2. Renderizar la lista
function renderTasks() {
  list.innerHTML = "";
  const today = new Date().toISOString().split('T')[0];

  let filteredTasks = tasks;
  if (currentFilter === "pending") filteredTasks = tasks.filter(t => !t.completed);
  if (currentFilter === "completed") filteredTasks = tasks.filter(t => t.completed);

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    
    // Lógica de color por vencimiento
    if (task.date && task.date < today && !task.completed) {
      li.classList.add("overdue");
    }
    if (task.completed) li.classList.add("completed");

    // Estructura interna de la tarea
    const infoDiv = document.createElement("div");
    infoDiv.className = "task-info";
    
    const textNode = document.createElement("strong");
    textNode.textContent = task.text;
    infoDiv.appendChild(textNode);

    if (task.date) {
      const dateNode = document.createElement("span");
      dateNode.className = "task-date-label";
      dateNode.textContent = `📅 Límite: ${task.date}`;
      infoDiv.appendChild(dateNode);
    }
    li.appendChild(infoDiv);

    // Click para completar
    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
    });

    // Botón borrar tarea individual
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t !== task);
      saveTasks();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
  updateCounter();
}

// 3. Guardar en LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// 4. Eventos
btn.addEventListener("click", () => {
  if (input.value.trim() === "") return;
  tasks.push({
    text: input.value,
    date: dateInput.value,
    completed: false
  });
  input.value = "";
  dateInput.value = "";
  saveTasks();
});

document.querySelectorAll(".filters button").forEach(b => {
  b.addEventListener("click", () => {
    currentFilter = b.dataset.filter;
    renderTasks();
  });
});

document.getElementById("clear-all").addEventListener("click", () => {
  if (confirm("¿Super Amigo, seguro que quieres borrar todo?")) {
    tasks = [];
    saveTasks();
  }
});

// Inicio de la app
renderTasks();