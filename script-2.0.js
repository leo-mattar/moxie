gsap.registerPlugin(ScrollTrigger, CustomEase, DrawSVGPlugin);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

// --- GLOBAL - RELOAD AT THE TOP
$(window).on("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --- MATCHMEDIA
let mm = gsap.matchMedia();

// --- GLOBAL - CUSTOM EASE
let moxieEase = CustomEase.create("moxieEase", "0.19, 1, 0.22, 1");
let buttonEase = CustomEase.create("buttonEase", "0.785, 0.135, 0.15, 0.86");

// --- GLOBAL - SPLIT TEXT
let splitText;
function runSplit() {
  splitText = new SplitType("[split-text]", {
    types: "words, chars",
  });
}

// --- GLOBAL - FADE
function fade() {
  gsap.set("[fade]", { opacity: 0, yPercent: 25 });

  ScrollTrigger.batch("[fade]", {
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        yPercent: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1,
      }),
  });
}
//

// --- GLOBAL - PAGE LOAD COMPLETE
function loadComplete() {
  $(".c-body").removeClass("no-scroll");
  lenis.start();
}

//
////
//////
////
//

// NEW  YORK CURRENT TIME
function updateDisplay() {
  const options = {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const nycTime = new Date().toLocaleString("en-US", options);
  $("[ny-time]").text(nycTime);
}

// setInterval(updateDisplay, 1000);

// GLOBAL - HEADER MOBILE
function headerMobile() {
  let tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.inOut", duration: 0.8 },
  });

  gsap.set(".c-header-nav", { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0 });

  tl.to(".c-header-nav", { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
  tl.to(".c-nav-icon-bar.is-1", { rotate: -45, y: 2 }, 0);
  tl.to(".c-nav-icon-bar.is-2", { rotate: 45, y: -4 }, 0);

  $(".c-nav-btn").on("click", function () {
    $(this).toggleClass("is-open");
    if ($(this).hasClass("is-open")) {
      lenis.stop();
      tl.restart();
    } else {
      lenis.start();
      tl.reverse();
    }
  });

  $(".c-header-nav .c-btn").on("click", function () {
    $(".c-nav-btn").click();
  });
}

// HOME - LOADER
function homeHeroLoader() {
  let tl = gsap.timeline({
    defaults: { ease: moxieEase, duration: 1.6 },
    delay: 0.8,
  });

  gsap.set(".c-section.hm-hero > *", { visibility: "visible" });

  tl.from(".c-moxie-hero-txt", {
    xPercent: -200,
    autoAlpha: 0,
    stagger: 0.2,
    duration: 2,
  });

  tl.from(
    ".c-moxie-hero-dot",
    { y: -200, scale: 0, transformOrigin: "center center" },
    "<1"
  );
  tl.to(".c-moxie-hero-dot", { rotation: 180 }, "<");
  tl.from(".c-slogan_lt", { autoAlpha: 0, y: 60 }, "<0.4");
  tl.from("[p-hero]", { autoAlpha: 0, y: 60 }, "<0.2");
  tl.from(".c-slogan_rt", { autoAlpha: 0, y: 60 }, "<0.2");
  tl.from(".o-row.hm-hero_bt .t-micro-1", { autoAlpha: 0, y: 60 }, "<0.2");
  tl.from(".c-hm-hero-social", { autoAlpha: 0, y: 60 }, "<0.2");
  tl.to(".c-header", { y: "0%" }, "<-0.2");
  tl.from(
    ".c-hero-art_line path",
    {
      drawSVG: 0,
      duration: 2.4,
      ease: CustomEase.create("", "0.66, 0, 0.34, 1"),
    },
    "0"
  );

  tl.from(
    ".c-hero-art_line-mobile_bt path",
    {
      drawSVG: 0,
      duration: 2.4,
      ease: CustomEase.create("", "0.66, 0, 0.34, 1"),
    },
    "0"
  );

  tl.from(
    ".c-hero-art_line-mobile_top rect",
    {
      drawSVG: 0,
      duration: 2.4,
      ease: CustomEase.create("", "0.66, 0, 0.34, 1"),
    },
    "0"
  );

  //   c-hero-art_line-mobile_top
  // c-hero-art_line-mobile_bt

  sloganSlider();

  setTimeout(() => {
    loadComplete();
  }, 1800);
}

//
// HERO OUTLINE RESIZE
$(document).ready(function () {
  function updateSvgAspectRatio() {
    const windowWidth = $(window).width();

    if (windowWidth > 1440) {
      $("#art-line")
        .css({
          height: "67vh",
        })
        .attr("preserveAspectRatio", "none");
    } else {
      $("#art-line")
        .css({
          height: "auto",
        })
        .attr("preserveAspectRatio", "xMidYMid meet");
    }

    if (windowWidth < 992) {
      $("#art-line path").attr("vector-effect", "non-scaling-stroke");
    } else {
      $("#art-line path").attr("vector-effect", "");
    }
  }

  updateSvgAspectRatio();

  $(window).resize(updateSvgAspectRatio);
});

//

// --- HOME HERO SLOGAN SLIDER
function sloganSlider() {
  $(".c-slogal-slider").each(function () {
    let sliderItems = $(this).find(".c-slogan-slider-item");
    let totalSlides = sliderItems.length;
    let activeIndex = 0;

    // First state
    sliderItems.hide();
    sliderItems.first().css("display", "flex");

    // Move slide
    let tl = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.6 },
    });

    function moveSlide(nextIndex) {
      let prevItem = sliderItems.eq(activeIndex);
      let nextItem = sliderItems.eq(nextIndex);

      prevItem.css({ display: "flex", zIndex: "2" });
      nextItem.css({ display: "flex", zIndex: "1" });

      // Current item animation
      tl.fromTo(
        prevItem.find("[split-text] .char"),
        { opacity: 1, xPercent: 0 },
        { opacity: 0, stagger: { from: "end", each: 0.05 }, xPercent: -30 }
      );

      // Next item animation
      tl.fromTo(
        nextItem.find("[split-text] .char"),
        { opacity: 0, xPercent: 0 },
        { opacity: 1, stagger: { from: "start", each: 0.05 } },
        ">"
      );

      // Updating index
      activeIndex = nextIndex;
    }

    // Go next
    function goNext(num) {
      let nextIndex = activeIndex + 1;
      if (nextIndex > totalSlides - 1) {
        nextIndex = 0;
      }
      moveSlide(nextIndex);
    }

    // Autoplay slides

    let autoPlayTL = gsap.timeline({
      repeat: -1,
    });

    sliderItems.each(function (index) {
      autoPlayTL.to(sliderItems, {
        duration: 4,
        onComplete: () => {
          goNext(activeIndex + 1);
        },
      });
    });
  });
}

