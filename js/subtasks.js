let subtasks = [];
editMode = false;
subTaskToEdit = "";

/**
 * Adds a new subtask based on user input.
 * This function captures the user's subtask input, checks certain conditions
 * (like not exceeding a maximum limit), then renders the subtask and adds it to 
 * the subtasks list.
 */ /*
function addNewSubtask() {
    const newSubtask = document.getElementById('addTaskInputSubtask').value;
    if (editMode) {
        updateSubTask(subTaskToEdit);
    } else if (newSubtask === '') {
        alert('Bitte Feld ausfüllen!!')
    } else {
        if (subtasks.length >= 3) {
            alert('Maximal drei Subtasks erstellen');
        } else {
            subtasks.push({
                name: newSubtask,
                clicked: `false`,
            });
            renderSubtask();
            document.getElementById('addTaskInputSubtask').value = '';
        }
    }
} */

function addNewSubtask() {
    const newSubtask = document.getElementById('addTaskInputSubtask').value;

    if (editMode) {
        updateSubTask(subTaskToEdit);
    } else if (newSubtask === '') {
        displayErrorMessage('Bitte Feld ausfüllen!!');
    } else {
        if (subtasks.length >= 3) {
            displayErrorMessage('Maximal drei Subtasks erstellen');
        } else {
            subtasks.push({
                name: newSubtask,
                clicked: `false`,
            });
            renderSubtask();
            document.getElementById('addTaskInputSubtask').value = '';
        }
    }
}

function displayErrorMessage(message) {
    const errorContainer = document.getElementById('subtaskErrorMessage');
    
    if (!errorContainer) {
        const subtaskContainer = document.querySelector('.subtasks');
        const errorMessage = document.createElement('span');
        errorMessage.id = 'subtaskErrorMessage';
        errorMessage.style.color = 'red';
        errorMessage.textContent = message;
        subtaskContainer.appendChild(errorMessage);
    } else {
        errorContainer.textContent = message;

        // Füge den folgenden Code hinzu, um die Fehlermeldung nach einer Verzögerung zu entfernen
        setTimeout(() => {
            errorContainer.textContent = '';
        }, 1000); // Ändere die Zeit (in Millisekunden) nach Bedarf
    }
}

/* War gut, aber ich teste kurz neuen Code... 
function displayErrorMessage(message) {
    const errorContainer = document.getElementById('subtaskErrorMessage');
    if (!errorContainer) {
        const subtaskContainer = document.querySelector('.subtasks');
        const errorMessage = document.createElement('span');
        errorMessage.id = 'subtaskErrorMessage';
        errorMessage.style.color = 'red';
        errorMessage.textContent = message;
        subtaskContainer.appendChild(errorMessage);
    } else {
        errorContainer.textContent = message;
    }
} */

/**
 * Renders a single subtask in the user interface.
 * @param {HTMLElement} currentSubtasks - The container element for displaying subtasks.
 * @param {string} newSubtask - The subtask name or content to render.
 */
function renderSubtask() {
    document.getElementById('showSubtasks').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        document.getElementById('showSubtasks').innerHTML += /*html*/`
        <div class="subtasksbig">
            <img class="donesign" onclick="addDoneSignToSquareAddTask(event,${i})"  src="assets/img/subtask_square.png" alt="Subtasks">
            <span class="subtasknumber"></span> <span class="subtask">${subtask.name} <img class="margin-left" id="deleteimg" onclick="deleteSubTask('${subtask}')" src="assets/img/delete.png"><img id="editimg" onclick="editSubTask('${subtask.name}')" src="assets/img/edit.png"> </span>
        </div>    
        `;
    }
}


/**
 * Renders a list of subtasks for a task.
 * This function loads the tasks, processes the subtasks for the given task, 
 * and updates the corresponding DOM elements to display the subtasks and their progress.
 * @param {Object} task - The task object containing subtasks and other details.
 */
async function renderSubtasks(task) {
    await loadTasks();
    let subtask = task.subtask;
    let taskCount = subtask.length;
    let tasksClicked = await countClickedSubtasks(subtask);
    let id = task.id;
    if (taskCount > 0) {
        document.getElementById(`subtasks${id}`).innerHTML += await /*html*/`
        <div class="subtaskssmall">
            <div><div class="subtaskprogressbar"><div id="subtaskprogressbar${id}"></div></div></div>
            <span>${tasksClicked}/${subtask.length} Subtasks</span>
        </div>    
        `;
        await colorSubtaskProgress(tasksClicked, taskCount, id);
    }
}

