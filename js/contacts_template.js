/**
 * Creates an HTML template representing a header with a given letter.
 * 
 * @param {string} letter - The letter to be displayed in the header.
 * @returns {string} An HTML template of the header with the given letter.
 */
function createLetterHeader(letter) {
    return `
        <div class="contact-container">
            <div class="contactheader">
                <h1 id="letter">${letter}</h1>
            </div>
        </div>
    `;
}

/**
 * Creates an HTML template for a contact with name, mail, and visual identifiers.
 * 
 * @param {number} index - The index or ID of the contact.
 * @param {Object} contact - The contact object containing name and mail.
 * @param {string} randomColor - The background color for the contact's visual representation.
 * @param {string} secondLetter - The second initial of the contact's name.
 * @returns {string} An HTML template representing the specified contact.
 */
function createContact(index, contact, randomColor, secondLetter) {
    const name = contact.name;
    const mail = contact.mail;
    return `
        <div class="contact-container">
            <div id="contactNumber${index}"onclick="showContact(${index},'${randomColor}','${secondLetter}')" class="contact">
                <div class="imgcontainer" style="background-color: ${randomColor};">
                    <span id="firstLetter">${name.charAt(0).toUpperCase()}</span>
                    <span id="secondLetter">${secondLetter}</span>
                </div>
                <div class="contactinfo">
                    <span id="name">${name}</span>
                    <a href="#" id="email">${mail}</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates detailed HTML representation for a contact.
 * 
 * @param {number} i - The index or ID of the contact.
 * @param {Object} contact - The contact object containing name, mail, and phone.
 * @param {string} randomColor - The background color for the contact's visual representation.
 * @param {string} firstLetter - The first initial of the contact's name.
 * @param {string} secondLetter - The second initial of the contact's name.
 * @returns {string} An HTML template for detailed view of the specified contact.
 */
function createContactInfoHTML(i, contact, randomColor, firstLetter, secondLetter) {
    return `
        <div class="headinfo">
            <div id="bigContactImg" class="bigcontactimg" style="background-color: ${randomColor};">
                <span id="firstLetter">${firstLetter}</span>
                <span id="secondLetter">${secondLetter}</span>
            </div>
            <div class="name-and-editbutton"> 
                <span id="bigName">${contact['name']}</span> 
                <img onclick="createTaskForContact('${contact["name"]}')" id="blueAddTask" src="assets/img/addtaskblue.png">
            </div>
        </div>
        <div class="contactinfobig">
            <div class="contactinfoedit">
                <span>Contact Information:</span>
                <img onclick="editContact(${i},'${firstLetter}','${secondLetter}','${randomColor}')" id="editContactsImg" src="assets/img/editcontacts.png">
            </div>
            <div  class="contactmailbig">
                <span><b>Email</b></span>
                <a id="emailbig" href="mailto:${contact['mail']}">${contact['mail']}</a>
            </div>
            <div class="contactphonebig">
                <span><b>Phone</b></span>
                <a>${contact['phone']}</a>
            </div>
        </div>
    `;
}

/**
 * Creates an HTML template with buttons for editing contact operations.
 * 
 * @param {number} i - The index or ID of the contact.
 * @returns {string} An HTML template with edit operation buttons for the specified contact.
 */
function createEditContactButtonsHTML(i) {
    return `
        <button onclick="deleteContact(${i})" class="cancel-btn">Delete</button>
        <button onclick="saveContact(${i})" class="create-btn">Save</button>
        <button onclick="closeEditContact(${i})" class="cancel-btn" >Close</button>
        <span id="addedToBoard" class="addedTaskToBoard_content">Contact Added <img class="board"
            src="assets/img/board_img.png" alt="board"></span>
    `;
}
