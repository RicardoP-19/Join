let allContacts = [];
let assignedContacts = [];
let selectedContacts = [];
let filteredContacts = [];
let allSubtasksArray = [];
let editAssignedContacts = [];
let allAttachment = [];

/**
 * Displays the edit task overlay for the specified task.
 * @param {string} taskId - The ID of the task to be edited.
 * @function showEditTaskOverlay
*/
function showEditTaskOverlay(taskId) {
    document.getElementById('overlay-board-detail').classList.add('d-none');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.remove('d-none');
    overlayBoardEditRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    overlayBoardEditRef.innerHTML = getEditOverlayTemplate(task);
    updateAssignedContacts();
    checkAttachments();
    checkInputs();
}

/**
 * Renders the list of contacts assigned to the specified task.
 * @param {string} taskId - The ID of the task.
 * @returns {string} The HTML content for the assigned contacts.
 * @function renderAllContactsInAssignedTo
*/
function renderAllContactsInAssignedTo(taskId) {
    let task = tasks.find(t => t.id === taskId);
    let allContactsContent = "";
    allContacts = [];
    selectedContacts = [];
    assignedContacts = [];
    if (task.assignedTo && task.assignedTo !== "") {
        assignedContacts.push(task.assignedTo);
    }
    allContactsContent += renderContacts();
    return allContactsContent;
}

/**
 * Renders the list of contacts into HTML.
 * @returns {string} The HTML content for the contacts.
*/
function renderContacts() {
    let contactsContent = '';
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        contactsContent += createContactTemplate(contacts[iContact]);
    }
    return contactsContent;
}

/**
 * Creates a contact template for displaying a contact in the assigned-to section.
 * @param {Object} contact - The contact object containing details about the contact.
 * @param {string} contact.name - The name of the contact.
 * @param {Object} contact.avatar - The avatar of the contact.
 * @param {string} contact.avatar.initials - The initials of the contact.
 * @param {string} contact.avatar.color - The color associated with the contact.
 * @param {string} contact.avatar.image - The image associated with the contact.
 * @param {string} contact.id - The ID of the contact.
 * @returns {string} The HTML string for the contact template.
*/
function createContactTemplate(contact) {
    let name = contact.name;
    let initial = contact.avatar?.initials || "";
    let color = contact.avatar?.color || "";
    let imageUrl = contact.avatar?.image?.[0]?.base64 || "";
    let id = contact.id;
    allContacts.push({ contactId: id, name: name, initial: initial, color: color, imageUrl: imageUrl });
    let isChecked = assignedContacts.length > 0 && assignedContacts[0].find(c => c.id === id) ? 'checked' : '';
    if (isChecked) {
        selectedContacts.push({ contactId: id, name: name, initial: initial, color: color, imageUrl: imageUrl });
    }
    return getAssignedToEditTemplateOverlay(initial, color, name, imageUrl, id, isChecked);
}

/**
 * Searches for contacts based on the input value and updates the displayed contacts.
 * @function searchContact
*/
function searchContact() {
    filteredContacts = [];
    let inputRef = document.getElementById('input-assigned-edit');
    input = inputRef.value.toLowerCase();
    if (input.length > 0) {
        showDropdown();
        filteredContacts = allContacts.filter(c => c.name.toLowerCase().includes(input));
        renderFilteredContactsinAssignedTo();
    } else {
        closeDropdown();
        renderAllContacts();
        showDropdown();
    }
}

/**
 * Renders all contacts in the dropdown.
 * @function renderAllContacts
*/
function renderAllContacts() {
    let dropdownContactsRef = document.getElementById("dropdown-contacts");
    dropdownContactsRef.innerHTML = "";
    allContacts.forEach(({ name, initial, color, contactId, imageUrl }) => {
        let isChecked = selectedContacts.some(c => c.contactId === contactId) ? 'checked' : '';
        dropdownContactsRef.innerHTML += getAssignedToEditTemplateOverlay(initial, color, name, imageUrl, contactId, isChecked);
    });
}

/**
 * Renders filtered contacts in the dropdown based on the search query.
 * @function renderFilteredContactsinAssignedTo
*/
function renderFilteredContactsinAssignedTo() {
    let dropdownContactsRef = document.getElementById("dropdown-contacts");
    dropdownContactsRef.innerHTML = "";
    for (let iFilter = 0; iFilter < filteredContacts.length; iFilter++) {
        let { name, initial, color, contactId, imageUrl } = filteredContacts[iFilter];
        let isChecked = selectedContacts.some(c => c.contactId === contactId) ? 'checked' : '';
        dropdownContactsRef.innerHTML += getAssignedToEditTemplateOverlay(initial, color, name, imageUrl, contactId, isChecked);
    }
}

