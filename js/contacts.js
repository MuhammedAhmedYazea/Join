let colorIndex = 0;
/**
 * Collects the input values, pushes a new contact to the list and saves the list in the local storage.
 * Notifies the user about the added contact and re-renders the contact list.
 */
async function addContact() {
    let ContactName = document.getElementById('contactName').value;
    let ContactMail = document.getElementById('contactMail').value;
    let ContactPhone = document.getElementById('contactPhone').value;
    let contactColor = await getRandomColor();
    contacts.push({
        name: ContactName,
        mail: ContactMail,
        phone: ContactPhone,
        color: contactColor,
    });
    await setItem('contacts', JSON.stringify(contacts));
    await renderContacts();
    document.getElementById('addedToBoard').style.zIndex = "1500";
    await taskAddedToBoard();
    setTimeout(closeAddContact, 1000);

};

/**
 * Sorts the global contacts array in alphabetical order based on contact names.
 * This function assumes that `loadContacts` has been defined elsewhere in the code 
 * and that it fetches and updates the global contacts array.
 *
 * @async
 * @returns {Promise<void>}
 */
async function sortContactsAlphabetically() {
    await loadContacts();
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Renders the list of contacts alphabetically in the 'contactList' DOM element.
 * The function categorizes contacts based on the first letter of their names and 
 * creates headers for each group of contacts starting with the same letter.
 * This function assumes the existence of a global contacts array and the helper functions 
 * `createLetterHeader` and `createContact`.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function renderContacts() {
    await sortContactsAlphabetically();
    let currentLetter = '';
    document.getElementById('contactList').innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact['name'].charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            document.getElementById('contactList').innerHTML += createLetterHeader(currentLetter);
        }
        let secondLetter = '';
        secondLetter = await getSecondLetter(contact);
        let randomColor = contact.color;
        contact.color = randomColor;
        document.getElementById('contactList').innerHTML += await createContact(i, contact, randomColor, secondLetter);
    }
}


/**
 * Retrieves the first letter of the second word in a contact's name.
 * This function splits the contact's name by space and, if a second word exists,
 * returns the first letter of that word in uppercase. If a second word doesn't exist,
 * the function may return an undefined value.
 * 
 */
async function getSecondLetter(contact) {
    let nameParts = contact['name'].split(' ');
    let secondLetter;
    if (nameParts.length > 1 && nameParts[1].length > 0) {
        secondLetter = nameParts[1].charAt(0).toUpperCase();
        return secondLetter;
    } else {
        return "";
    }
   
}

/**
 * Creates a Task for a Contact with specific name.
 */
async function createTaskForContact(name) {
    localStorage.setItem('contactName', name);
    window.open('add_task.html', '_self');
}
/**
 * Shows a notification about the added contact.
 */
function taskAddedToBoard() {
    const container = document.querySelector('.addedTaskToBoard_content');
    container.classList.add('show');
    setTimeout(() => {
        container.classList.remove('show');
    }, 1000);
}

/**
 * Shows the selected contact details.
 * @param {number} i - The index of the selected contact in the 'contacts' list.
 * @param {string} randomColor - The background color of the contact avatar.
 * @param {string} secondLetter - The second letter in the contact avatar.
 */
async function showContact(i, randomColor, secondLetter) {
    removeContactBorder();
    document.getElementById('contactNumber'+ i).classList.add('contactBorder');
    const contact = contacts[i];
    const firstLetter = contact['name'].charAt(0).toUpperCase();
    const contactInfoHTML = await createContactInfoHTML(i, contact, randomColor, firstLetter, secondLetter);
    document.getElementById('showContact').innerHTML = contactInfoHTML;
    if (window.matchMedia("(max-width: 800px)").matches) {
        document.getElementById('contactInfo').classList.add('d-flex');
    }
}



function removeContactBorder() {
    let elementsWithContactBorder = document.querySelectorAll('.contactBorder');
    elementsWithContactBorder.forEach(element => {
        element.classList.remove('contactBorder');
    })
}

function closeBigContact() {
    document.getElementById('contactInfo').classList.remove('d-flex');
}

