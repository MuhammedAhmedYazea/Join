let tasks = [];
let taskIdCounter = 0;
let currentDraggedElement;
let taskStatus = `toDo`;


/**
 * Adds a task using a popup interface.
 * 
 * This function prepares for task addition, gathers task details, and
 * checks if the task priority is set. If the priority is undefined, 
 * it displays an alert. If defined, it finalizes the task addition process.
 * 
 * @async
 * @function addTaskWithPopup
 * @param {Event} event - The event triggering the function call.
 * @returns {Promise<void>} Returns a promise that resolves when the 
 * task has been added using the popup interface.
 */
async function addTaskWithPopup(event) {
    await prepareTaskAdding(event);
    let taskDetails = gatherTaskDetails();
    if (typeof taskPrio === 'undefined') {
        showTaskPrioAlert();
    } else {
        let taskPrio = getTaskPrio();
        await finalizeTaskAddingPopup(taskDetails, taskPrio);
    }
    taskStatus = 'toDo';
}

/**
 * Adds a task.
 * 
 * This function prepares for task addition, gathers task details, and
 * checks if the task priority is set. If the priority is undefined, 
 * it displays an alert. If defined, it finalizes the task addition process
 * without using a popup.
 * 
 * @param {Event} event - The event triggering the function call.
 * task has been added.
 */
async function addTask(event) {
    await prepareTaskAdding(event);
    let taskDetails = gatherTaskDetails();
    if (typeof taskPrio === 'undefined') {
        showTaskPrioAlert();
    } else {
        let taskPrio = getTaskPrio();
        await finalizeTaskAddingPopup(taskDetails, taskPrio);
    }
    taskStatus = 'toDo';
}

/**
 * Handles the initial task adding preparation.
 * 
 * @async
 * @function prepareTaskAdding
 * @param {Event} event - The event triggering the function call.
 * @returns {Promise<void>} Returns a promise that resolves when preparation steps are done.
 */
async function prepareTaskAdding(event) {
    event.stopPropagation();
    await checkLastTaskId();
    await loadSelectedUsers();
}



/**
 * Checks and updates the task ID based on the existing tasks.
 */
async function checkLastTaskId() {
    await loadTasks();
    if (tasks.length > 0) {
        const maxId = Math.max(...tasks.map(task => task.id));
        taskIdCounter = maxId + 1;
    }
}

/**
 * Adds a new task and stores it in the 'tasks' variable.
 * @returns {Promise<void>}
 */
function createTaskElement(taskName, taskSubtask, taskDescription, taskCategory, taskCategorybc, taskAssign, taskDate, taskPrio, taskId) {

    return {
        id: taskId,
        name: taskName,
        subtask: taskSubtask,
        tasktext: taskDescription,
        category: taskCategory,
        categoryBackgroundColor: taskCategorybc,
        user: taskAssign,
        date: taskDate,
        priority: taskPrio,
        status: taskStatus,
    };
}


/**
 * Finalizes the task addition process.
 * 
 * @async
 * @function finalizeTaskAdding
 * @param {Object} taskDetails - An object containing task details.
 * @param {string} taskPrio - The priority of the task.
 * @returns {Promise<void>} Returns a promise that resolves when the task addition is finalized.
 */
async function finalizeTaskAdding(taskDetails, taskPrio) {
    let taskId = taskIdCounter++;
    let task = await createTaskElement(taskDetails.taskName, taskDetails.taskSubtask, taskDetails.taskDescription,
        taskDetails.taskCategory, taskDetails.taskCategorybc, taskDetails.taskAssign,
        taskDetails.taskDate, taskPrio, taskId);
    await addTaskToList(task);
    selectedUsers = [];
    
    await saveSelectedUsers();
    setTimeout(closePopup, 1000);
}


/**
 * Finalizes the task addition process and navigates to the board page.
 * 
 * @param {Object} taskDetails - An object containing task details.
 * @param {string} taskPrio - The priority of the task..
 */
async function finalizeTaskAddingPopup(taskDetails, taskPrio) {
    let taskId = taskIdCounter++;
    let task = await createTaskElement(taskDetails.taskName, taskDetails.taskSubtask, taskDetails.taskDescription, 
                                taskDetails.taskCategory, taskDetails.taskCategorybc, taskDetails.taskAssign, 
                                taskDetails.taskDate, taskPrio, taskId);
    await addTaskToList(task);
    selectedUsers = [];
    await saveSelectedUsers();
    setTimeout(() => window.open('board.html', '_self'), 1000);
}