function redDotClickEffect() {
  let dotEl = $(".c-moxie-hero-dot");
  let tl = gsap.timeline({ paused: true });
  let rotationValue = 180;

  const colors = ["#FD6651", "#289595", "#FDD751"];
  let currentColorIndex = 0;

  dotEl.on("click", function () {
    if (!tl.isActive()) {
      rotationValue += 180;

      tl.to(dotEl, { rotation: rotationValue, ease: moxieEase, duration: 1.2 });

      currentColorIndex = (currentColorIndex + 1) % colors.length;

      tl.to(
        dotEl,
        { fill: colors[currentColorIndex], ease: moxieEase, duration: 0 },
        0
      );

      tl.play();
    }
  });
}

// --- HEADER SCROLL
function headerScroll() {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-body",
      start: "600 top",
      end: "+=1",
      onEnter: () => {
        tl.play();
      },
      onLeaveBack: () => {
        tl.reverse();
      },
    },
    defaults: {
      ease: "power3.inOut",
      duration: 0.3,
    },
  });

  tl.to(".c-header", {
    backgroundColor: "#F0EFED",
    borderBottom: "1px solid rgba(38, 36, 35, 0.1)",
  });
  tl.to(".c-logo-link", { y: 0 }, 0);
}

// HERO TEMPORARY POS STICKY
function heroPositionChange() {
  let heroTrigger = $("[hero-position-trigger]");

  heroTrigger.each(function () {
    ScrollTrigger.create({
      trigger: heroTrigger,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          heroTrigger.css("position", "sticky");
        } else {
          heroTrigger.css("position", "relative");
        }
      },
    });
  });
}

// function teamPanel() {
//   $(".c-team-item").each(function () {
//     let panelEl = $(this).find(".c-team-panel");
//     let panelCloseEl = $(this).find(".c-team-panel-close");
//     let panelOverlay = $(".c-team-panel-overlay");
//     let panelPhoto = $(this).find(".c-img-contain.team");

//     let tl = gsap.timeline({
//       defaults: {
//         duration: 0.8,
//         ease: moxieEase,
//       },
//       paused: true,
//     });

