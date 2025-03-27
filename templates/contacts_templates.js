/**
 * Renders a group of contacts by their starting letter.
 *
 * @param {string} letter - The starting letter of the contact group.
 * @param {Array} contactList - The list of contacts belonging to this group.
 * @param {Object} contactList[].id - The unique identifier of the contact.
 * @param {Object} contactList[].name - The name of the contact.
 * @param {Object} contactList[].email - The email of the contact.
 * @param {Object} contactList[].phone - The phone number of the contact.
 * @param {Object} contactList[].avatar - The avatar details of the contact.
 * @param {string} contactList[].avatar.initials - The initials displayed in the avatar.
 * @param {string} contactList[].avatar.color - The background color of the avatar.
 * @returns {string} The HTML string for the contact group.
 */
function renderContactGroup(letter, contactList) {
    return `
        <div class="contact-group">
            <h2>${letter}</h2>
            <hr>
            ${contactList.map(contact => renderContact(contact)).join('')}
        </div>
    `;
}


function renderContact(contact) {
    const avatar = contact.avatar?.image?.[0]?.base64
        ? `<img src="${contact.avatar.image[0].base64}" alt="Profilbild" class="profil-image-list profil-object">`
        : `<span class="avatar" style="background-color:${contact.avatar.color};">${contact.avatar.initials}</span>`;
    return `
        <div class="contact" onclick="showContactDetails('${contact.id}')">
            ${avatar}
            <div class="contact-info">
                <span class="name">${contact.name}</span>
                <span class="email">${contact.email}</span>
            </div>
        </div>
    `;
}