/**
 * Adds a task to the task list and updates storage.
 * 
 * @async
 * @function addTaskToList
 * @param {Object} task - The task object to be added to the list.
 * @returns {Promise<void>} Returns a promise that resolves when the task has been added to storage.
 */
async function addTaskToList(task) {
    tasks.push(task);
    await setItem('tasks', JSON.stringify(tasks));
    subtasks = [];
    await taskAddedToBoard();
}

/**
 * Prepares to add a task with status "inProgress".
 * 
 * @function addTaskInProgress
 */
function addTaskInProgress() {
    addTaskPopUp();
    taskStatus = "inProgress";
}

/**
 * Prepares to add a task with status "awaitingFeedback".
 * 
 * 
 */
function addTaskAwaitingFb() {
    addTaskPopUp();
    taskStatus = "awaitingFeedback";
}

/**
 * Prepares to add a task with status "done".
 * 
 * @function addTaskDone
 */
function addTaskDone() {
    taskStatus = "done";
    addTaskPopUp();
    
}



/**
 * Gathers task details from UI elements.
 * 
 * @function gatherTaskDetails
 * @returns {Object} Returns an object containing task details.
 */
function gatherTaskDetails() {
    let taskName = document.getElementById('addTaskTitle').value;
    let taskSubtask = subtasks;
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskCategory = currentCategory || "category";
    let taskCategorybc = currentColorOfCategory || "#000000";
    let taskAssign = selectedUsers;
    let taskDate = document.getElementById('addTaskInputDate').value;
    return { taskName, taskSubtask, taskDescription, taskCategory, taskCategorybc, taskAssign, taskDate };
}





/**
 * Displays an alert for task priority.
 * 
 * @function showTaskPrioAlert
 */
function showTaskPrioAlert() {
    document.getElementById('prioalert').classList.remove('d-none');
}


/**
 * Modifies an existing task.
 * @param {number} i - The index of the task to be changed in the 'tasks' list.
 * @returns {Promise<void>}
 */
async function changeTask(i, event) {
    event.stopPropagation();
    await prepareTaskChange(i);
    await setItem('tasks', JSON.stringify(tasks));
    selectedUsers = [];
    await saveSelectedUsers();
    await taskAddedToBoard();
    closePopup();
};


function prepareTaskChange(i) {
    let task = tasks[i];
    
    let taskId = task.id;
    let taskName = document.getElementById('addTaskTitle').value;
    let taskSubtask = task['subtask'];
    let taskDescription = document.getElementById('addTaskDescription').value;
     let taskCategory = currentCategory || "category";
    let taskCategorybc = currentColorOfCategory || "#000000";
    let taskAssign = selectedUsers;
    let taskDate = document.getElementById('addTaskInputDate').value;
    let taskPrio = getTaskPrio();
    let taskStatus = task.status;
    task.id = taskId;
    task.name = taskName;
    task.subtask = taskSubtask;
    task.tasktext = taskDescription;
    task.category = taskCategory;
    task.categoryBackgroundColor = taskCategorybc,
    task.user = taskAssign;
    task.date = taskDate;
    task.priority = taskPrio;
    task.status = taskStatus;
}

/**
 * Prepares the user interface to edit an existing task.
 * @param {number} i - The index of the task to be edited in the 'tasks' list.
 */
// Funktion um Aufgabendetails in Eingabefelder zu laden
async function loadTaskDetails(task) {
    document.getElementById('addTaskHeaderText').innerHTML = `Edit Task`;
    document.getElementById('addTaskTitle').value = task.name;
    document.getElementById('addTaskDescription').value = task.tasktext;
    document.getElementById('dropdown').innerHTML = task.category;
    currentCategory = task.category;
    currentColorOfCategory = task.categoryBackgroundColor;
    await checkboxUsers(task);
    document.getElementById('addTaskInputDate').value = task.date;
    taskStatus = task.status;
    taskId = task.id;
}


/**
 * Clears all tasks from both the tasks array and the DOM.
 * 
 * This function resets the tasks array and clears the content of 
 * all task status containers on the DOM.
 * 
 */
function clearAllTasks() {
    tasks = [];
    const taskStatusContainers = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    for (const containerId of taskStatusContainers) {
        document.getElementById(containerId).innerHTML = '';
    }
}