//     gsap.set(panelEl, { clipPath: "inset(0% 0% 0% 100%)", autoAlpha: 1 });
//     gsap.set(".c-team-panel-wrap", { autoAlpha: 1 });
//     gsap.set(panelOverlay, { autoAlpha: 0 });

//     tl.to(panelEl, { clipPath: "inset(0% 0% 0% 0%)" });
//     tl.to(panelOverlay, { autoAlpha: 1 }, 0);

//     panelPhoto.on("click", function () {
//       tl.timeScale(1);
//       tl.restart();
//       lenis.stop();
//     });

//     panelCloseEl.on("click", function () {
//       tl.timeScale(1.2);
//       tl.reverse();
//       lenis.start();
//     });

//     panelOverlay.on("click", function () {
//       panelCloseEl.click();
//     });

//     $(document).on("keydown", function (e) {
//       if (e.key === "Escape") {
//         panelCloseEl.click();
//       }
//     });
//   });
// }

//
function teamPanel() {
  $(".c-team-item").each(function () {
    let panelEl = $(this).find(".c-team-panel");
    let panelCloseEl = $(this).find(".c-team-panel-close");
    let panelOverlay = $(".c-team-panel-overlay");
    let panelPhoto = $(this).find(".c-img-contain.team");

    let tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: moxieEase,
      },
      paused: true,
    });

    gsap.set(panelEl, { autoAlpha: 1 });
    gsap.set(".c-team-panel-wrap", { autoAlpha: 1 });
    gsap.set(panelOverlay, { autoAlpha: 0 });

    tl.to(panelEl, { x: "0%" });
    tl.to(panelOverlay, { autoAlpha: 1 }, 0);

    panelPhoto.on("click", function () {
      tl.timeScale(1);
      tl.restart();
      lenis.stop();
    });

    panelCloseEl.on("click", function () {
      tl.timeScale(1.2);
      tl.reverse();
      lenis.start();
    });

    panelOverlay.on("click", function () {
      panelCloseEl.click();
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        panelCloseEl.click();
      }
    });
  });
}
//

// --- TEAM CARD HOVER
function teamCardHover() {
  $(".c-team-item").each(function () {
    let teamPhoto = $(this).find(".c-img-contain.team");
    let teamArrow = $(this).find(".c-team-arrow");
    let teamArrowIcon = $(this).find(".c-icon.team-arrow");
    let teamArrowBackground = $(this).find(".c-team-arrow-bg");

    let tl = gsap.timeline({
      paused: true,
      defaults: { duration: 1, ease: moxieEase },
    });

    tl.to(teamArrowBackground, { scale: 1 });
    tl.to(teamArrow, { border: "1px solid transparent" }, 0);
    tl.to(teamArrowIcon, { x: "100%" }, 0);

    teamPhoto.on("mouseenter", function () {
      tl.timeScale(1);
      tl.restart();
    });

    teamPhoto.on("mouseleave", function () {
      tl.timeScale(1.25);
      tl.reverse();
    });
  });
}

// function test() {
//   let panel = $(".o-row.services-panel:nth-child(1)");

//   gsap.set(panel, { backgroundColor: "#F0EFED", color: "#262423" });

//   ScrollTrigger.create({
//     trigger: panel,
//     start: "top top",
//     once: true,
//     onEnter: () => {
//       gsap.to(panel, {
//         backgroundColor: "#289595",
//         color: "#030D20",
//         ease: moxieEase,
//         duration: 1.4,
//       });
//     },
//   });
// }
// test();

