const filepicker = document.getElementById('filepicker');
const error = document.getElementById('error');
const trash = document.getElementById('delete');
let allImages = [];
let addTaskOpen = false;
let contact = false;
let edit = false;

/**
 * Opens the file picker for selecting a profile image.
 * Sets the `contact` variable to true to indicate the profile image context.
*/
function openProfilImageFilePicker() {
    const filepicker = document.getElementById('filepicker');
    contact = true
    if (filepicker) {           
        filepicker.click();
    } 
}

/**
 * Opens the file picker for selecting an image to edit an existing contact.
 * Sets the `edit` variable to true to indicate the edit context.
*/
function openEditImageFilePicker() {
    const filepicker = document.getElementById('filepicker');
    edit = true
    if (filepicker) {
        filepicker.click();
    } 
    
}

/**
 * Opens the file picker for adding a task's image.
 * Sets the `addTaskOpen` variable to true to indicate the task context.
*/
function openAddTaskFilePicker() {
    addTaskOpen = true;
    const filepicker = document.getElementById('filepicker');
    if (filepicker) {           
        filepicker.click();
    }
}

/**
 * Opens the file picker for selecting an image for other general purposes (not for profile or editing).
 * Sets the `addTaskOpen` variable to false to reset the task context.
*/
function openOverlayFilePicker() {
    addTaskOpen = false;
    const filepicker = document.getElementById('filepicker');
    if (filepicker) {           
        filepicker.click();
    }
}

/**
 * Handles the file input change event when a file is selected from the file picker.
 * It processes the selected files and iterates over them for further actions.
*/
document.addEventListener("DOMContentLoaded", () => {
    const filepicker = document.getElementById('filepicker');
    if (filepicker) {
        filepicker.addEventListener('change', async () => {
            const files = filepicker.files;
            if (files.length == 0) return;
            filesArrayIterate(files);
        });
    }
});

/**
 * Uploads the selected files from the file picker.
 * Iterates over the selected files and processes them accordingly.
*/
function uploadSelectedFiles() {
    const filepicker = document.getElementById('filepicker');
    const files = filepicker.files;
    if (files.length == 0) return;
    filesArrayIterate(files);
}

/**
 * Iterates through the selected files, compresses them if necessary, and adds the images to the gallery.
 * @param {FileList} files - The list of files selected by the user.
*/
async function filesArrayIterate(files) {
    const imagePromises = Array.from(files).map(async file => {
        if (isValidImage(file)) return;
        const compressedBase64 = await compressImage(file, 800, 800, 0.7);
        return { filename: file.name, base64: compressedBase64 };
    });
    const newImages = (await Promise.all(imagePromises)).filter(Boolean);
    allImages.push(...newImages);
    createImage();
}

/**
 * Checks if a file is a valid image based on its MIME type.
 * If not a valid image, displays an error message.
 * @param {File} file - The file to validate.
 * @returns {boolean} - Whether the file is a valid image.
*/
function isValidImage(file) {
    if (!file.type.startsWith('image/')) {
        error.textContent = `Die Datei "${file.name}" ist kein gültiges Bild.`;
        error.classList.add('error-text');
        setTimeout(() => {
            error.textContent = '';
            error.classList.remove('error-text');
        }, 2500);
        return true;
    }
}

/**
 * Compresses an image file to a specified size and quality.
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - The maximum width of the compressed image.
 * @param {number} maxHeight - The maximum height of the compressed image.
 * @param {number} quality - The quality of the compressed image (from 0 to 1).
 * @returns {Promise<string>} - A Promise resolving to the compressed image in base64 format.
*/
async function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    } else {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };
        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}

/**
 * Creates images based on the context, either for profile, editing, or gallery.
*/
function createImage() {
    if (contact) {
        renderContactImage();
    }else if (edit) {        
        renderEditContactImage();
    }else if (addTaskOpen) {
        renderGallery();
    } else if (!addTaskOpen) {
        renderGalleryOverlay();
        checkAttachments();
    }
}

/**
 * Renders the profile image after an image file is selected and processed.
*/
function renderContactImage() {
    const profilImage = document.getElementById('profilImage');
    if (allImages.length > 0) {
        profilImage.src = allImages[0].base64;
    } else {
        profilImage.src = '/assets/img/addcontact.png';
    }
    contact = false;
}

/**
 * Renders the image in the context of editing an existing contact.
*/
function renderEditContactImage() {
    currentContact.avatarImage = allImages[0].base64;
    updateEditContactFields();
    edit = false;
}

/**
 * Checks if there are any attached images and updates the UI accordingly.
*/
function checkAttachments() {
    const attachmentContainer = document.getElementById('attachmentOverlay');
    if (allImages.length > 0) {
        attachmentContainer.classList.add('d-none');
    } else if (allAttachment.length == 0) {
        attachmentContainer.classList.remove('d-none');
        attachmentContainer.innerHTML = `<p>No images</p>`;
    } 
}