/**
 * Saves the edited task, closes the popup and renders the tasks again.
 */
async function editTask(i) {
    let task = tasks[i];
    await closeTask();
    await addTaskPopUp();
    let taskprio = task['priority'];
    await getTaskPrio(taskprio);
    await loadTaskDetails(task);
    document.getElementById('buttonEdit').classList.add('d-none');
    document.getElementById('buttonAfterEdit').innerHTML = `<div id="buttonAfterEditNone"  class="create-btn btn d-none" onclick="changeTask(${i},event)">Change Task <img src="assets/img/add_task_check.png" alt="cancel"></div>`;
    document.getElementById('buttonAfterEditNone').classList.remove('d-none');
    subtasks = [];
    await renderSubtasksEdit(task);
    
}

/**
 * Checks the Boxes for the users that already are assigned in task when edit task.
 */
function checkboxUsers(task) {
    for (let i = 0; i < task.user.length; i++) {
        let checkboxes = document.querySelectorAll(`input[name="${task.user[i]}"]`);
        for (let j = 0; j < checkboxes.length; j++) {
            checkboxes[j].checked = true;
            checkboxes[j].dispatchEvent(new Event('click'));
        }
    }
}

/**
 * Removes all inputs in the task form.
 */
function clearTask(event) {
    //location.reload(); // Das hier von hier wegnehmn und eine eigene Funktion erstellen dafür
    event.stopPropagation();
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskInputSubtask').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskCategorySelect').value = '';
    document.getElementById('addTaskInputDate').value = '';
    document.getElementById('showSubtasks').innerHTML = '';
}

function clearTaskBut(event) {
    location.reload(); // Das hier von hier wegnehmn und eine eigene Funktion erstellen dafür
}

/**
 * Returns the priority of the task based on the provided string.
 * @param {string} prio - The priority value as a string ('urgent', 'medium', 'low').
 */
function getTaskPrio(prio) {
    if (prio === 'urgent' || prio === `assets/img/priohigh.png`) {
        taskPrio = `assets/img/priohigh.png`;
        prioColorRed();
    }
    if (prio === 'medium' || prio === `assets/img/priomedium.png`) {
        taskPrio = `assets/img/priomedium.png`;
        prioColorOrange();
    }
    if (prio === 'low' || prio === `assets/img/priolow.png`) {
        taskPrio = `assets/img/priolow.png`;
        prioColorGreen();
    }
    return taskPrio;
}


/**
 * Sets the urgency color and content based on a task's priority.
 * This function checks the priority of the task at the given index
 * and updates the DOM elements to reflect the urgency (Urgent, Medium, or Low)
 * based on the priority image path.
 * @param {number} index - The index of the task in the 'tasks' array.
 */
function colorUrgency(index) {
    task = tasks[index]
    prio = task['priority'];
    if (prio === 'assets/img/priohigh.png') {
        document.getElementById('colorPrioBigTask').classList.add('urgent');
        document.getElementById('prioBigTask').innerHTML = `Urgent`;
        document.getElementById('urgencyImg').innerHTML = `<img src="assets/img/prio.png">`;
    }
    if (prio === 'assets/img/priomedium.png') {
        document.getElementById('colorPrioBigTask').classList.add('medium');
        document.getElementById('prioBigTask').innerHTML = `Medium`;
        document.getElementById('urgencyImg').innerHTML = `=`;
    }
    if (prio === 'assets/img/priolow.png') {
        document.getElementById('colorPrioBigTask').classList.add('low');
        document.getElementById('prioBigTask').innerHTML = `Low`;
        document.getElementById('urgencyImg').innerHTML = `<img src="assets/img/priolowwhite.png">`;
    }
}


/**
 * Loads the existing tasks.
 * @returns {Promise<void>}
 */
