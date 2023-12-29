/**
 * Users for a specific task
 */

let selectedUsers = [];
/**
 * Displays the add task popup.
 */
async function addTaskPopUp() {
    let popup = document.getElementById('popupAddTask');
    popup.classList.remove('d-none');
    await renderPopUp(popup);
    await currentDate();
    await renderTaskContacts();
}

/**
 * Closes the add task popup and re-renders the tasks.
 */
async function closePopup() {
    let popup = document.getElementById('popupAddTask');
    popup.classList.add('d-none');
   await renderTasks();
}

/**
 * Prevents the popup from closing when clicking inside it.
 * @param {Event} event - The DOM event.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Changes the color of the priority to red when the "Urgent" button is clicked.
 */
function prioColorRed() {
    let urgent = document.getElementById('prioUrgent');
    let medium = document.getElementById('prioMedium');
    let low = document.getElementById('prioLow');
    urgent.classList.toggle('prio-btn-urgent-clicked');
    medium.classList.remove('prio-btn-medium-clicked');
    low.classList.remove('prio-btn-low-clicked');
}

/**
 * Changes the color of the priority to orange when the "Medium" button is clicked.
 */
function prioColorOrange() {
    let urgent = document.getElementById('prioUrgent');
    let medium = document.getElementById('prioMedium');
    let low = document.getElementById('prioLow');
    urgent.classList.remove('prio-btn-urgent-clicked');
    medium.classList.toggle('prio-btn-medium-clicked');
    low.classList.remove('prio-btn-low-clicked');
}

/**
 * Changes the color of the priority to green when the "Low" button is clicked.
 */
function prioColorGreen() {
    let urgent = document.getElementById('prioUrgent');
    let medium = document.getElementById('prioMedium');
    let low = document.getElementById('prioLow');
    urgent.classList.remove('prio-btn-urgent-clicked');
    medium.classList.remove('prio-btn-medium-clicked');
    low.classList.toggle('prio-btn-low-clicked');
}

// CONTACT FUNCTIONS
/**
 * Renders the Contacts in the "Assign to" Selector on Add Task. 
 */
async function renderTaskContacts() {
    await loadContacts();
    setTimeout(()=>{
        let userSelection = `
        <div id="selectInnerUser">`;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        userSelection += `
            <input onclick="pushCurrentContact(event)" type="checkbox" id="name${i}" name="${contact['name']}" value="${contact['name']}">
            <label for="name${i}">${contact['name']}</label><br>`;
    }
    userSelection += `
        </div>`;
     document.getElementById('selectInnerUser').innerHTML = userSelection;
    },50)
   
}

/**
 * Adds or removes the name of the selected contact to/from the 'selectedUsers' array based on checkbox status.
 */
function pushCurrentContact(event) {
    let checked = event.target.checked;
    let name = event.target.value;
    if (checked) {
        selectedUsers.push(name);
    } else {
        selectedUsers = selectedUsers.filter(function (user) {
            return user !== name;
        });
    }
    saveSelectedUsers();
}

/**
 * Saves the selected users to local storage.
 * @returns {Promise<void>}
 */
async function saveSelectedUsers() {
    await setItem('selectedUsers', JSON.stringify(selectedUsers));
}

/**
 * Loads the selected users from local storage.
 * @returns {Promise<void>}
 */
async function loadSelectedUsers() {
    try {
        selectedUsers = JSON.parse(await getItem('selectedUsers'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Searches for a task based on the value from the search input. 
 * Displays the tasks that match the search criteria.
 * @returns {Promise<void>}
 */
async function findTask() {
    let search = document.getElementById('searchTaskInput').value.toLowerCase();
    await clearAllTasks();
    for (let task of tasks) {
        await handleTaskSearch(task, search, task['status'], 'toDo');
        await handleTaskSearch(task, search, task['status'], 'inProgress');
        await handleTaskSearch(task, search, task['status'], 'awaitingFeedback');
        await handleTaskSearch(task, search, task['status'], 'done');
    }
    if (search == '') {
     await clearAllTasks();
        renderTasks();
    }
}

/**
 * Handles the display of tasks that match the search criteria and status.
 * @param {Object} task - The task to check against the search criteria.
 * @param {string} search - The search criteria.
 * @param {string} taskStatus - The status of the task.
 * @param {string} taskStatusName - The name of the task status for comparison.
 * @returns {Promise<void>}
 */ /*
async function handleTaskSearch(task, search, taskStatus, taskStatusName) {
    let searchTask = task['name'];
    if (searchTask.toLowerCase().includes(search) && taskStatus == taskStatusName) {
        document.getElementById(taskStatusName).innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
    }
} */

async function handleTaskSearch(task, search, taskStatus, taskStatusName) { // Code seems to work
    let searchTaskName = task['name'].toLowerCase();
    let searchTaskDescription = task['tasktext'].toLowerCase();

    if ((searchTaskName.includes(search) || searchTaskDescription.includes(search)) && taskStatus == taskStatusName) {
        document.getElementById(taskStatusName).innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
    }
}

/**
 * Clears the content of all task sections.
 */
function clearAllTasks() {
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('toDo').innerHTML = '';
    document.getElementById('awaitingFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}




