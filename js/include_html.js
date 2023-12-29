/**
 * This function is used to load HTML content from different files and include it into the current page.
 * Once all content has been fetched and included, it calls a callback function.
 *
 * @param {Function} callback - The callback function to be executed once all includes are loaded.
 * @returns {Promise<void>} Returns a promise that resolves when all the fetch requests have been completed.
 */
async function includeHTML(callback) {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    let promises = [];
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html"); 
        let promise = fetch(file)
            .then(resp => {
                if (resp.ok) {
                    return resp.text();
                } else {
                    throw new Error('Page not found');
                }
            })
            .then(text => {
                element.innerHTML = text;
            });
        promises.push(promise);
    }
    await Promise.all(promises);
    callback();
}
