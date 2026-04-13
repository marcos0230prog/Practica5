let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const filterButtons = document.querySelectorAll(".filters button");
const clearCompletedBtn = document.getElementById("clearCompleted");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </div>
            <button>❌</button>
        `;

        const checkbox = li.querySelector("input");
        const span = li.querySelector("span");
        const deleteBtn = li.querySelector("button");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        span.addEventListener("dblclick", () => {
            span.contentEditable = true;
            span.focus();
        });

        span.addEventListener("blur", () => {
            span.contentEditable = false;
            task.text = span.textContent.trim();
            if (task.text === "") {
                tasks = tasks.filter(t => t.id !== task.id);
            }
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    updatePendingCount();
}

function updatePendingCount() {
    const count = tasks.filter(task => !task.completed).length;
    pendingCount.textContent = `${count} pendientes`;
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();