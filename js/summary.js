/**
 * Updates the summary page.
 */
async function updateSummary() {
    await loadTasks();
    updateTaskCount();
    updateTasksCountByStatus('toDo', 'toDoNumber');
    updateTasksCountByStatus('done', 'doneNumber');
    updateTasksCountByStatus('inProgress', 'tasksInProgressNumber');
    updateTasksCountByStatus('awaitingFeedback', 'awaitFeedbackNumber');
    updateTasksUrgent();
    updateUrgentDate();
}

/**
 * Counts the number of tasks and displays the count in the 'tasksInBoardNumber' element.
 */
function updateTaskCount() {
    const taskCount = tasks.length;
    const taskCountElement = document.getElementById('tasksInBoardNumber');
    taskCountElement.textContent = taskCount.toString();
}

/**
 * Updates the count of tasks based on their status.
 * @param {string} status - The status of the tasks to be updated (e.g., 'todo', 'done', etc.).
 * @param {string} documentId - The ID of the HTML element where the task count will be displayed.
 */
function updateTasksCountByStatus(status, documentId) {
    const tasksFiltered = tasks.filter((task) => task.status === status);
    const taskCountElement = document.getElementById(documentId);
    if (taskCountElement) {
        taskCountElement.textContent = tasksFiltered.length.toString();
    }
}

/**
 * Updates the count of urgent tasks.
 */
function updateTasksUrgent() {
    const tasksUrgent = tasks.filter((task) => task.priority === 'assets/img/priohigh.png');
    const tasksUrgentNumberElement = document.getElementById('urgentNumber');
    if (tasksUrgentNumberElement) {
        tasksUrgentNumberElement.textContent = tasksUrgent.length.toString();
    }
}

/**
 * Updates the closest date for urgent tasks.
 */
function updateUrgentDate() {
    const urgentDateElement = document.getElementById('urgentDate');
    const closestDate = findClosestDate();
    if (closestDate) {
        urgentDateElement.textContent = closestDate;
    } else {
        urgentDateElement.textContent = 'No urgent tasks';
    }
}

/**
 * Finds the closest date from the list of tasks.
 * @returns {string | null} - The formatted closest date or null if there are no tasks.
 */
function findClosestDate() {
    if (tasks.length > 0) { // If there are tasks
        let closestDate = null;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].priority === 'assets/img/priohigh.png' && tasks[i].date && (closestDate === null || tasks[i].date < closestDate)) {
                closestDate = tasks[i].date;
            }
        }
        return closestDate ? formatDate(closestDate) : null; // If there's a closest date, format and return it. If not, return null
    }
    return null;
}

/**
 * Formats a date into the format "Month Day, Year".
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date in the "Month Day, Year" format.
 */
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}