async function loadTasks() {
    try {
        const loadedTasks = JSON.parse(await getItem('tasks'));
        if (Array.isArray(loadedTasks)) {
            tasks = loadedTasks;
        } else if (typeof loadedTasks === 'object' && loadedTasks !== null) {
            tasks = Object.values(loadedTasks);
        } else {
            console.error('Loaded tasks are not an array:', loadedTasks);
        }
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Calls the 'loadTasks()' function and updates the HTML.
 * @returns {Promise<void>}
 */
async function renderTasks() {
    await loadTasks();
    await updateHTML();
    //Die 2 vorherigen Zeilen sind alt. Die Funktion auch. Aber die Sachen danach plus die 2 Funktionen danach sind neu..

    // Render tasks in 'To Do' section
    /*
    await renderTaskSection('toDo');

    // Render tasks in 'In Progress' section
    await renderTaskSection('inProgress');

    // Render tasks in 'Awaiting Feedback' section
    await renderTaskSection('awaitingFeedback');

    // Render tasks in 'Done' section
    await renderTaskSection('done');
    */

}

async function renderTaskSection(taskStatusName) {
    for (let task of tasks) {
        await handleTaskSearch(task, '', task['status'], taskStatusName);
    }

    if (isTaskSectionEmpty(taskStatusName)) {
        document.getElementById(taskStatusName).innerHTML = '<p>&nbsp&nbsp&nbsp&nbspKeine aktuellen Tasks</p>';
    }
}

function isTaskSectionEmpty(sectionId) {
    return document.getElementById(sectionId).childElementCount === 0;
}

/**
 * Updates the HTML to display the tasks in the respective status columns.
 */
async function updateHTML() {
    await renderToDo();
    await renderInProgress();
    await renderAwaitFb();
    await renderDone();
}

/**
 * Updates the HTML representation of the 'to-do' tasks.
 */
async function renderToDo() {
    let toDo = tasks.filter(t => t['status'] == 'toDo');
    document.getElementById('toDo').innerHTML = '';
    for (let index = 0; index < toDo.length; index++) {
        const task = toDo[index];
        document.getElementById('toDo').innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
        await renderSubtasks(task);
    }

}


/**
 * Renders users associated with a task based on the task's user data.
 * 
 * This function loads the contacts, processes each user's name to create a user representation,
 * and updates the corresponding container in the DOM with the user's template.
 * @param {Object} task - The task object containing user and other details.
 */   /*
async function renderUsersInTask(task) {
    await loadContacts();
    userTasks = task['user'];
    
    let maxUsersToRender = Math.min(userTasks.length, 4);
    let idTask = task.id;
    let userContainer = document.getElementById(`usersInTask${idTask}`);
    for (let i = 0; i < maxUsersToRender; i++) {
        const element = userTasks[i];
        
        let nameParts = element.split(' '); // Split by space to separate name parts
        let firstLetter = nameParts[0].charAt(0);
        let secondLetter = '';
        if (nameParts.length > 1) {
            secondLetter = nameParts[1].charAt(0);
        }
        let contact = await getContactFromName(nameParts.join(' '));
        let randomColor = contact ? contact.color : getRandomColor(); 
        userContainer.innerHTML += await taskUserTemplate(randomColor, firstLetter, secondLetter);
    };
} */

/**
 * Renders users associated with a task based on the task's user data.
 * 
 * This function loads the contacts, processes each user's name to create a user representation,
 * and updates the corresponding container in the DOM with the user's template.
 * @param {Object} task - The task object containing user and other details.
 */ 
async function renderUsersInTask(task) {
    await loadContacts();
    const userTasks = task['user'];
    const idTask = task.id;
    let userContainer = document.getElementById(`usersInTask${idTask}`);
    
    // Display up to 3 users, show a plus sign if there are more than 3 users
    for (let i = 0; i < Math.min(userTasks.length, 3); i++) {
        const element = userTasks[i];
        let nameParts = element.split(' ');
        let firstLetter = nameParts[0].charAt(0);
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        let contact = getContactFromName(nameParts.join(' '));
        let randomColor = contact ? contact.color : getRandomColor();
        userContainer.innerHTML += await taskUserTemplate(randomColor, firstLetter, secondLetter);
    }

    // Check if there are more than 3 users and display a plus sign
    if (userTasks.length > 3) {
        const remainingUsers = userTasks.length - 3;
        userContainer.innerHTML += `<div class="plus-sign-more">+${remainingUsers}</div>`;
    }
} 

/**
 * Retrieves a contact from the contacts array based on a name.
 * @param {string} name - The full name of the contact to retrieve.
 */
function getContactFromName(name) {
    return contacts.find(contact => contact.name === name);
}

/**
 * Renders users in the task that is currently open or being viewed.
 * This function processes each user's name to create a user representation,
 * and updates the corresponding container in the DOM with the user's HTML content.
 */
function renderUsersInOpenTask(index) {
    let task = tasks[index];
    const userTasks = task['user'];
    const userContainer = document.getElementById(`usersInOpenTask${task.id}`);
    for (let i = 0; i < userTasks.length; i++) {
        const element = userTasks[i];
        let nameParts = element.split(' ');
        let firstLetter = nameParts[0].charAt(0);
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        let contact = getContactFromName(nameParts.join(' '));
        let randomColor = contact ? contact.color : getRandomColor();
        const userElement = document.createElement('div');
        userElement.classList.add('contact-container');
        userElement.innerHTML = createUserHTML(randomColor, firstLetter, secondLetter, nameParts);
        userContainer.appendChild(userElement);
    };
}


/**
 * Updates the HTML representation of the 'in-progress' tasks.
 */
async function renderInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'inProgress');
    document.getElementById('inProgress').innerHTML = '';
    for (let index = 0; index < inProgress.length; index++) {
        const task = inProgress[index];
        document.getElementById('inProgress').innerHTML += await taskTemplate(task);
        renderUsersInTask(task);
        await renderSubtasks(task);
    }
}

