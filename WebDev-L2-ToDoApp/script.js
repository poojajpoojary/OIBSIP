// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const allCount = document.getElementById("allCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");


// Store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ------------------------------
// Save Tasks
// ------------------------------

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ------------------------------
// Display Tasks
// ------------------------------

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    // Empty state
    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }


    // Create task elements
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        // Task text
        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Action buttons
        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {

            editTask(task.id);

        });


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        li.appendChild(checkbox);

        li.appendChild(taskText);

        li.appendChild(actions);


        taskList.appendChild(li);

    });


    updateCounts();
}


// ------------------------------
// Add Task
// ------------------------------

function addTask() {

    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    taskInput.value = "";

    displayTasks();

    taskInput.focus();
}


// ------------------------------
// Complete / Uncomplete Task
// ------------------------------

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    displayTasks();
}


// ------------------------------
// Edit Task
// ------------------------------

function editTask(id) {

    const task = tasks.find(task => task.id === id);


    if (!task) {
        return;
    }


    const newText = prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    const trimmedText = newText.trim();


    if (trimmedText === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.text = trimmedText;


    saveTasks();

    displayTasks();
}


// ------------------------------
// Delete Task
// ------------------------------

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(task => task.id !== id);


    saveTasks();

    displayTasks();
}


// ------------------------------
// Update Task Counts
// ------------------------------

function updateCounts() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;


    allCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;
}


// ------------------------------
// Filter Tasks
// ------------------------------

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        displayTasks();

    });

});


// ------------------------------
// Add Task Button
// ------------------------------

addTaskBtn.addEventListener("click", addTask);


// ------------------------------
// Enter Key
// ------------------------------

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ------------------------------
// Initial Display
// ------------------------------

displayTasks();