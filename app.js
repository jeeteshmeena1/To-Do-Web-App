/* ==========================================
   TO-DO APP
   Part 1
========================================== */

// ==============================
// Current User
// ==============================

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

// Show username
const username = document.getElementById("username");

if (username) {
    username.textContent = currentUser.username;
}

// ==============================
// Task Storage
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ==============================
// DOM Elements
// ==============================

const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("search");

const totalTask = document.getElementById("totalTask");

const completedTask = document.getElementById("completedTask");

const pendingTask = document.getElementById("pendingTask");

const todayTask = document.getElementById("todayTask");

const progressBar = document.getElementById("progressBar");

const progressPercent = document.getElementById("progressPercent");

// ==============================
// Save Tasks
// ==============================

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}

// ==============================
// Add Task
// ==============================

taskForm.addEventListener("submit",function(e){

    e.preventDefault();

    const title=document.getElementById("title").value.trim();

    const description=document.getElementById("description").value.trim();

    const date=document.getElementById("date").value;

    const time=document.getElementById("time").value;

    const priority=document.getElementById("priority").value;

    const category=document.getElementById("category").value;

    const task={

        id:Date.now(),

        title,

        description,

        date,

        time,

        priority,

        category,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskForm.reset();

});

// ==============================
// Display Tasks
// ==============================

function displayTasks(){

    taskList.innerHTML="";

    if(tasks.length===0){

        taskList.innerHTML=`

        <div class="empty">

            <i class="fa-solid fa-clipboard-list"></i>

            <h2>No Tasks Yet</h2>

            <p>Add your first task.</p>

        </div>

        `;

        updateStatistics();

        return;

    }

    tasks.forEach(task=>{

        const card=document.createElement("div");

        card.className=`task ${task.completed?"completed":""}`;

        card.innerHTML=`

        <div class="taskHeader">

            <h3 class="taskTitle">${task.title}</h3>

            <span class="priority ${task.priority.toLowerCase()}">

                ${task.priority}

            </span>

        </div>

        <p class="taskDescription">

            ${task.description}

        </p>

        <div class="taskInfo">

            <span class="info">

                📅 ${task.date}

            </span>

            <span class="info">

                🕒 ${task.time}

            </span>

            <span class="category">

                ${task.category}

            </span>

        </div>

        <div class="taskButtons">

            <button

            class="completeBtn"

            onclick="toggleComplete(${task.id})">

            <i class="fa-solid fa-check"></i>

            ${task.completed?"Undo":"Complete"}

            </button>

            <button

            class="editBtn"

            onclick="editTask(${task.id})">

            <i class="fa-solid fa-pen"></i>

            Edit

            </button>

            <button

            class="deleteBtn"

            onclick="deleteTask(${task.id})">

            <i class="fa-solid fa-trash"></i>

            Delete

            </button>

        </div>

        `;

        taskList.appendChild(card);

    });

    updateStatistics();

}

// ==============================
// Statistics
// ==============================

function updateStatistics(){

    totalTask.textContent=tasks.length;

    const completed=tasks.filter(

        task=>task.completed

    ).length;

    const pending=tasks.length-completed;

    completedTask.textContent=completed;

    pendingTask.textContent=pending;

    const today=new Date().toISOString().split("T")[0];

    todayTask.textContent=

    tasks.filter(task=>task.date===today).length;

    let percent=0;

    if(tasks.length>0){

        percent=Math.round(

            completed/tasks.length*100

        );

    }

    progressBar.style.width=percent+"%";

    progressPercent.textContent=percent+"%";

}

// ==============================
// Initial Load
// ==============================

displayTasks();




























/* ==========================================
   PART 2
   Edit • Delete • Complete
========================================== */

// ==============================
// Complete / Undo Task
// ==============================

function toggleComplete(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    displayTasks();

}

// ==============================
// Delete Task
// ==============================

function deleteTask(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if(!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

}

// ==============================
// Edit Task
// ==============================

function editTask(id){

    const task = tasks.find(t => t.id === id);

    if(!task) return;

    // Fill the form with old values

    document.getElementById("title").value = task.title;

    document.getElementById("description").value = task.description;

    document.getElementById("date").value = task.date;

    document.getElementById("time").value = task.time;

    document.getElementById("priority").value = task.priority;

    document.getElementById("category").value = task.category;

    // Remove old task

    tasks = tasks.filter(t => t.id !== id);

    saveTasks();

    displayTasks();

    // Scroll to form

    document.querySelector(".addTask")
        .scrollIntoView({
            behavior:"smooth"
        });

}

// ==============================
// Sort Tasks
// Completed tasks go to bottom
// ==============================

function sortTasks(){

    tasks.sort((a,b)=>{

        return a.completed - b.completed;

    });

}

sortTasks();

// ==============================
// Auto Save
// ==============================

window.addEventListener("beforeunload",()=>{

    saveTasks();

});

// ==============================
// Keyboard Shortcut
// Ctrl + Enter = Add Task
// ==============================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Enter"){

        if(taskForm){

            taskForm.requestSubmit();

        }

    }

});

// ==============================
// Double Click Card
// Toggle Complete
// ==============================

