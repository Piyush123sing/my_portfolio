const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#primary-navigation");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");

// Keep menu state centralized so clicks, Escape, and desktop resizing behave the same way.
function closeMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("open");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
  }
});

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

// Reveal sections once as the user scrolls, with CSS handling reduced-motion preferences.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Highlight the nav item for the section currently passing through the viewport.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-38% 0px -55% 0px",
    threshold: 0.01
  }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

updateHeaderState();
