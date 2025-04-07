let initial = [];

/**
 * Initializes user features based on the logged-in user's data.
 * @async
 * @function
 * @returns {Promise<void>} 
*/
async function initializeUserFeatures() {
  let loggedInEmail = localStorage.getItem('currentUser');
  if (loggedInEmail) {
      await onloadFuncHeader(loggedInEmail);
  } else {
      await generateUserLetter();
  }
}

/**
 * Loads the contact data of the currently logged-in user and updates the header.
 * Displays either the user's profile image (if available) or their initials.
 * @async
 * @function
 * @param {Object} loggedInUser - The currently logged-in user object.
 * @returns {Promise<void>}
*/
async function onloadFuncHeader(loggedInEmail) {
  try {
    let contactDetails = Object.values(await loadFromDatabase('/contacts')).find(c => c.email === loggedInEmail);
    if (contactDetails) {
      const avatar = contactDetails.avatar?.image?.["0"]?.base64;
      if (avatar) {
        displayUserImage(avatar);
      } else {
        await generateUserLetter(contactDetails.name?.split(' ').map(w => w.charAt(0).toUpperCase()).join('') || "G");
      }
    }
  } catch (error) {
    console.error('Error in onloadFuncHeader:', error);
  }
}


/**
 * Displays the user's profile image in the header and hides the initials.
 * @function
 * @param {string} imageUrl - The base64-encoded image URL to display.
*/
function displayUserImage(imageUrl) {
  const imageElement = document.getElementById('user-image');
  const initialElement = document.getElementById('user-initial');
  imageElement.src = imageUrl;
  imageElement.classList.remove('d-none');
  initialElement.classList.add('d-none');
}

/**
 * Displays the user's initials in the header and hides the profile image (if present).
 * Defaults to "G" if no initials are provided.
 * @async
 * @function
 * @param {string} [initial] - The user's initials to display.
 * @returns {Promise<void>}
*/
async function generateUserLetter(initial) {
  try {
    const userInitialRef = document.getElementById('user-initial');
    const imageElement = document.getElementById('user-image');
    if (imageElement) imageElement.classList.add('d-none');
    if (userInitialRef) {
      userInitialRef.innerHTML = initial || "G";
      userInitialRef.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error in generateUserLetter:', error);
  }
}

/**
 * Toggles the user menu. For window widths greater than 1000 pixels, the menu is shown or hidden. 
 * For smaller screens, the mobile menu is opened.
*/
function toggleUserMenu() {
  let userMenu = document.getElementById('userMenu');
  if (window.innerWidth > 1000) {
    userMenu.classList.toggle('d-none');
  } else {
    mobilMenu();
  };
}

/**
 * Opens or closes the mobile user menu. If the menu is not visible, it opens; otherwise, it closes.
*/
function mobilMenu() {
  let userMobile = document.getElementById('userMobile');
  if (!userMobile.classList.contains('show-logout-mobile')) {
    openMobilMenu();
  } else {
    closeMobilMenu();
  };
}

/**
 * Opens the mobile user menu by removing and adding the appropriate classes.
*/
function openMobilMenu() {
  userMobile.classList.remove('exit-logout-mobile');
  userMobile.classList.add('show-logout-mobile');
  userMobile.classList.remove('d-none');
}

/**
 * Closes the mobile user menu by adding the exit class. 
 * After a delay of 700 milliseconds, the menu is hidden.
*/
function closeMobilMenu() {
  userMobile.classList.add('exit-logout-mobile');
  setTimeout(function () {
    userMobile.classList.add('d-none');
    userMobile.classList.remove('show-logout-mobile');
  }, 700);
}

/**
 * Logs out the user by redirecting to the login page.
*/
function logOut() {
  localStorage.removeItem('currentUser');
  window.location.replace('/index.html');
}