taskList.addEventListener("dblclick",(e)=>{

    const card = e.target.closest(".task");

    if(!card) return;

    const title =
        card.querySelector(".taskTitle").textContent;

    const task = tasks.find(t=>t.title===title);

    if(task){

        toggleComplete(task.id);

    }

});




























/* ==========================================
   PART 3
   Search • Filter • Theme • Toast
========================================== */

// ==============================
// Live Search
// ==============================

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".task");

        cards.forEach(card => {

            const title = card.querySelector(".taskTitle")
                .textContent
                .toLowerCase();

            const description = card.querySelector(".taskDescription")
                .textContent
                .toLowerCase();

            if (
                title.includes(value) ||
                description.includes(value)
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}

// ==============================
// Dark Mode
// ==============================

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i> Light Mode';

    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-sun"></i> Light Mode';

            showToast("Dark Mode Enabled");

        } else {

            localStorage.setItem("theme", "light");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-moon"></i> Dark Mode';

            showToast("Light Mode Enabled");

        }

    });

}

// ==============================
// Toast Notification
// ==============================

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ==============================
// Better Statistics
// ==============================

function refreshDashboard() {

    updateStatistics();

    sortTasks();

}

// ==============================
// Override save function
// ==============================

const oldSave = saveTasks;

saveTasks = function () {

    oldSave();

    refreshDashboard();

};

// ==============================
// Welcome Message
// ==============================

window.addEventListener("load", () => {

    if (currentUser) {

        showToast(
            "Welcome " + currentUser.username + " 👋"
        );

    }

});

// ==============================
// Show toast after adding task
// ==============================

if (taskForm) {

    taskForm.addEventListener("submit", () => {

        setTimeout(() => {

            showToast("Task Added Successfully");

        }, 200);

    });

}
























/* ==========================================
   PART 4
   Filter • Export • Import • Confetti
========================================== */

// ==============================
// Filter Tasks
// ==============================

function filterTasks(type){

    switch(type){

        case "completed":

            renderFiltered(tasks.filter(t=>t.completed));

            break;

        case "pending":

            renderFiltered(tasks.filter(t=>!t.completed));

            break;

        case "high":

            renderFiltered(tasks.filter(t=>t.priority==="High"));

            break;

        case "medium":

            renderFiltered(tasks.filter(t=>t.priority==="Medium"));

            break;

        case "low":

            renderFiltered(tasks.filter(t=>t.priority==="Low"));

            break;

        default:

            displayTasks();

    }

}

// ==============================
// Render Filtered Tasks
// ==============================

function renderFiltered(filtered){

    taskList.innerHTML="";

    if(filtered.length===0){

        taskList.innerHTML=`
        <div class="empty">
            <i class="fa-solid fa-filter-circle-xmark"></i>
            <h2>No Matching Tasks</h2>
        </div>
        `;

        return;

    }

    filtered.forEach(task=>{

        const card=document.createElement("div");

        card.className=`task ${task.completed?"completed":""}`;

        card.innerHTML=`

        <div class="taskHeader">

            <h3 class="taskTitle">${task.title}</h3>

            <span class="priority ${task.priority.toLowerCase()}">

            ${task.priority}

            </span>

        </div>

        <p class="taskDescription">

            ${task.description}

        </p>

        <div class="taskInfo">

            <span class="info">${task.date}</span>

            <span class="info">${task.time}</span>

            <span class="category">${task.category}</span>

        </div>

        <div class="taskButtons">

            <button
                class="completeBtn"
                onclick="toggleComplete(${task.id})">

                ${task.completed?"Undo":"Complete"}

            </button>

            <button
                class="editBtn"
                onclick="editTask(${task.id})">

                Edit

            </button>

            <button
                class="deleteBtn"
                onclick="deleteTask(${task.id})">

                Delete

            </button>

        </div>

        `;

        taskList.appendChild(card);

    });

}

// ==============================
// Export Tasks
// ==============================

function exportTasks(){

    const blob=new Blob(

        [JSON.stringify(tasks,null,2)],

        {type:"application/json"}

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="tasks.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Tasks Exported");

}

// ==============================
// Import Tasks
// ==============================

function importTasks(file){

    const reader=new FileReader();

    reader.onload=function(e){

        try{

            const imported=JSON.parse(e.target.result);

            tasks=imported;

            saveTasks();

            displayTasks();

            showToast("Tasks Imported");

        }

        catch{

            alert("Invalid File");

        }

    }

    reader.readAsText(file);

}

// ==============================
// Confetti
// ==============================

function checkCompletion(){

    if(tasks.length===0) return;

    const completed=tasks.filter(

        t=>t.completed

    ).length;

    if(completed===tasks.length){

        showToast("🎉 Congratulations!");

    }

}

const oldToggle=toggleComplete;

toggleComplete=function(id){

    oldToggle(id);

    checkCompletion();

}

// ==============================
// Keyboard Shortcuts
// ==============================

document.addEventListener("keydown",e=>{

    if(e.key==="/"){

        e.preventDefault();

        searchInput.focus();

    }

});

// ==============================
// Initial Dashboard Refresh
// ==============================

displayTasks();

updateStatistics();