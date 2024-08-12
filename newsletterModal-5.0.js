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
