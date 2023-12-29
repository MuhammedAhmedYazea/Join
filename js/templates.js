
/**
 * Generates an HTML template for a given task.
 * @param {Object} task - The task object containing details like id, category, name, tasktext, and priority.
 * @returns {string} An HTML template representing the task.
 */
async function taskTemplate(task) {
    return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${task['id']})" onclick="handleTaskClick(${task['id']})" class="content">
            <div style="background-color: ${task['categoryBackgroundColor']}" class="category">${task['category']}</div>
            <div class="taskdescription"><b>${task['name']}</b></div>
            <div class="subtaskdescription"><div id="subtasks${task['id']}"></div></div>
            <div class="tasktext">${task['tasktext']}</div>
            <div class="progresscontainer">
                <div class="taskfooter">
                    <div class="usersintaks" id="usersInTask${task['id']}"></div>
                    <div class="priority">
                        <img src="${task['priority']}">
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates an HTML template for a user's initials with a given background color.
 * 
 * @param {string} randomColor - The background color for the user's initials container.
 * @param {string} firstLetter - The first initial of the user.
 * @param {string} secondLetter - The second initial of the user.
 * @returns {string} An HTML template representing the user's initials with the specified background.
 */
async function taskUserTemplate(randomColor, firstLetter, secondLetter) {
    return /*html*/ `<div class="contact-container">
        <div class="imgcontainer" style="background-color: ${randomColor};">
            <span id="firstLetter">${firstLetter}</span>
            <span id="secondLetter">${secondLetter}</span>
        </div>
    </div>`;
}


/**
 * Generates an HTML template for a user, displaying their initials with a given background color and their full name.
 * 
 * @param {string} randomColor - The background color for the user's initials container.
 * @param {string} firstLetter - The first initial of the user.
 * @param {string} secondLetter - The second initial of the user.
 * @param {string[]} nameParts - An array containing parts of the user's name.
 * @returns {string} An HTML template representing the user with initials and full name.
 */
function createUserHTML(randomColor, firstLetter, secondLetter, nameParts) {
    return `
        <div class="imgcontainer" style="background-color: ${randomColor};">
            <span id="firstLetter">${firstLetter}</span>
            <span id="secondLetter">${secondLetter}</span>
        </div>
        <div class="name">${nameParts.join(' ')}</div>
    `;
}

/**
 * Generates detailed HTML representation for a specific task based on its index in the 'tasks' array.
 * 
 * @param {number} index - The index of the task in the 'tasks' array.
 * @returns {Promise<string>} An HTML template representing the detailed view of the specified task.
 */
async function generateTaskDetailsHTML(index) {
    let task = tasks[index];
    return /*html*/ `
        <div class="bigtask" id="task${index}">
            <div class="taskheader">
                <div style="background-color: ${task['categoryBackgroundColor']}" class="category">${task['category']}</div>
                <div onclick="closeTask()"><img id="closeimg" src="assets/img/close.png"></div>
            </div>
            <div id="taskNameHeader" class="taskdescriptionbig"><b>${task['name']}</b></div>
            <div class="subtaskdescription"><div class="subtasksbigwrapper" id="subtasksbig${task.id}"></div></div>
            <div class="tasktext">${task['tasktext']}</div>
            <div class="datecontainer">
                <span><b>Due date:</b></span>
                <div class="date">${task['date']}</div>
            </div>
            <div class="prioritycontainer">
                <span><b>Priority:</b></span>
                <div id="colorPrioBigTask" class="prioritybigtask">
                    <span id="prioBigTask"></span>
                    <div id="urgencyImg"></div>
                </div>
            </div>
            <div class="bigtaskusers">
                <span><b>Assigned To:</b></span>
                <div id="usersInOpenTask${task.id}" class="users"></div>
            </div>
            <div class="buttoncontainer">
                <img id="deleteimg" onclick="deleteTask(${index})" src="assets/img/delete.png">
                <img id="editimg" onclick="editTask(${index})" src="assets/img/edit.png">
            </div>
        </div>
    `;
}


/**
 * Displays a modal for editing a task's details in a responsive manner.
 * 
 * @param {number} taskId - The ID of the task to be edited.
 */
