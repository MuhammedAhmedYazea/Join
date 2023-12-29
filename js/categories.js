const CATEGORY_TOKEN = 'AJC71697BN5LXRUJOR4Z45CDA2LKLEYJQ7ZWLVNX';
const CATEGORY_URL = 'https://remote-storage.developerakademie.org/item';
let currentCategory;
let currentColorOfCategory;
let allCategories = [];

loadNewCategory();

/**
* Checkes if the field "new category" is selected
 */
function handleCategoryChange(liElement) {
    if (liElement.textContent === 'New category') {
        addNewCategory();
    }
}

/**
 * Opens a popup to let the user give a name to a new category and subsequently fills in the new category.
 */
function addNewCategory() {
    const newCategoryDiv = document.createElement('div');
    newCategoryDiv.className = 'new-category-popup';
    newCategoryDiv.innerHTML = '<input class="task_input_field_styling_popup" type="text" max-length="15" id="newCategoryInput" placeholder="Enter new category"><button class="btn create-btnpopup" onclick="submitNewCategory()">Submit</button><img class="closeimgpopup2" onclick="closeCategoryPopup()" src="./assets/img/close.png">';
    document.body.appendChild(newCategoryDiv);
}

/**
 * Creates a new category based on the input value, updates the category list, and closes the popup upon clicking the submit button.
 */
function submitNewCategory() {
    const newCategory = document.getElementById('newCategoryInput').value;
    const newLi = document.getElementById('addTaskCategorySelect');
    currentCategory = newCategory;
    setColorForNewCategory(newLi);
    newLi.innerHTML += /*html*/`
        <li class="liElement" onclick="closeDropdown(this)">${newCategory}<div style="background-color: ${currentColorOfCategory}" class="color_dot"></div></li>`;
    const popup = document.querySelector('.new-category-popup');
    document.body.removeChild(popup);
    saveNewCategory(newCategory, currentColorOfCategory);
}

/**
 * Sets a random color for a new category.
 */
function setColorForNewCategory() {
    let newColor = getRandomColorDot();
    currentColorOfCategory = newColor;
}

/**
 * Generates a random hexadecimal color.
 * @returns {string} - The generated color in hexadecimal format.
 */
function getRandomColorDot() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Asynchronously saves a new category and its color.
 * @param {string} newCategory - The name of the new category.
 * @param {string} currentColorOfCategory - The color associated with the new category.
 */
async function saveNewCategory(newCategory, currentColorOfCategory) {
    let categoriesAndColors = {
        'createdCategories': newCategory,
        'createdColors': currentColorOfCategory
    };

    allCategories.push(categoriesAndColors);
    await saveCategories();
}

/**
 * Asynchronously loads a new category and its color.
 * @param {string} newCategory - The name of the new category.
 * @param {string} currentColorOfCategory - The color associated with the new category.
 */
async function loadNewCategory(newCategory, currentColorOfCategory) {

    const createdCategoriesResponse = await getItemCategory('createdCategories');
    const createdColorsResponse = await getItemCategory('createdColors');
    if (createdCategoriesResponse && createdColorsResponse) {
        newCategory = createdCategoriesResponse.value;
        currentColorOfCategory = createdColorsResponse.value;
    }
}

/**
 * Asynchronously loads the Categories and shows them in the category selection when adding a task.
 */
async function showCategories() {
    await loadCategories();
    let categoryselection = document.getElementById('addTaskCategorySelect');
    categoryselection.innerHTML = `<li class="liElement" onclick="handleCategoryChange(this)">New category</li> <li  class="liElement" onclick="clearCategories()">Clear Cateories</li>`;
    for (let i = 0; i < allCategories.length; i++) {
        const category = allCategories[i]['createdCategories'];
        const colorDot = allCategories[i]['createdColors'];
        categoryselection.innerHTML += await /*html*/`
            <li onclick="closeDropdown(this)" class="liElement">${category} 
                <div style="background-color: ${colorDot}" class="color_dot"></div>
            </li>  
        `;
    }
}

/**
 * Asynchronously sets the current category and its associated color.
 * @param {string} category - The name of the current category.
 * @param {string} colorDot - The color associated with the current category.
 */
async function setCurrentCategory(category, colorDot) {
    currentCategory = category;
    currentColorOfCategory = colorDot;
    await setItem('currentCategory', JSON.stringify(currentCategory));
    await setItem('currentColorOfCategory', JSON.stringify(currentColorOfCategory));
    await closeDropdown();
}

/**
 * Asynchronously sends a POST request to set a new category.
 * @param {string} key - The key to identify the category.
 * @param {string} value - The value of the category.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function setItemCategory(key, value) {
    const payload = { key, value, token: CATEGORY_TOKEN };
    return fetch(CATEGORY_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * Asynchronously fetches a category item based on the provided key from the server.
 * @param {string} key - The key to identify the category item.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function getItemCategory(key) {
    const url = `${CATEGORY_URL}?key=${key}&token=${CATEGORY_TOKEN}`;
    return fetch(url).then(res => res.json());
}


/**
 * Loads the categories and opens the dropdown menu when selecting categories.
 */
async function openDropdownMenu() {
    await loadCategories();
    let dropdownMenu = document.getElementById('addTaskCategorySelect');
    dropdownMenu.classList.toggle('d-block');
    let dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('border-radius');
    await showCategories();
}

/**
 * Closes the dropdown menu when selecting categories.
 */
function closeDropdown(liElement) {
    let dropdownMenu = document.getElementById('addTaskCategorySelect');
    dropdownMenu.classList.remove('d-block');
    let dropdown = document.getElementById('dropdown');
    dropdown.classList.remove('border-radius');
    readNameOfCategoryInBoard(liElement);
    renderSelectedCategoryInCategoryfield(liElement);
}

/**
 * Reads the name of the selected category from the UI element and sets it as the current category.
 * @param {HTMLElement} liElement - The list item element containing the category name.
 */
function readNameOfCategoryInBoard(liElement) {
    if (liElement.textContent === 'New category') {
        addNewCategory();
    } else {
        let selectedCategory = liElement.textContent;
        currentCategory = selectedCategory;
    }
}

/**
 * Renders the selected category and its color in the dropdown UI.
 * @param {HTMLElement} liElement - The list item element containing the category name and color.
 */
function renderSelectedCategoryInCategoryfield(liElement) {
    let selectedCategory = document.getElementById('dropdown');
    let selectedColor = liElement.querySelector('.color_dot').style.backgroundColor;
    selectedCategory.innerHTML = /*html*/`
        <li class="liElement">${currentCategory} 
            <div style="background-color: ${selectedColor}" class="color_dot"></div>
        </li> 
    `;
    currentColorOfCategory = selectedColor;
}

/**
 * Closes the category creation popup by removing it from the DOM.
 */
function closeCategoryPopup() {
    const popup = document.querySelector('.new-category-popup');
    document.body.removeChild(popup);
}

/**
 * Asynchronously saves all categories to local storage.
 */
async function saveCategories() {
    await setItem('allCategories', JSON.stringify(allCategories));
}

/**
 * Asynchronously loads all categories from local storage.
 */
async function loadCategories() {
    try {
        allCategories = JSON.parse(await getItem('allCategories'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Clears all categories from local storage and updates the UI.
 */
function clearCategories() {
    allCategories = [];
    saveCategories();
    showCategories();
}

