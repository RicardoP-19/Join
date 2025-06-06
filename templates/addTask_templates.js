/**
 * Generates the HTML for displaying an option to select a user in the assignment selection.
 * @param {string} name - The name of the user to display.
 * @param {string} avatar - The HTML for the user's avatar image or initials.
 * @param {string} id - The unique identifier for the user.
 * @param {boolean} checked - A flag indicating whether the user is selected (checked).
 * @returns {string} The generated HTML string for the user selection option.
*/
function generateCreateOption(name, avatar, id, checked) {
    return `
    <div class="assigned-content" id="assigned-content-${id}" onclick="selectionUser('${id}')" style="${checked ? 'background-color: lightblue;' : ''}">
        <div class="assigned-user">
            <div>
                ${avatar}
            </div>
            <p>${name}</p>
        </div>
        <div id="userCheckbox" class="checkbox-container">
            <input type="checkbox" data-user-id="${id}" id="checkbox-${id}" ${checked ? 'checked' : ''} onclick="event.stopPropagation();">
            <label class="user-checkbox" for="checkbox-${id}" onclick="event.stopPropagation(); selectionUser('${id}')"></label>
        </div>
    </div>
  `;
}

/**
 * Generates the HTML for displaying selected users' initials.
 * @param {string} initial - The initials of the user.
 * @param {string} color - The background color for the initials.
*/
function generateSelectedUsersHTML(initial, color) {
    return `
        <div class="assigned-initital d-flex" style="background-color: ${color};">
            <p>${initial}</p>
        </div>
    `;
}

/**
 * Generates the HTML for displaying extra users in the assignment selection.
 * @param {number} extraCount - The number of additional selected users.
*/
function generateExtraUsersHTML(extraCount) {
    return `
        <div class="assigned-initital d-flex extra-contacts">
            <p class="extra-contacts-text">+${extraCount}</p>
        </div>
    `;
}

/**
 * Generates the HTML for a subtask item.
 * @param {number} subtaskId - The unique identifier for the subtask.
 * @param {string} subtaskText - The text description of the subtask.
*/
function generateSubtaskHTML(subtaskId, subtaskText) {
    return `
        <li id="subtask-${subtaskId}" onmouseover="showButtons(${subtaskId})" onmouseout="hideButtons(${subtaskId})">
            <span id="subtask-text-${subtaskId}">${subtaskText}</span>
            <span class="subtask-buttons" id="subtask-buttons-${subtaskId}" style="display: none;">
                <button class="subtask-button" type="button" onclick="editSubtask(${subtaskId})"><img src="/assets/img/edit.png" alt=""></button>
                 <div class="small-break-between"></div>
                <button class="subtask-button" type="button" onclick="deleteSubtask(${subtaskId})"><img src="/assets/img/dustbinDark.svg" alt=""></button>
            </span>
        </li>
    `;
}

/**
 * Generates the HTML for the edit subtask input and buttons.
 * @param {number} index - The index of the subtask being edited.
 * @param {string} title - The current title of the subtask.
*/
function generateEditSubtaskHTML(index, title) {
    return `
        <div class="subtask-edit-container">
            <input type="text" id="edit-subtask-input" value="${title}" class="edit-subtask-input">
            <div class="subtask-buttons" style="display: inline;">
                <button class="subtask-button edit-check" onclick="saveSubtask(${index})"><img src="/assets/img/check.png" alt="Save"></button>
                <div class="small-break-between"></div>
                <button class="subtask-button" onclick="deleteSubtask(${index})"><img src="/assets/img/dustbinDark.svg" alt="Delete"></button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML for a subtask item with its title and index.
 * @param {string} title - The title of the subtask.
 * @param {number} index - The index of the subtask.
*/
function generateSubtaskItemHTML(title, index) {
    return `
        <li onmouseover="showButtons(${index})" onmouseout="hideButtons(${index})">
            ${title}
            <span id="subtask-buttons-${index}" class="subtask-buttons" style="display:none;">
                <button class="subtask-button" onclick="editSubtask(${index})"><img src="/assets/img/edit.png" alt=""></button>
                 <div class="small-break-between"></div>
                <button class="subtask-button" onclick="deleteSubtask(${index})"><img src="/assets/img/dustbinDark.svg" alt=""></button>
            </span>
        </li>
    `;
}

/**
 * Generates an HTML template for displaying an image in a gallery with options to delete.
 * The gallery item will include the image, filename, and a delete button.
 * @param {Object} image - The image object containing the image data.
 * @param {string} image.base64 - The base64 encoded string of the image.
 * @param {string} image.filename - The filename of the image.
 * @param {number} index - The index of the image in the gallery.
 * @returns {string} The HTML template for the image gallery item.
*/
function generateImageGallery(image, index) {
    return `
        <div class="image-box" onclick="openImageViewer(${index}, 'addTask')" onmouseenter="showDeleteButton(${index})" onmouseleave="hideDeleteButton(${index})">
            <img class="upload-image" src="${image.base64}" alt="${image.filename}">
            <div class="delete-container" id="delete-container${index}">
                <div class="delete-icon" onclick="deleteImage(${index}); event.stopPropagation();"></div>
            </div>
            <span class="image-filename">${image.filename}</span>
        </div>
    `;
}