/**
 * Opens the edit contact form and fills in the current values.
 * @param {number} i - The index of the contact to be edited in the 'contacts' list.
 * @param {string} firstLetter - The first letter in the contact avatar.
 * @param {string} secondLetter - The second letter in the contact avatar.
 * @param {string} randomColor - The background color of the contact avatar.
 */
function editContact(i, firstLetter, secondLetter, randomColor) {
    const contact = contacts[i];
    openEditContact();
    document.getElementById('contactNameEdit').value = contact.name;
    document.getElementById('contactMailEdit').value = contact.mail;
    document.getElementById('contactPhoneEdit').value = contact.phone;
    document.getElementById('imgAddContactEdit').innerHTML = ` 
    <span id="firstLetter">${firstLetter}</span>
     <span id="secondLetter">${secondLetter}</span>`;
    document.getElementById('imgAddContactEdit').style.backgroundColor = `${randomColor}`;
    document.getElementById('editButtons').innerHTML = document.getElementById('editButtons').innerHTML = createEditContactButtonsHTML(i);  // HTML AUSGELAGERT IN CONTACTS TEMPLATE
}

/**
 * Updates the contact values and saves the updated list in the local storage.
 * Re-renders the contact list and closes the edit form.
 * @param {number} i - The index of the contact to be updated in the 'contacts' list.
 * @returns {Promise<void>}
 */
async function saveContact(i) {
    let contact = contacts[i];
    let ContactName = document.getElementById('contactNameEdit').value;
    let ContactMail = document.getElementById('contactMailEdit').value;
    let ContactPhone = document.getElementById('contactPhoneEdit').value;
    contact.name = ContactName;
    contact.mail = ContactMail;
    contact.phone = ContactPhone;
    randomColor = contact.color;
    secondLetter = await getSecondLetter(contact);
    await setItem('contacts', JSON.stringify(contacts));
    await renderContacts();
    setTimeout(closeEditContact, 500);
    showContact(i, randomColor, secondLetter);
};

/**
 * Deletes the contact and saves the updated list in the local storage.
 * Re-renders the contact list and closes the edit form.
 * @param {number} i - The index of the contact to be deleted in the 'contacts' list.
 * @returns {Promise<void>}
 */
async function deleteContact(i) {
    contacts.splice(i, 1);
    await setItem('contacts', JSON.stringify(contacts));
    await renderContacts();
    closeEditContact();
    document.getElementById('showContact').innerHTML = ``;
}

/**
 * Opens the add contact form.
 */
function openAddContact() {
    document.getElementById('modalOne').classList.remove('d-none');

}

/**
 * Opens the edit contact form.
 */
function openEditContact() {
    document.getElementById('modalOneEdit').classList.remove('d-none');

}


/**
 * Closes the edit contact form.
 */
function closeEditContact() {
    document.getElementById('modalOneEdit').classList.add('d-none');

}

/**
 * Closes the add contact form.
 */
function closeAddContact() {
    document.getElementById('modalOne').classList.add('d-none');

}

/**
 * Loads the contact list from the local storage.
 * @returns {Promise<void>}
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);

    }
}



/**
 * Returns a random integer between the given minimum and maximum values.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random RGB color.
 * @returns {string} - A random RGB color.
 */
async function getRandomColor() {
    const colors = [
        'rgb(1, 144, 224)',
        'rgb(255, 92, 0)',
        'rgb(238, 0, 214)',
        'rgb(2, 207, 47)',
        'rgb(147, 39, 255)',
        'rgb(78, 150, 61)',
        'rgb(50, 218, 255)',
        'rgb(0, 124, 238)',
        'rgb(217, 84, 45)',
        'rgb(140, 35, 158)',
        'rgb(0, 197, 204)',
        'rgb(129, 195, 46)',
        'rgb(30, 170, 220)',
        'rgb(71, 134, 55)',
        'rgb(250, 120, 170)',
        'rgb(180, 0, 100)',
        'rgb(27, 182, 47)',
        'rgb(240, 170, 0)',
        'rgb(1, 98, 177)',
        'rgb(245, 235, 0)'
    ];
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
   let color = colors[colorIndex];
    colorIndex++;
    return color;
}