function editTaskResponsive(taskId) {
    let index = tasks.findIndex(task => task.id === taskId);
    let task = tasks[index];
    let modalContent = /*html*/ `
        <div id="editTaskModal" class="edit-task-popup">
            <div class="modal-content">
                <span class="edit-task-popup-header" id="taskNameHeader">${task['name']}</span>
                <div class="edit-task-popup-buttons">
                <span class="edit-task-popup-header-category">Change Status</span>
                    <button class="edit-task-popup-button-style-top" onclick="editTaskStatus(${index}, 'toDo')">To Do</button>
                    <button class="edit-task-popup-button-style-top" onclick="editTaskStatus(${index}, 'inProgress')">In Progress</button>
                    <button class="edit-task-popup-button-style-top" onclick="editTaskStatus(${index}, 'awaitingFeedback')">Awaiting Feedback</button>
                    <button class="edit-task-popup-button-style-top" onclick="editTaskStatus(${index}, 'done')">Done</button>
                    <span class="edit-task-popup-header-category">Task</span>
                    <div class="editandclosebottom">
                    <button class="edit-task-popup-button-style" onclick="openTask(${index})">Show Task</button>
                    <button class="edit-task-popup-button-style" onclick="editTask(${index})">Edit Task</button>
                    <img class="closeimgpopup-edit" src="assets/img/add_task_cancel.png" alt="cancel" onclick="closeEditTaskModal(${index})">
                </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('showTask').innerHTML = modalContent;
    document.getElementById('showTask').classList.remove('d-none');
}


/**
 * Renders the popup content for adding a task.
 * @param {Object} popup - The DOM object for the popup element.
 */
async function renderPopUp(popup) {
    selectedUsers = [];
    await setItem('selectedUsers', JSON.stringify(selectedUsers));
    popup.innerHTML = /*html*/ `
        <div class="popup-background" onclick="closePopup()">
            <div class="popup-content" onclick="doNotClose(event)">
                <div class="projectheader_popUp">
                    <img class="join-logo-mobile-header" src="assets/img/logo_dark.png" alt="logo_dark">
                </div>
                <div class="headline_h1_cancel">
                    <h1 id="addTaskHeaderText" class="add_task_h1">Add Task</h1>
                    <img class="closeimgpopup" src="assets/img/add_task_cancel.png" alt="cancel" onclick="closePopup()">
                </div>
                <div class="add_task_container"> 
                    <form class="add_task_left">
                        <div class="title fd_column">
                            <span>Title*</span>
                            <input class="task_input_field_styling" type="text" placeholder="Enter a title" id="addTaskTitle" required>
                        </div>
                        <div class="description fd_column">
                            <span>Description*</span>
                            <textarea class="task_input_field_styling" name="description" id="addTaskDescription" cols="30" rows="5" placeholder="Enter a description" required></textarea>
                        </div>
                        <div class=" fd_column">
                            <span>Category*</span>
                            <div class="category-select-down">
                                <div class="task_input_field_styling dropdown" onclick="openDropdownMenu()" id="dropdown">Select category</div>
                                <img class="category-down" onclick="openDropdownMenu()" src="assets/img/category-down.svg" alt="">
                            </div>
                            <ul class="task_input_field_styling dropdown-content" id="addTaskCategorySelect">
                                <li onclick="handleCategoryChange(this)">New category</li>
                                <li onclick="clearCategories()">Clear Cateories</li>
                            </ul>
                        </div>
                        <span id="assignto">Assign to*</span>
                        <div id="selectInnerUser" class="assign fd_column selectInnerUser">
                        </div>  
                    </div>
                </form>
                <div class="seperator fd_column"></div>
                <form type="submit" class="add_task_right">
                    <div class="date fd_column">
                        <span>Due date*</span>
                        <input class="task_input_field_styling" type="date" name="" id="addTaskInputDate" required >
                    </div>
                    <div class="prio fd_column">
                        <span>Prio*</span>
                        <span id="prioalert" class="priowarning d-none" >Choose the priority !!</span>
                        <div class="prio-btns-container">
                            <div onclick="getTaskPrio('urgent')" id="prioUrgent" class="prio-btn">Urgent <img  src="./assets/img/urgent_prio.png" alt="urgent"></div>
                            <div onclick="getTaskPrio('medium')" id="prioMedium" class="prio-btn">Medium <img  src="assets/img/medium_prio.png" alt="medium"></div>
                            <div onclick="getTaskPrio('low')" id="prioLow" class="prio-btn">Low <img  src="assets/img/low_prio.png" alt="low"></div>
                        </div>
                        <div class="subtasks fd_column">
                            <div>
                    <span>Subtasks</span>
                    <div class="subtask_container">
                        <input class="task_input_field_styling" type="text" name="" id="addTaskInputSubtask"
                            maxlength="30" placeholder="Add new subtask"><img class="subtask_plus"
                            onclick="addNewSubtask()" src="assets/img/subtask_plus.png" alt="add Subtask">
                    </div>
</div>
                    <div class="show-subtasks" id="showSubtasks">
                    </div>
                </div>
            </form>
        </div>
            <div class="buttons-clear-create">
                <div class="clear-btn btn" onclick="clearTaskBut(event)">Clear <img src="assets/img/add_task_cancel.png" alt="check"></div>
                <div id="buttonEdit" class="create-btn btn" type="submit" onclick="addTaskWithPopup(event)">Create Task <img src="assets/img/add_task_check.png" alt="cancel"></div>
            </div>
            <div class="buttons-clear-create" id="buttonAfterEdit"> 
            </div>
            <div class="animation-addedToBoard">
                <span class="addedTaskToBoard_content">Task added to board <img class="board" src="assets/img/board_img.png" alt="board"></span>
            </div>
        </div>
    `;
}



