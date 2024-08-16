// --- NEWSLETTER MODAL
function handleNewsletterModal() {
  const modalSelector = ".c-modal-newsletter";
  const closeButtonSelector = ".c-modal-close";
  const modalElement = document.querySelector(modalSelector);

  // Return early if modalElement does not exist
  if (!modalElement) {
    return;
  }

  const closeButton = modalElement.querySelector(closeButtonSelector);

  // Function to open the modal
  function openModal() {
    modalElement.classList.add("is-open");
    // Save the current timestamp in localStorage
    localStorage.setItem("newsletterLastShown", Date.now());
  }

  // Function to close the modal
  function closeModal() {
    modalElement.classList.remove("is-open");
  }

  // Check if enough time has passed to show the modal again
  function shouldShowModal() {
    const lastShown = localStorage.getItem("newsletterLastShown");
    if (lastShown) {
      const now = Date.now();
      const oneMinuteInMs = 1 * 60 * 1000; // 1 minute in milliseconds
      return now - parseInt(lastShown, 10) > oneMinuteInMs;
    }
    // Show the modal if it's the first visit
    return true;
  }

  // Check if the modal should be shown
  if (shouldShowModal()) {
    setTimeout(() => {
      openModal();
      lenis.stop();
    }, 10000);
  }

  // Add event listener to close button
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeModal();
      lenis.start();
    });
  }
}

// Initialize the newsletter modal functionality
handleNewsletterModal();

// MAILCHIMP SIGNUP
const form = document.querySelector(".c-form.newsletter");

if (form) {
  let submitBtn = form.querySelector('button[type="submit"]'),
    submitBtnText = form.querySelector(".c-btn .t-body-4");

  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    submitBtnText.textContent = "Submitting...";
    mailchimpFormSubmit(form);
  });
}

function mailchimpFormSubmit(form) {
  $.ajax({
    type: form.getAttribute("method"),
    url: form.getAttribute("action"),
    data: $(form).serialize(), // Use jQuery to serialize the form data
    cache: false,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    error: error => {
      console.log("Error", error);
    },
    success: res => {
      console.log("Success");
      let formWrap = document.querySelector(".c-form.newsletter");
      let formSuccess = document.querySelector(".c-form-success");

      formWrap.style.display = "none";
      formSuccess.style.display = "flex";
    },
  });
}
