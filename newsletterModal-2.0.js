// --- NEWSLETTER MODAL
function handleNewsletterModal() {
  const modalSelector = ".c-modal-newsletter";
  const closeButtonSelector = ".c-modal-close";
  const modalElement = document.querySelector(modalSelector);
  const closeButton = modalElement
    ? modalElement.querySelector(closeButtonSelector)
    : null;

  // Function to open the modal
  function openModal() {
    if (modalElement) {
      modalElement.classList.add("is-open");
      // Save the current timestamp in localStorage
      localStorage.setItem("newsletterLastShown", Date.now());
    }
  }

  // Function to close the modal
  function closeModal() {
    if (modalElement) {
      modalElement.classList.remove("is-open");
    }
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
const signupForms = document.querySelectorAll(".c-form.newsletter");
if (signupForms.length > 0) {
  signupForms.forEach(form => {
    let submitBtn = form.querySelector('button[type="submit"]'),
      submitBtnText = form.querySelector(".c-btn .t-body-4");

    submitBtn.addEventListener("click", function (event) {
      event.preventDefault();
      submitBtnText.textContent = "Submitting...";
      mailchimpFormSubmit(form);
    });
  });
}

function mailchimpFormSubmit(form) {
  let formWrap = form.parentNode.parentNode,
    submitBtnText = form.querySelector(".c-btn .t-body-4"),
    messageBlock = formWrap.querySelector(".c-form-success"),
    messageText = formWrap.querySelector(".c-form-success .t-body-5");

  $.ajax({
    type: form.getAttribute("method"),
    url: form.getAttribute("action"),
    data: $(form).serialize(),
    cache: false,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    error: function (err) {
      submitBtnText.textContent = "Submit";
      messageBlock.style.display = "block";
      messageText.textContent =
        "Looks like something went wrong. Please try again later.";
    },
    success: function (data) {
      if (data.result === "success") {
        if (form.dataset.redirect) {
          window.open(form.dataset.redirect, "_blank");
        }

        submitBtnText.textContent = "Submit";
        messageBlock.style.display = "block";
        messageText.textContent = "Thank you for signing up!";
        // form.querySelector('button[type="text"]').value = "";
        // form.querySelector('input[type="email"]').value = "";
      } else {
        submitBtnText.textContent = "Submit";
        messageBlock.style.display = "block";
        messageText.textContent =
          "Looks like something went wrong. Please check your input.";
      }
    },
  });
}