/**
 * Updates the list of assigned contacts and displays them in the UI.
 * @function updateAssignedContacts
*/
function updateAssignedContacts() {
    let assignedContentRef = document.getElementById('assigned-content');
    assignedContentRef.innerHTML = '';
    if (selectedContacts.length > 0) {
        selectedContacts.forEach(contact => {
            let color = contact.color;
            let initial = contact.initial;
            let imageUrl = contact.imageUrl;
            let contactContent = imageUrl ? 
                `<img src="${imageUrl}" alt="${contact.name}'s avatar" class="assigned-image">` : 
                `<div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>`;
            assignedContentRef.innerHTML += contactContent;
        });
    } else {
        assignedContentRef.innerHTML = 'No Contact in Assign To';
    }
}

/**
 * Renders all subtasks for the specified task.
 * @param {string} taskId - The ID of the task.
 * @returns {string} The HTML content for the subtasks.
 * @function renderAllSubtasks
*/
function renderAllSubtasks(taskId) {
    allSubtasksArray = [];
    let task = tasks.find(t => t.id === taskId);
    let allSubtasks = '';
    let subtasks = task.subtasks;
    if (!subtasks || subtasks.length === 0) {
        return getNoSubtaskInTaskTemplate();
    } else {
        for (let iSubtasks = 0; iSubtasks < subtasks.length; iSubtasks++) {
            allSubtasks += processSubtask(subtasks[iSubtasks], iSubtasks);
        }
    }
    return allSubtasks;
}

/**
 * Processes a subtask for rendering.
 * @param {Object} subtask - The subtask object.
 * @param {number} iSubtask - The index of the subtask.
 * @returns {string} The HTML content for the subtask.
 * @function processSubtask
*/
function processSubtask(subtask, iSubtask) {
    let title = subtask.title;
    let checkCompleted = subtask.completed;
    checkCompleted = (checkCompleted == "" || checkCompleted == null || !checkCompleted) ? false : true;
    allSubtasksArray.push({ 'completed': checkCompleted, 'title': title });
    return getAllSubtasksTemplate(iSubtask, title);
}

/**
 * Adds a new subtask to the task.
 * @function addSubtask
*/
function addSubtask() {
    let ctnEditAllSubtasksRef = document.getElementById('ctn-edit-all-subtasks');
    let inputValueSubtaskRef = document.getElementById('subtasks-edit');
    clearNoSubtaskMessageAndInput(inputValueSubtaskRef);
    if (inputValueSubtaskRef.value !== "") {
        ctnEditAllSubtasksRef.innerHTML = '';
        allSubtasksArray.push({ 'completed': false, 'title': inputValueSubtaskRef.value });
        updateSubtaskDisplay(ctnEditAllSubtasksRef);
        inputValueSubtaskRef.value = '';
    }
}

/**
 * Clears the input field and any no-subtask message.
 * @param {HTMLElement} inputValueSubtaskRef - Reference to the input field for the subtask.
 * @function clearNoSubtaskMessageAndInput
*/
function clearNoSubtaskMessageAndInput(inputValueSubtaskRef) {
    let noSubtaskEditRef = document.getElementById('no-subtask-edit');
    if (noSubtaskEditRef) {
        noSubtaskEditRef.remove();
    }
    inputValueSubtaskRef.value = inputValueSubtaskRef.value.trim();
}

/**
 * Updates the display of subtasks in the specified container.
 * @param {HTMLElement} container - The container for displaying subtasks.
 * @function updateSubtaskDisplay
*/
function updateSubtaskDisplay(container) {
    for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
        let title = allSubtasksArray[iSubtasks].title;
        container.innerHTML += getAllSubtasksTemplate(iSubtasks, title);
    }
}

/**
 * Deletes a subtask at the specified index.
 * @param {number} iSubtasks - The index of the subtask to delete.
 * @function deleteSubtask
*/
function deleteSubtask(iSubtasks) {
    allSubtasksArray.splice(iSubtasks, 1);
    renderCurrentSubtasks(iSubtasks);
}

/**
 * Renders the current subtasks in the container.
 * @param {number} iSubtasks - The index for rendering.
 * @function renderCurrentSubtasks
*/
function renderCurrentSubtasks(iSubtasks) {
    let ctnEditAllSubtasksRef = document.getElementById('ctn-edit-all-subtasks');
    ctnEditAllSubtasksRef.innerHTML = "";
    if (allSubtasksArray.length > 0) {
        for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
            let title = allSubtasksArray[iSubtasks].title;
            ctnEditAllSubtasksRef.innerHTML += getAllSubtasksTemplate(iSubtasks, title)
        }
    } else {
        ctnEditAllSubtasksRef.innerHTML = getNoSubtaskInTaskTemplate();
    }
}

