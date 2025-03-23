const filepicker = document.getElementById('filepicker');
const error = document.getElementById('error');
const trash = document.getElementById('delete');
let allImages = [];


function openFilePicker() {
    const filepicker = document.getElementById('filepicker');
    if (filepicker) {           
        filepicker.click();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const filepicker = document.getElementById('filepicker');
    const gallery = document.getElementById('gallery');
    if (filepicker) {
        filepicker.addEventListener('change', async () => {
            const files = filepicker.files;
            if (files.length == 0) return;
            filesArrayIterate(files);
        });
    }
});


function uploadSelectedFiles() {
    const filepicker = document.getElementById('filepicker');
    const galleryOverlay = document.getElementById('galleryOverlay');
    const files = filepicker.files;
    if (files.length == 0) return;
    filesArrayIterate(files);
}


function filesArrayIterate(files) {
    Array.from(files).forEach(async file => {
        if (isValidImage(file)) return;
        const compressedBase64 = await compressImage(file, 800, 800, 0.7);
        allImages.push({filename: file.name, base64: compressedBase64,});
        createImage();             
    });
    renderAttachmet();
}


function renderAttachmet() {
    if (allAttachment) {
        allAttachment.forEach(image => {
            allImages.push(image);
        });
        allAttachment = allImages;
    }
}


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


function createImage() {
    if (gallery) {        
        renderGallery();
    } if(galleryOverlay){
        renderGalleryOverlay();
    }
}

function renderGallery() {
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

function renderGalleryOverlay() {
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


function showDeleteButton(index) {
    document.getElementById(`delete-container${index}`).style.display = 'block';
}


function hideDeleteButton(index) {
    document.getElementById(`delete-container${index}`).style.display = 'none';
}


function deleteImage(index) {
    allImages.splice(index, 1);
    createImage();
    if (allImages.length === 0) {
        trash.classList.add('d-none');
    }
}


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