// SERVICES PANEL
function servicesPanel() {
  let panelEls = $(".services-panel");

  mm.add("(min-width: 992px)", () => {
    panelEls.each(function (index, panelEl) {
      let panelTimeline = gsap.timeline({
        repeat: -1,
        paused: true,
        yoyo: true,
      });

      if (index === 0) {
        panelTimeline.to(panelEls.find(".c-img.panel.is-1"), {
          rotation: 10,
          duration: 5,
          ease: "bounce.inOut",
        });
        panelTimeline.to(panelEls.find(".c-img.panel.is-1"), {
          rotation: -10,
          duration: 5,
          ease: "bounce.inOut",
        });
        panelTimeline.to(panelEls.find(".c-img.panel.is-1"), {
          rotation: 0,
          duration: 5,
          ease: "bounce.inOut",
        });
      } else if (index === 1) {
        panelTimeline.to(panelEls.find(".c-img.panel.is-3"), {
          x: -15,
          y: 15,
          rotation: -10,
          duration: 5,
          ease: "bounce.inOut",
        });
        panelTimeline.to(panelEls.find(".c-img.panel.is-3"), {
          x: 15,
          y: -15,
          rotation: 10,
          duration: 5,
          ease: "bounce.inOut",
        });
      } else if (index === 2) {
        panelTimeline.to(panelEls.find(".c-img.panel.is-5"), {
          x: 35,
          duration: 5,
          ease: "power3.inOut",
          rotation: -3,
        });

        panelTimeline.to(
          panelEls.find(".c-img.panel.is-6"),
          {
            x: -35,
            duration: 5,
            ease: "power3.inOut",
            rotation: 3,
          },
          "<"
        );
      }

      ScrollTrigger.create({
        trigger: panelEl,
        start: "top top",
        end: "bottom top",
        onToggle: function (self) {
          $(panelEl).toggleClass("is-active", self.isActive);

          if (self.isActive) {
            panelTimeline.play();
          } else {
            panelTimeline.reverse();
          }
        },
      });
    });
  });

  // Hide header when panels are in view
  ScrollTrigger.create({
    trigger: ".c-section.hm-section-3",
    start: "-300 top",
    end: "bottom top",
    onToggle: function (self) {
      gsap.to(".c-header", {
        yPercent: self.isActive ? -100 : 0,
        ease: "power3.inOut",
        duration: 0.2,
      });
    },
  });

  // First panel transition
  let panel = $(".o-row.services-panel:nth-child(1)");
  gsap.set(panel, {
    backgroundColor: "#F0EFED",
    color: "#262423",
    borderTop: "1px solid #262423",
  });

  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    once: true,
    onEnter: () => {
      gsap.to(panel, {
        backgroundColor: "#289595",
        color: "#030D20",
        borderTop: "1px solid #F0EFED",
        ease: moxieEase,
        duration: 1.4,
      });
    },
  });
}

// --- PROCESS SECTION IN VIEW
function processSection() {
  gsap.set(".c-process-svg path", { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: ".c-process-svg",
    start: "center bottom",
    once: true,
    onEnter: () => {
      gsap.fromTo(
        ".c-process-svg path",
        {
          x: "-500",
          autoAlpha: 0,
        },
        {
          x: "0",
          stagger: { each: 0.2, from: "start" },
          duration: 1.4,
          ease: moxieEase,
          autoAlpha: 1,
        }
      );
    },
  });
}

// --- PROCESS PANEL
function processPanel() {
  $(".c-process-item").each(function () {
    let processLink = $(this).find(".c-process-link");
    let processPanel = $(this).find(".c-process-panel");
    let processPanelClose = $(this).find(".c-process-panel-close");
    let processMoreIcon = $(this).find(".c-icon.more-icon");
    let processLinkText = $(this).find("[process-link-text]");
    let processContent = $(this).find(".t-rich-text.process");
    let processOverlay = $(".c-process-panel-overlay");

    let tl = gsap.timeline({
      paused: true,
      defaults: { duration: 1, ease: moxieEase },
    });

    gsap.set(processPanel, {
      clipPath: "inset(50% 50% 50% 50% round 1em)",
      visibility: "visible",
      autoAlpha: 1,
    });
    gsap.set(processContent, { autoAlpha: 0 });
    gsap.set(processOverlay, {
      autoAlpha: 0,
    });

    tl.fromTo(
      processPanel,
      { clipPath: "inset(50% 50% 50% 50% round 1em)" },
      { clipPath: "inset(0% 0% 0% 0% round 1em)" }
    );
    tl.to(processContent, { autoAlpha: 1 }, 0);
    tl.to(processOverlay, { autoAlpha: 1 }, 0);

    processLink.on("click", function () {
      $(".c-process-link.is-open").not($(this)).click();
      $(this).toggleClass("is-open");
      if ($(this).hasClass("is-open")) {
        processLinkText.text("CLOSE");
        tl.timeScale(1);
        tl.restart();
      } else {
        processLinkText.text("MORE");
        tl.timeScale(1.75);
        tl.reverse();
      }
    });

    processPanelClose.on("click", function () {
      processLinkText.text("MORE");
      tl.timeScale(1.5);
      tl.reverse();
    });

    processOverlay.on("click", function () {
      processPanelClose.click();
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        processPanelClose.click();
      }
    });
  });
}

function setTrackHeights() {
  if ($(window).width() > 991) {
    $(".c-height").each(function (index) {
      let trackWidth = $(this).find(".c-mover").outerWidth();
      $(this).height(trackWidth);
    });
  } else {
    $(".c-height").height("auto");
  }
}

