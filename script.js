const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filters button");

// Add task
addBtn.addEventListener("click", addTask);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskValue = taskInput.value.trim();
  const timeValue = taskTime.value;

  if (taskValue === "") return;

  let li = document.createElement("li");
  li.setAttribute("data-status", "pending");

  // Format date/time
  let timeText = "";
  if (timeValue) {
    const dueDate = new Date(timeValue);
    const now = new Date();
    const formatted = dueDate.toLocaleString();
    timeText = `<div class="time ${dueDate < now ? "overdue" : ""}">⏰ ${formatted}</div>`;
  }

  li.innerHTML = `
    <div class="task-header">
      <span>${taskValue}</span>
      <div class="action-btns">
        <button class="done-btn" onclick="completeTask(this)">✔</button>
        <button class="edit-btn" onclick="editTask(this)">✎</button>
        <button class="delete-btn" onclick="deleteTask(this)">✖</button>
      </div>
    </div>
    ${timeText}
  `;

  taskList.appendChild(li);
  taskInput.value = "";
  taskTime.value = "";
  saveData();
}

// Complete task
function completeTask(button) {
  let li = button.closest("li");
  li.classList.toggle("completed");
  li.setAttribute("data-status", li.classList.contains("completed") ? "completed" : "pending");
  saveData();
}

// Delete task
function deleteTask(button) {
  button.closest("li").remove();
  saveData();
}

// Edit task
function editTask(button) {
  let li = button.closest("li");
  let span = li.querySelector("span");

  if (!li.classList.contains("editing")) {
    let input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    li.insertBefore(input, li.firstChild);
    span.style.display = "none";
    button.textContent = "💾";
    li.classList.add("editing");
  } else {
    let input = li.querySelector("input");
    span.textContent = input.value.trim() || span.textContent;
    span.style.display = "inline";
    input.remove();
    button.textContent = "✎";
    li.classList.remove("editing");
    saveData();
  }
}

// Filter tasks
function filterTasks(filter) {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "completed":
        task.style.display = task.classList.contains("completed") ? "flex" : "none";
        break;
      case "pending":
        task.style.display = !task.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });

  filterBtns.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.filters button[onclick="filterTasks('${filter}')"]`).classList.add("active");
}

// Save to LocalStorage
function saveData() {
  localStorage.setItem("tasks", taskList.innerHTML);
}

// Load from LocalStorage
function loadData() {
  taskList.innerHTML = localStorage.getItem("tasks") || "";
}

loadData();
fetch("http://localhost:5000/tasks")   // GET all
fetch("http://localhost:5000/tasks", { method: "POST", body: JSON.stringify({ text, time }) })
fetch("http://localhost:5000/tasks/123", { method: "DELETE" })
