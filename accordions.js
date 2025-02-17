// --- ACCORDIONS
function accordions() {
  const accordions = document.querySelectorAll(".c-careers-item");
  let active = null;

  if (accordions.length === 0) return;

  accordions.forEach((accordion, index) => {
    const question = accordion.querySelector(".c-careers-toggle");
    const response = accordion.querySelector(".c-careers-apply");
    const arrow = accordion.querySelector(".c-icon.careers-open");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power3.inOut",
        duration: 0.8,
      },
    });

    tl.to(response, { height: "auto", opacity: 1 });
    tl.to(arrow, { rotation: 135 }, 0);

    accordion.tl = tl;

    accordion.addEventListener("click", function () {
      if (active === accordion) {
        tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        tl.play();
        active = accordion;
      }
    });
  });
}
accordions();