// window.addEventListener("resize", function () {
//   if (homePage) {
//     setTrackHeights();
//   }
// });

function valuesSection() {
  // Horizontal scroll
  let tlMain = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-height",
      start: "top top",
      end: "100% bottom",
      scrub: true,
    },
  });
  tlMain.to(".c-mover", {
    xPercent: -113,
    ease: "none",
  });
}

// --- MAIN CTA HOVER EFFECT
function mainCTA() {
  let ctaEl = $(".c-btn.main-cta");
  let ctaBG = $(".c-btn-bg");
  let bodyEl = $(".c-body");
  let footerSectionEl = $(".c-section.footer");

  let tl = gsap.timeline({
    paused: true,
    defaults: { ease: buttonEase, duration: 0.6 },
  });

  ctaEl.on("mouseenter", function () {
    // tl.restart();

    confetti({
      spread: 180,
      ticks: 100,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      particleCount: 100,
      scalar: 2,
      shapes: ["image"],
      shapeOptions: {
        image: [
          {
            src: "https://uploads-ssl.webflow.com/65a7a1e07983fbdd1c1d1b94/65b90a8229b7232658cdc5e2_shape-04.svg",
            width: 32,
            height: 16,
          },
          {
            src: "https://uploads-ssl.webflow.com/65a7a1e07983fbdd1c1d1b94/65b90a82f35b3d28062a8995_shape-03.svg",
            width: 32,
            height: 16,
          },
          {
            src: "https://uploads-ssl.webflow.com/65a7a1e07983fbdd1c1d1b94/65b90a82307daef8feb44475_shape-02.svg",
            width: 32,
            height: 16,
          },
          {
            src: "https://uploads-ssl.webflow.com/65a7a1e07983fbdd1c1d1b94/65b90a820d89101e9c747699_shape-01.svg",
            width: 32,
            height: 16,
          },
        ],
      },
    });
  });
}

// --- PAGES
let homePage = document.querySelector("[home-page]");

// --- INIT
window.addEventListener("DOMContentLoaded", (event) => {
  if (homePage) {
    runSplit();
    teamPanel();
    // servicesPanel();
    processPanel();
    updateDisplay();
    homeHeroLoader();
  }
});

// --- MATCHMEDIA - DESKTOP
mm.add("(min-width: 992px)", () => {
  headerScroll();
  fade();
  if (homePage) {
    teamCardHover();
    processSection();
    setTrackHeights();
    valuesSection();
    mainCTA();
    redDotClickEffect();
    heroPositionChange();
    servicesPanel();
  }
  return () => {
    gsap.set(".c-team-panel", { clearProps: "all" });
    gsap.set("[fade]", { opacity: 1, yPercent: 0 });
  };
});

// --- MATCHMEDIA - TABLET AND MOBILE
mm.add("(max-width: 991px)", () => {
  lenis.destroy();
  if (homePage) {
    $(".c-body").removeClass("no-scroll");
    // gsap.set(".c-section.hm-hero > *", { autoAlpha: 1 });
    // gsap.set(".c-header", { y: "0%" });
    sloganSlider();
  }
  headerMobile();
  $("[siteby-txt]").text("by");
  $(".c-btn.contact-nav").appendTo(".c-header-nav");
  $(".c-btn.contact-nav").css("visibility", "visible");
  return () => {
    $("[siteby-txt]").text("site by");
    $(".c-btn.contact-nav").appendTo(".c-header-inner");
    $(".c-nav-btn").unbind();
  };
});

// MOXIE LOGO SIZE ON MAC DEVICES
if (navigator.platform === "MacIntel" && !navigator.maxTouchPoints) {
  // console.log("This code is running on macOS desktop.");
  $(".c-moxie-logo-txt").css("height", "0.9em");
} else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  // console.log("This code is running on iOS.");
  $(".c-moxie-logo-txt").css("height", "0.85em");
} else {
}

//
////
//

// --- REMOVE SPLINE ON MOBILE
// window.onload = function () {
//   // Check if the device is a mobile device
//   if (isMobileDevice()) {
//     // Remove the element with class 'c-hero-art_spline'
//     let element = document.querySelector(".c-hero-art_spline");
//     if (element) {
//       element.parentNode.removeChild(element);
//     }
//   }
// };

// function isMobileDevice() {
//   // Regular expression to match common mobile device screen sizes
//   let mobileRegex =
//     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
//   // Check if the user agent matches the regular expression
//   return mobileRegex.test(navigator.userAgent);
// }