let avatar = {};

/**
 * Check if the contact has a valid name.
 * @param {string} name - The name to validate.
*/
function isValidContactName(name) {
    return name && typeof name === 'string';
}

/**
 * Get the first letter of a name in uppercase.
 * @param {string} name - The name to process.
*/
function getFirstLetter(name) {
    return name[0].toUpperCase();
}

/**
 * Compare two contact names alphabetically.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
*/
function compareNames(a, b) {
    return a.name.localeCompare(b.name);
}

/**
 * Displays the details of a contact.
 * @param {string} contactId - The ID of the contact to be displayed.
*/
function showContactDetails(contactId) {
    let user = allContacts[contactId];
    if (!user) {
        return;
    }
    selectContact(user);
    toggleContactListVisibility();
    updateContactDetails(user, contactId);
}

/**
 * Toggle the visibility of the contact list for smaller screens.
*/
function toggleContactListVisibility() {
    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.close-btn').style.display = 'block';
    }
}

/**
 * Updates the contact details on the page.
 * @param {Object} user - The contact object with the data to be updated.
 * @param {string} contactId - The ID of the contact.
*/
function updateContactDetails(user, contactId) {
    currentContact = {name: user.name, email: user.email, phone: user.phone, initials: user.avatar.initials, color: user.avatar.color, avatarImage: user.avatar.image?.[0]?.base64 || null};
    const avatarElement = document.querySelector('.contact-avatar');
    const contactDetails = document.getElementById('contact-details');    
    if (currentContact.avatarImage) {
        avatarElement.innerHTML = `<img src="${currentContact.avatarImage}" alt="Profilbild" class="profil-image">`;
    } else {
        avatarElement.style.backgroundColor = currentContact.color;
        avatarElement.textContent = currentContact.initials;
    }    
    document.querySelector('.contact-name').textContent = currentContact.name;
    document.getElementById('contact-email').textContent = currentContact.email;
    document.getElementById('contact-phone').textContent = currentContact.phone;
    document.getElementById('edit-contact-id').value = contactId;    
    displayContactDetailContainer(contactDetails);
}

/**
 * Display the contact detail container with a slide-in animation.
 * @param {HTMLElement} contactDetails - The contact details container element.
*/
function displayContactDetailContainer(contactDetails) {
    document.querySelector('#contactDetail').style.display = 'block';
    contactDetails.style.display = 'block';
    contactDetails.classList.remove('slide-out');
    contactDetails.classList.add('slide-in');
    setTimeout(() => {
        contactDetails.classList.remove('slide-in');
    }, 200);
}

/**
 * Hide the contact details and show the contact list on smaller screens.
*/
function hideContactDetails() {
    const contactDetails = document.getElementById('contact-details');
    contactDetails.style.display = 'none';
    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'block';
    }
    const closeButton = document.querySelector('.close-btn');
    closeButton.style.display = 'none';
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");
    editBtn.classList.remove("show");
    deleteBtn.classList.remove("show");
}

/**
 * Select a contact by adding a selected class.
 * @param {string} id - The ID of the contact to select.
*/
function selectContact(id) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => contact.classList.remove('selected-contact'));
    const selectedContact = document.querySelector(`.contact[onclick*="'${id}'"]`);
    if (selectedContact) {
        selectedContact.classList.add('selected-contact');
    }
}

/**
 * Check button position and update background colors for edit and delete buttons.
*/
function checkButtonPositionAndSetColor() {
    var editBtn = document.getElementById('edit-btn');
    var deleteBtn = document.getElementById('delete-btn');
    function updateButtonBackgroundColor() {
      if (getComputedStyle(editBtn).position === 'fixed') {
        editBtn.style.backgroundColor = 'white';
        deleteBtn.style.backgroundColor = 'white';
      } else {
        editBtn.style.backgroundColor = ''; 
        deleteBtn.style.backgroundColor = ''; 
      }}
    updateButtonBackgroundColor();
    window.addEventListener('resize', updateButtonBackgroundColor); 
}

/**
 * Toggle the visibility of edit and delete buttons.
*/
function toggleEditDelete() {
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");  
    if (editBtn.classList.contains("show")) {
      editBtn.classList.remove("show");
      deleteBtn.classList.remove("show");
    } else {
      editBtn.classList.add("show");
      deleteBtn.classList.add("show");
    }
  }

/**
 * Adds a new contact by validating the input, saving the contact to Firebase,
 * and displaying a success message upon completion.
*/
async function addNewContact() {
    const name = document.getElementById('add-name').value.trim();
    const email = document.getElementById('add-email').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    if (!validateContactInput(name, email, phone)) return false;
    let avatar = generateAvatar(name, allImages.length > 0 ? allImages[0].base64 : null);
    const contact = { name, email, phone, avatar };
    const response = await saveContact(contact);
    if (response) {
        clearInputFields();
        hideOverlay();
        loadContacts();
        showPopup('Contact added successfully'); return true;}
    return false;
}

/**
 * Saves a contact to Firebase by making a POST request to the Firebase contacts endpoint.
 * 
 * @async
 * @param {Object} contact - The contact object to be saved.
*/
async function saveContact(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
}