/**
 * Colors the subtask progress bar based on the number of clicked subtasks.
 * This function calculates the percentage of clicked subtasks and adjusts 
 * the progress bar width and color accordingly.
 * @param {number} tasksClicked - The number of subtasks that are clicked (completed).
 * @param {number} taskCount - The total count of subtasks.
 * @param {number} id - The task's ID.
 */
async function colorSubtaskProgress(tasksClicked, taskCount, id) {
    let progressBar = document.getElementById(`subtaskprogressbar${id}`);
    let colorPercent = tasksClicked / taskCount * 100;
    progressBar.style.width = `${colorPercent}%`;
    progressBar.style.backgroundColor = '#4589FF';
    progressBar.style.height = '10px';
    progressBar.style.borderRadius = '10px';
}

/**
 * Counts the number of subtasks that are clicked (completed).
 * @param {Array<Object>} subtask - An array of subtask objects.
 */
async function countClickedSubtasks(subtask) {
    let count = 0;
    for (let i = 0; i < subtask.length; i++) {
        let element = subtask[i];
        if (element['clicked'] === 'true') {
            count++;
        }
    }
    return count;
}

function deleteSubTask(subtaskToDelete) {
    
    let index = subtasks.indexOf(subtask => subtask.name == subtaskToDelete.name);
    subtasks.splice(index, 1);
    
    renderSubtask();
}


function editSubTask(subtask) {
    editMode = true;
    subTaskToEdit = subtask;
    
    document.getElementById('addTaskInputSubtask').value = subtask;
}


/**
 * Toggles the completion status of a subtask.
 * This function updates the visual representation of a subtask (square/done sign) 
 * based on user interaction and also updates the task's data to reflect the change.
 * @param {Event} event - The DOM event that triggered the function.
 * @param {number|string} id - The task's ID.
 * @param {number} i - The index of the subtask being toggled.
 * @returns {Promise<void>} A promise that resolves when the subtask's completion status is updated.
 */
async function addDoneSignToSquare(event, id, i) {
    event.stopPropagation();
    await loadTasks();
    let taskIndex = tasks.findIndex(task => task.id.toString() === id.toString());
    let task = tasks[taskIndex];
    let subtask = task['subtask'];
    if (event.target.src.includes("subtask_square.png")) {
        event.target.src = "assets/img/done_white.png";
        subtask[i].clicked = 'true';
    } else {
        event.target.src = "assets/img/subtask_square.png";
        subtask[i].clicked = 'false';
    }
    setItem('tasks', JSON.stringify(tasks));
    
}


async function addDoneSignToSquareAddTask(event,i) {
    event.stopPropagation();
    let subtask = subtasks[i];
    if (event.target.src.includes("subtask_square.png")) {
        event.target.src = "assets/img/done_white.png";
        subtask.clicked = 'true';
    } else {
        event.target.src = "assets/img/subtask_square.png";
        subtask.clicked = 'false';
    }
    
}



/**
 * Renders the subtasks for a task in edit mode.
 * This function processes each subtask for the given task and updates
 * the DOM to display them in a format suitable for editing.
 * @param {Object} task - The task object containing subtasks and other details.
 */
async function renderSubtasksEdit(task) {
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
        document.getElementById(`showSubtasks`).innerHTML += /*html*/`
        <div class="subtasksbig">
        <img class="donesign" onclick="addDoneSignToSquare(event,'${id}',${i})" src="${imgSrc}" alt="Subtasks">
        <span class="subtask">${element['name']}</span> 
    </div>    
        `;
    }
}



function updateSubTask(subTaskToEdit) {
    
    let index = subtasks.findIndex(subtask => subtask.name == subTaskToEdit);
    if (index !== -1) {
        subtasks[index].name = document.getElementById('addTaskInputSubtask').value;
        
        renderSubtask();
        editMode = false;
        document.getElementById('addTaskInputSubtask').value = '';
    } else {
        console.log("Subtask nicht gefunden.");
    }
}