/**
 * Updates the HTML representation of the 'awaitingFeedback' tasks.
 */
async function renderAwaitFb() {
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaitingFeedback');
    document.getElementById('awaitingFeedback').innerHTML = '';
    for (let index = 0; index < awaitingFeedback.length; index++) {
        const task = awaitingFeedback[index];
        document.getElementById('awaitingFeedback').innerHTML += await taskTemplate(task);
        renderUsersInTask(task);
        await renderSubtasks(task);
    }
}

/**
 * Updates the HTML representation of the 'done' tasks.
 */
async function renderDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let index = 0; index < done.length; index++) {
        const task = done[index];
        document.getElementById('done').innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
        await renderSubtasks(task);
    }
}


/**
 * Opens and displays the details of a task.
 * 
 * This function fetches the task's details, renders them, sets the urgency color,
 * displays associated users, and renders the subtasks for the opened task.
 * @param {number} i - The ID of the task to open.
 */
async function openTask(i) {
    document.getElementById('showTask').classList.remove('d-none');
    let index = tasks.findIndex(task => task.id === i);
    let taskDetailsHTML = await generateTaskDetailsHTML(index);
    document.getElementById('showTask').innerHTML = await taskDetailsHTML;
    colorUrgency(index);
    renderUsersInOpenTask(index);
    renderSubtasksBig(task);
}

/**
 * Closes the detailed view of a task.
 */
async function closeTask() {
    document.getElementById('taskContainer').classList.remove('d-none');
    document.getElementById('showTask').classList.add('d-none');
    await initBoard();
}


/**
 * Deletes a specific task and updates the view.
 * @param {number} i - The index of the task to be deleted in the 'tasks' list.
 * @returns {Promise<void>}
 */
async function deleteTask(i) {
    tasks.splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    await renderTasks();
    closeTask();
}


/**
 * Displays a notification on the board when a task is added.
 * This function briefly displays a container to notify the user 
 * that a task has been successfully added to the board.
 */
function taskAddedToBoard() {
    const container = document.querySelector('.addedTaskToBoard_content');
    container.classList.add('show');
    setTimeout(() => {
        container.classList.remove('show');
    }, 3000);
}





/**
 * Renders the detailed (big) view of subtasks for a task.
 * This function processes each subtask for the given task and updates
 * the DOM to display them in a detailed view, including interactivity.
 * @param {Object} task - The task object containing subtasks and other details.
 */
async function renderSubtasksBig(task) {
    await loadTasks();
    const subtask = task.subtask;
    const id = task.id;
    for (let i = 0; i < subtask.length; i++) {
        let element = subtask[i];
        elementString = JSON.stringify(element);
        let imgSrc = "assets/img/subtask_square.png";
        let clicked = element['clicked']
        if (clicked == 'true') {
            imgSrc = "assets/img/done_white.png";
            clicked = 'true';
        }
        document.getElementById(`subtasksbig${id}`).innerHTML += /*html*/`
        <div class="subtasksbig">
            <img class="donesign" onclick="addDoneSignToSquare(event,'${id}',${i})" src="${imgSrc}" alt="Subtasks" data-clicked="${clicked}">
            <span>${element['name']}</span>
        </div>    
        `;
    }
}