
// Function to dynamically load content into the modal based on what the user clicked
function loadModalContent(type) {
  const modalTitle = document.getElementById('unifiedModalLabel'); // connection to HTML tag with id unifiedModalLabel
  const modalBody = document.getElementById('modalBodyContent'); // connection to HTML tag with id modalBodyContent

  /*
  This JS function changes (updates) TITLE and CONTENT in the MODAL VIIEW in the HTML page
  It uses varables modalTitle ofr the TITLE and modalBody for the CONTENT update
  */

  if (type === 'contact') {
      modalTitle.textContent = 'Contact Us';
      modalBody.innerHTML = '<iframe src="PAGES/contact.html" width="100%" height="500px" style="border:none;"></iframe>';
  } else if (type === 'login') {
      modalTitle.textContent = 'Login/Register';
      modalBody.innerHTML = '<iframe src="PAGES/login.html" width="100%" height="500px" style="border:none;"></iframe>';
  } else {
    modalTitle.textContent = 'Under Construction';
    modalBody.innerHTML = '<iframe src="PAGES/underConstruction.html" width="100%" height="500px" style="border:none;"></iframe>';
}

  // Open the modal part in the HTML page, this part has id unifiedModal
  const modal = new bootstrap.Modal(document.getElementById('unifiedModal'));
  modal.show();
}

