
let users;
let currentUser;
let rememberedUser = [];

/**
 * @const {string} STORAGE_TOKEN - Token for storage.
 * @const {string} STORAGE_URL - URL for the storage.
 */
const STORAGE_TOKEN = '9DSY3OMJBPC4FF2QNS6I226NK6HRNQV27XWIWUO8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Add a user to the 'users' array and updates the remote storage.
 * The user's data is obtained from form input fields.
 */
async function addUser() {
    registerBtn.disabled = true;
    let userName = document.getElementById('username').value;
    let userMail = document.getElementById('usermail').value;
    let userPassword = document.getElementById('userpassword').value;
    users.push({
        username: userName,
        mail: userMail,
        password: userPassword,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    hideSignup();
}

/**
 * Hides the sign-up form.
 */
function hideSignup() {
    document.getElementById('showsignup').classList.remove('hidesignupsuccess');
    document.getElementById('hidesignup').classList.add('hidesignupsuccess');
}

/**
 * Opens the summary page.
 */
function openWindow() {
    window.open('summary.html', '_self');
}

/**
 * Opens the index page.
 */
function openWindowIndex() {
    loginAfterSignup();
}

/**
 * Logs in a guest user and opens the summary page.
 */
function loginGuest() {
    currentUser = { username: 'Guest' };
    setItem('currentUser', JSON.stringify(currentUser));
    window.open('summary.html', '_self');
}
/**
 * Initializes the application by loading the users.
 */
async function init() {
    loadUsers();
    loadRememberedUser();
}

async function initSignUp() {
    loadUsers();
}


/**
 * Loads the users from remote storage and parses them into the 'users' array.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users')) || [];
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Resets the form fields and re-enables the register button.
 */
function resetForm() {
    registerBtn.disabled = false;
    document.getElementById('username').value = '';
    document.getElementById('usermail').value = '';
    document.getElementById('userpassword').value = '';
}

/**
 * Authenticates a user based on email and password.
 * If the authentication is successful, it sets the 'currentUser' variable and opens the summary page.
 * If the authentication fails, it displays an error message.
 * @param {Event} event - The form submission event.
 */
async function login(event) {
    event.preventDefault();
    let mail = document.getElementById('inputmail').value;
    let password = document.getElementById('inputpassword').value;
    let user = users.find(u => u.mail == mail && u.password == password);
    let userIndex = users.findIndex(u => u.mail == mail && u.password == password);
    if (user) {
        currentUser = users[userIndex].username;
        await setItem('currentUser', JSON.stringify(currentUser));
        openWindow();
    } else {
        document.getElementById('wrongpassword').innerHTML = `Wrong E-mail or Password !`;
    }
}


/**
 *  Automatically move forward to the Summary page after signing up.    
 */
async function loginAfterSignup() {
    let user = users[users.length - 1];
    currentUser = user.username;
    await setItem('currentUser', JSON.stringify(currentUser));
    openWindow();
}

/**
 * Stores a value with a given key in the remote storage.
 * @param {string} key - The key under which the value is stored.
 * @param {string} value - The value to be stored.
 * @returns {Promise} A promise that resolves to the response of the fetch request.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves a value from the remote storage with a given key.
 * @param {string} key - The key of the value to be retrieved.
 * @returns {Promise} A promise that resolves to the value retrieved.
 * @throws Will throw an error if the key is not found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * 
 * Saves the User for the next Login on the same device.
 */
function rememberUser() {
    rememberedUserMail = document.getElementById('inputmail').value;
    rememberedUserPassword = document.getElementById('inputpassword').value;
    rememberedUser.push({
        mail: rememberedUserMail,
        password: rememberedUserPassword,
    });
    localStorage.setItem('rememberedUser', JSON.stringify(rememberedUser));
}


/**
 * 
 * Loads the saved User for a more comfortable Login.
 */
function loadRememberedUser() {
    let storedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (storedUser != null) {
        let lastStoredUser = storedUser[storedUser.length - 1];
        document.getElementById('inputmail').value = lastStoredUser.mail;
        document.getElementById('inputpassword').value = lastStoredUser.password;
        document.getElementById('checkbox').checked = true;
    }
}