/**
 * Edits a subtask by enabling its input field.
 * @param {number} iSubtasks - The index of the subtask to edit.
 * @function editSubtask
*/
function editSubtask(iSubtasks) {
    saveSubtask(iSubtasks);
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.add('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.add('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.add('no-hover-edit');
    inputField.removeAttribute('disabled');
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}

/**
 * Saves or deletes a subtask based on the input field value.
 * If the input is empty or contains only a placeholder, the subtask is deleted.
 * Otherwise, the subtask's title is updated and rendered.
 * @param {number} iSubtasks - The index of the subtask in the allSubtasksArray.
*/
function saveSubtask(iSubtasks) {
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    let inputFieldValue = inputField.value.replace(/^\s*•\s*/, '');
    if (inputFieldValue == "" || inputFieldValue == 0) {
        deleteSubtask(iSubtasks);
    } else {
        allSubtasksArray[iSubtasks].title = inputField.value.substring(2);
        renderCurrentSubtasks(iSubtasks);
    }
}

/**
 * Updates the task with new values and saves to the database.
 * @param {string} taskId - The ID of the task to update.
 * @function updateTask
*/
function updateTask(taskId) {
    let task = tasks.find(t => t.id === taskId);
    task.title = document.getElementById('title-edit').value;
    task.description = document.getElementById('description-edit').value;
    task.dueDate = document.getElementById('due-date-edit').value;
    task.priority = getActivePriority();
    task.assignedTo = getAssignedTo();
    task.attachments = [...allAttachment, ...allImages];
    task.subtasks = allSubtasksArray;
    updateOnDatabase(`tasks/${taskId}`, task);
    closeEditTaskOverlay();
    renderTasksBoard();
    showDetailTaskOverlay(taskId);
}

/**
 * Closes the edit task overlay.
 * @function closeEditTaskOverlay
*/
function closeEditTaskOverlay() {
    document.body.style.overflow = '';
    allAttachment = [];
    allImages = [];
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardEditRef.classList.add('d-none');
        overlayBoardEditRef.classList.remove('slide-out');
    }, 200);
}

/**
 * Checks the validity of the input fields for title and due date.
 * @function checkInputs
*/
function checkInputs() {
    let titleInput = document.getElementById('title-edit');
    let dueDateInput = document.getElementById('due-date-edit');
    let title = titleInput.value.trim();
    let dueDate = dueDateInput.value;
    updateButtonToggleActive(title, dueDate);
    checkInputTitle(title, titleInput);
    checkInputDueDate(dueDate, dueDateInput);
}

/**
 * Retrieves the assigned contacts for the task being edited.
 * @returns {Array} An array of assigned contacts.
 * @function getAssignedTo
*/
function getAssignedTo() {
    editAssignedContacts = [];
    for (let contactIdSelected = 0; contactIdSelected < selectedContacts.length; contactIdSelected++) {
        editAssignedContacts.push({ 'id': selectedContacts[contactIdSelected].contactId, 'name': selectedContacts[contactIdSelected].name });
    }
    return editAssignedContacts;
}

/**
 * Renders the attachments in the edit overlay for the specified task.
 * @param {string} taskId - The ID of the task to render the attachments for.
 * @returns {string} The HTML content for the attachments.
 * @function renderAttachmentsOverlay
*/
function renderAttachmentsOverlay(taskId) {
    allAttachment = [];
    let task = tasks.find(t => t.id === taskId);
    let attachments = task.attachments;
    let allAttachmentsHtml = '';
    if (!attachments || attachments.length === 0) {
        return `<p>No images</p>`;
    } else {
        for (let iAttachment = 0; iAttachment < attachments.length; iAttachment++) {
            const attachment = attachments[iAttachment];
            allAttachment.push(attachment);
            allAttachmentsHtml += getAttachmentTemplateOverlay(iAttachment, attachment);
        }
    }
    return allAttachmentsHtml;
}

/**
 * Renders the attachments in the edit view for the specified task.
 * @param {string} taskId - The ID of the task to render the attachments for.
 * @returns {string} The HTML content for the attachments.
 * @function renderAttachmentsEdit
*/
function renderAttachmentsEdit(taskId) {
    let task = tasks.find(t => t.id === taskId);
    let attachments = task.attachments;
    let allAttachmentsHtml = '';
    if (!attachments || attachments.length === 0) {
        return `<p>No images</p>`;
    } else {
        for (let iAttachment = 0; iAttachment < attachments.length; iAttachment++) {
            const attachment = attachments[iAttachment];
            allAttachmentsHtml += getAttachmentTemplateEdit(attachment, iAttachment);
        }
    }
    return allAttachmentsHtml;
}

/**
 * Deletes an attachment image at the specified index.
 * @param {number} index - The index of the attachment to delete.
 * @function deleteImageOverlay
*/
function deleteImageOverlay(index) {
    allAttachment.splice(index, 1);
    let galleryContainer = document.getElementById('overlayWrapper');
    let newHtml = '';
    for (let i = 0; i < allAttachment.length; i++) {
        newHtml += getAttachmentTemplateEdit(allAttachment[i], i);
    }
    galleryContainer.innerHTML = newHtml;
}