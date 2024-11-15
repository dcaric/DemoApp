// **************************************************************
// EVENT LISTENERS
// **************************************************************

function updateMenu() {
  const isLogged = sessionStorage.getItem('isLogged') === "true";
  const loginMenu = document.getElementById("loginMenu");
  const userInfoMenu = document.getElementById("userInfoMenu");

  console.log('isLogged', isLogged);

  if (isLogged) {
    if (loginMenu) loginMenu.style.display = "none";
    if (userInfoMenu) userInfoMenu.style.display = "block";
  } else {
    if (loginMenu) loginMenu.style.display = "block";
    if (userInfoMenu) userInfoMenu.style.display = "none";
  }
}


// **************************************************************
// AT PAGE RELOAD
// **************************************************************
document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById('unifiedModal');

  if (modalElement) {
    // Listen for the `hidden.bs.modal` event
    // doc: https://getbootstrap.com/docs/5.3/components/modal/#events
    modalElement.addEventListener('hidden.bs.modal', function () {
      console.log("Modal has been dismissed.");
      // Place any function you want to run here
      updateMenu();
      window.location.reload();
    });
  }

  const logOffButton = document.getElementById("logOffButton");
  if (logOffButton) {
    logOffButton.addEventListener("click", handleLogOff);
  }
  updateMenu();
});


// **************************************************************
// MODAL CONTENT
// **************************************************************
// Function to dynamically load content into the modal based on what the user clicked
function loadModalContent(type) {
  const modalTitle = document.getElementById('unifiedModalLabel');
  const modalBody = document.getElementById('modalBodyContent');

  if (modalTitle && modalBody) {
    switch (type) {
      case 'contact':
        updateModalContent(modalTitle, modalBody, 'Contact Us', 'PAGES/contact.html');
        break;
      case 'login':
        updateModalContent(modalTitle, modalBody, 'Login/Register', 'PAGES/login.html');
        break;
      case 'userInfo':
        updateModalContent(modalTitle, modalBody, 'User Info', 'PAGES/userInfo.html');
        break;
      default:
        updateModalContent(modalTitle, modalBody, 'Under Construction', 'PAGES/underConstruction.html');
        break;
    }

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('unifiedModal'));
    modal.show();
  }
}

// Helper function to update modal content
function updateModalContent(modalTitle, modalBody, title, src) {
  modalTitle.textContent = title;
  modalBody.innerHTML = `<iframe src="${src}" width="100%" height="500px" style="border:none;"></iframe>`;
}

// LOGOFF 
function handleLogOff() {
  // Clear session storage to log the user out
  console.log('clear sessionStorage');
  sessionStorage.clear();
}


// **************************************************************
// LOGIN REQUESTS
// **************************************************************
function handleLogin(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  //const loginMenu = document.getElementById("userInfo");

  fetch("https://www.fulek.com/data/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    /**
     response: This is a parameter passed to the first .then() callback function.
     It refers to the Response object returned by the fetch() API. The Response object
     has methods like .json(), .text(), etc., which are used to extract the body content
     of the response. In this code, response.json() is called, which returns another 
     Promise that resolves to the parsed JSON data from the response body.
     */
    .then(response => response.json())
    /**
     data: This is the parameter passed to the second .then() callback function.
     It holds the parsed JSON data returned by response.json().
     This data object contains the actual content sent back by the server (e.g., 
     a login response), and it is not predefined by JavaScript.
     The structure of data depends on what the server at 
     https://www.fulek.com/data/api/user/login returns.
     */
    .then(data => {
      if (data.isSuccess && data.statusCode === 200) {
        // SUCCESSFUL LOGIN
        // Store the token in localStorage (or sessionStorage if preferred)
        //localStorage.setItem('jwtToken', token);
        // Store the token in sessionStorag (or sessionStorage if preferred)
        sessionStorage.setItem('jwtToken', data.data.token);

        // You can also store other information like username if needed
        //localStorage.setItem('username', data.data.username);
        sessionStorage.setItem('username', data.data.username);
        // Dispatch a custom event to notify other scripts about the change
        //const loginEvent = new Event('loginStatusChanged');
        //window.dispatchEvent(loginEvent);



        /**
        sessionStorage.setItem(): Stores data in the session storage of the browser,
        which lasts until the browser tab is closed.
        
        localStorage.setItem(): Stores data persistently in the browser’s
        local storage, even after the browser is closed.
         */


        // Toggle visibility of login/register and user info menus
        //document.getElementById("loginMenu").style.display = "none";
        //document.getElementById("userInfoMenu").style.display = "block";
        sessionStorage.setItem('isLogged', data.isSuccess);
        updateMenu();

        // Set success message
        const loginAlert = document.getElementById("loginAlert");
        loginAlert.className = "alert alert-success";
        loginAlert.innerHTML = "Login successful!";
        loginAlert.style.display = "block";

      } else {
        // UNSUCCESSFUL LOGIN

        //alert("Login failed. Please check your credentials.");
        // Set failure message
        const loginAlert = document.getElementById("loginAlert");
        loginAlert.className = "alert alert-danger";
        loginAlert.innerHTML = data.errorMessages[0];
        loginAlert.style.display = "block";
      }
    })
    // NETWORK ERROR
    .catch(error => {
      console.error("Error:", error);
      const loginAlert = document.getElementById("loginAlert");
      loginAlert.className = "alert alert-danger";
      loginAlert.innerHTML = "An error occurred. Please try again.";
      loginAlert.style.display = "block";
      console.error("Error:", error);
    });
}

// **************************************************************
// REGISTER REQUESTS
// **************************************************************
function handleRegister(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  fetch("https://www.fulek.com/data/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);  // Add this to check the API response
      const loginAlert = document.getElementById("loginAlert");
      if (data.isSuccess) {  // Change this line based on the actual response structure
        //alert("Registration successful!");
        loginAlert.className = "alert alert-success";
        loginAlert.innerHTML = "Registration successful!";
        loginAlert.style.display = "block";
      } else {
        //alert("Registration failed. Please check your details.");
        loginAlert.className = "alert alert-danger";
        loginAlert.innerHTML = data.errorMessages[0];
        loginAlert.style.display = "block";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      const loginAlert = document.getElementById("loginAlert");
      loginAlert.className = "alert alert-danger";
      loginAlert.innerHTML = "An error occurred. Please try again.";
      loginAlert.style.display = "block";
      console.error("Error:", error);
    });
}

// Toggle between login and register forms
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const toggleLabel = document.getElementById('toggleLabel');
  const formToggle = document.getElementById('formToggle');

  if (formToggle.checked) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    formTitle.textContent = 'Register';
    toggleLabel.textContent = 'Switch to Login';
  } else {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    formTitle.textContent = 'Login';
    toggleLabel.textContent = 'Switch to Register';
  }
}
