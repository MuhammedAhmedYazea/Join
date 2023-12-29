
/**
 * Allows for dropping an element.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Assigns a new status to the task depending on where it is moved.
 */
function moveTo(category) {
    tasks[currentDraggedElement]['status'] = category;
    updateTaskStatus(currentDraggedElement, category);
    updateHTML();
}

/**
 * Highlights the specified HTML element by adding the 'task-status-container-highlight' class.
 * 
 * @param {string} id - The ID of the HTML element to be highlighted.
 */
function highlight(id) {
    document.getElementById(id).classList.add('task-status-container-highlight');
}

/**
 * Removes the highlight effect by removing the 'task-status-container-highlight' class from 
 * all container IDs except the specified one.
 * 
 * @param {string} id - The ID of the HTML element that should not have the highlight effect removed.
 */
function removeHighlight(id) {
    const containerIds = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    containerIds.forEach(containerId => {
        if (containerId !== id) {
            document.getElementById(containerId).classList.remove('task-status-container-highlight');
        }
    });
}

/**
 * Updates the status of a task when it's moved between categories.
 * @param {number} taskIndex - The index of the task in the 'tasks' list.
 * @param {string} newStatus - The new status of the task.
 */
function updateTaskStatus(taskIndex, newStatus) {
    tasks[taskIndex]['status'] = newStatus;
    setItem('tasks', JSON.stringify(tasks));
}

/**
 * Starts the dragging of an element.
 * @param {number} index - The index of the element to be dragged.
 */
function startDragging(index) {
    currentDraggedElement = index;
}