/**
 * Clear the input fields for adding or editing contacts.
*/
function clearInputFields() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
    allImages = [];
}

/**
 * Edits a contact's details and updates the contact in the backend.
 * @async
*/
async function editContact() {
    const contactData = getContactData();
    if (!contactData) return false;
    setContactAvatar(contactData);
    const response = await updateContact(contactData);
    if (response.ok && contactData.name !== document.getElementById('edit-name').getAttribute('data-original-name')) {
        await updateContactNameInTasks(contactData.id, contactData.name);
    }
    return handleContactUpdate(response, contactData);
}

/**
 * Sets the avatar for the contact.
 * @param {Object} contactData - The data of the contact being edited.
*/
function setContactAvatar(contactData) {
    if (currentContact.avatarImage) {
        contactData.avatar = {image: [{ base64: currentContact.avatarImage }]};
    } else {
        const currentName = document.getElementById('edit-name').getAttribute('data-original-name');
        if (contactData.name !== currentName) {
            contactData.avatar = generateAvatar(contactData.name);
        } else {
            contactData.avatar = { 
                initials: document.getElementById('profilInitialsOverlay').textContent, 
                color: document.getElementById('profilInitialsOverlay').style.backgroundColor 
            };
        }
    }
}

/**
 * Handles the contact update process after an update request.
 * @param {Response} response - The response from the backend after attempting to update the contact.
 * @param {Object} contactData - The data of the contact being edited.
*/
function handleContactUpdate(response, contactData) {
    if (response.ok) {
        hideOverlay();
        loadContacts();
        updateContactDetails(contactData, contactData.id);
        initializeUserFeatures();
        return true;
    }
    return false;
}

/**
 * Updates the input fields for editing a contact.
*/
function updateEditContactFields() {
    document.getElementById('edit-name').value = currentContact.name;
    document.getElementById('edit-email').value = currentContact.email;
    document.getElementById('edit-phone').value = currentContact.phone;    
    const image = document.getElementById('profilImageOverlay');
    const initials = document.getElementById('profilInitialsOverlay');     
    if (currentContact.avatarImage) {
        addImage(image, initials);
    } else {
        addInitials(image, initials);
    }
}

/**
 * Adds an image as the avatar.
 * @param {HTMLElement} image - The image element.
 * @param {HTMLElement} initials - The initials element.
*/
function addImage(image, initials) {
    image.src = currentContact.avatarImage;
    image.classList.remove('d-none');
    initials.classList.add('d-none');
}

/**
 * Adds initials as the avatar.
 * @param {HTMLElement} image - The image element.
 * @param {HTMLElement} initials - The initials element.
*/
function addInitials(image, initials) {
    image.classList.add('d-none');
    initials.classList.remove('d-none');
    initials.style.backgroundColor = currentContact.color;
    initials.textContent = currentContact.initials;
}

/**
 * Retrieves the data of the contact being edited from the input fields.
 * @returns {Object|null} - Returns the contact data as an object, or `null` if the input fields are invalid.
*/
function getContactData() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const id = document.getElementById('edit-contact-id').value;    
    if (!name || !email || !phone) return null;
    const imageElement = document.getElementById('profilImageOverlay');
    const avatarElement = document.getElementById('edit-avatar');  
    if (imageElement.src) {
        avatar.image = imageElement.src;
    } else {
        avatar.initials = avatarElement.textContent;
        avatar.color = avatarElement.style.backgroundColor;
    }
    return { name, email, phone, avatar, id };
}

/**
 * Update an existing contact on the server.
 * @param {Object} contact - The contact object.
*/
async function updateContact({ name, email, phone, avatar, id }) {
    return await fetch(`${BASE_URL}/contacts/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email, phone, avatar }),
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Get the ID of the contact being edited.
*/
function getEditContactId() {
    const contactId = document.getElementById('edit-contact-id').value;
    return contactId;
}

/**
 * Deletes a contact by its ID. Removes the contact from all associated tasks
*/
async function deleteContact() {
    const id = getEditContactId();
    if (!id) return false;
    await removeContactFromTasks(id);
    return await deleteContactFromDatabase(id);
}

/**
 * Deletes a contact from the database using its ID.
 * @param {string} contactId - The ID of the contact to be deleted.
*/
async function deleteContactFromDatabase(contactId) {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: 'DELETE' });
    if (response.ok) {
        handleContactDeletionSuccess();
        return true;
    }
    return false;
}

/**
 * Handles the success of a contact deletion.
*/
function handleContactDeletionSuccess() {
    hideOverlay();
    loadContacts();
    document.getElementById('contact-details').style.display = 'none';
    showPopup('Contact successfully deleted');
}

/**
 * Generates an avatar for the contact based on their name.
 * @param {string} name - The name of the contact.
 * @param {string|null} image - An optional image for the avatar.
 * @returns {Object} - An object with avatar data (initials and color or image).
*/
function generateAvatar(name, image = null) {
    if (name && image == null){
        return {
            initials: name.split(' ').map(n => n[0]).join(''),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
    } else if (allImages.length > 0) {
        return { image: allImages};
    }
}

/**
 * Clear the input fields for both adding and editing contacts.
*/
function clearInputs() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-email').value = '';
    document.getElementById('edit-phone').value = '';
}