/**
 * Renders the gallery of uploaded images, including delete buttons.
*/
function renderGallery() {
    const gallery = document.getElementById('gallery');
    trash.classList.remove('d-none');
    gallery.innerHTML = '';
    allImages.forEach((image, index) => {
        gallery.innerHTML += `
            <div class="image-box" onmouseenter="showDeleteButton(${index})" onmouseleave="hideDeleteButton(${index})">
                <img class="upload-image" src="${image.base64}" alt="${image.filename}">
                <div class="delete-container" id="delete-container${index}">
                    <div class="delete-icon" onclick="deleteImage(${index})"></div>
                </div>
                <span class="image-filename">${image.filename}</span>
            </div>
        `;
    });
}

/**
 * Renders the gallery in an overlay format for displaying images in a fullscreen or popup view.
*/
function renderGalleryOverlay() {
    const galleryOverlay = document.getElementById('galleryOverlay');
    galleryOverlay.innerHTML = '';
    allImages.forEach((image, index) => {
        galleryOverlay.innerHTML += `
            <div class="image-box" onmouseenter="showDeleteButton(${index})" onmouseleave="hideDeleteButton(${index})">
                <img class="upload-image" src="${image.base64}" alt="${image.filename}">
                <div class="delete-container" id="delete-container${index}">
                    <div class="delete-icon" onclick="deleteImage(${index})"></div>
                </div>
                <span class="image-filename">${image.filename}</span>
            </div>
        `;
    });
}

/**
 * Displays the delete button for an image when the user hovers over it.
 * @param {number} index - The index of the image in the gallery.
*/
function showDeleteButton(index) {
    document.getElementById(`delete-container${index}`).style.display = 'block';
}

/**
 * Hides the delete button for an image when the user stops hovering over it.
 * @param {number} index - The index of the image in the gallery.
*/
function hideDeleteButton(index) {
    document.getElementById(`delete-container${index}`).style.display = 'none';
}

/**
 * Changes the image source on hover for an image input button.
 * @param {HTMLImageElement} image - The image element to change the source of.
*/
function changeInputImage(image) {
    image.src = '/assets/icon/add_photo_hover.png'
}

/**
 * Resets the image source to its default when the hover state is removed.
 * @param {HTMLImageElement} image - The image element to reset the source of.
*/
function resetInputImage(image) {
    image.src = '/assets/icon/add_photo.png'
}

/**
 * Deletes an image from the gallery based on the provided index.
 * @param {number} index - The index of the image to delete.
*/
function deleteImage(index) {
    const trash = document.getElementById('delete');
    allImages.splice(index, 1);
    createImage();
    if (allImages.length == 0) {
        trash.classList.add('d-none');
    }
}

/**
 * Clears the entire gallery by removing all images and resetting the gallery state.
*/
function clearGallery() {
    const gallery = document.getElementById('gallery');
    const trash = document.getElementById('delete');
    if (gallery) {
        gallery.innerHTML = '';
        allImages = [];
        allAttachment = [];
        trash.classList.add('d-none');
    }
}

/**
 * Opens the image viewer to display an image at a specific index.
 * @param {number} index - The index of the image to view in the viewer.
*/
function openImageViewer(index) {
    const gallery = document.getElementById('viewerGallery');
    gallery.innerHTML = '';
    showClickImage(index, gallery);
    showAllImage(index, gallery);
    window.imageViewer = new Viewer(gallery);
    window.imageViewer.show();
}

/**
 * Displays the selected image in the image viewer.
 * @param {number} index - The index of the image to show in the viewer.
 * @param {HTMLElement} gallery - The gallery container to display the image.
*/
function showClickImage(index, gallery) {
    allAttachment.forEach((image, i) => {
        if (i === index) {
            gallery.innerHTML += `
                <img src="${image.base64}" alt="${image.filename}" class="viewer-image">
        `;
        }
    });
}

/**
 * Displays all images in the gallery, except the currently selected image, in the image viewer.
 * @param {number} index - The index of the image to exclude from the gallery.
 * @param {HTMLElement} gallery - The gallery container to display the images.
*/
function showAllImage(index, gallery) {
    allAttachment.forEach((image, i) => {
        if (i !== index) {
            gallery.innerHTML += `
                <img src="${image.base64}" alt="${image.filename}" class="viewer-image" style="display:none;">
            `;
        }
    });
}

/**
 * Closes the image viewer when the close button is clicked and resets the viewer state.
 * @param {Event} event - The event triggered when the close button is clicked.
*/
document.addEventListener('click', (event) => {
    if (event.target.matches('.viewer-button.viewer-close')) {
        const viewerGallery = document.getElementById('viewerGallery');
        if (viewerGallery) {
            viewerGallery.classList.add('d-none');
        }
        if (window.imageViewer) {
            window.imageViewer.destroy();
            window.imageViewer = null;
        }
        document.body.focus();
    }
});