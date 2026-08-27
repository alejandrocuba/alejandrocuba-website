/**
 * Main application script for alejandrocuba.com
 * Progressive enhancements for video facades, smart header, ScrollSpy, and disclosure anchoring.
 */

// Instantiates YouTube video iframe on click
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.video-facade-btn');
  if (!btn) return;
  const id = btn.dataset.videoId;
  if (!id) return;

  const iframe = document.createElement('iframe');
  Object.assign(iframe, {
    src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    title: btn.getAttribute('aria-label') || 'YouTube Video',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullscreen: true,
    style: 'width:100%;height:100%;position:absolute;inset:0;border:0;'
  });
  btn.parentElement?.replaceChildren(iframe);
});

// Light-dismiss navigation dropdowns on outside click or dropdown item click
document.addEventListener('click', (e) => {
  if (!e.target.closest('details.nav-dropdown') || e.target.closest('.dropdown-link')) {
    document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => d.removeAttribute('open'));
  }
});

// Smart Header & ScrollSpy: Strictly highlight one navigation item at a time
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
const contribTrigger = document.querySelector('.nav-dropdown-trigger');
const sections = ['about', 'articles', 'podcast', 'speaking', 'mentorship', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const contribIds = new Set(['articles', 'podcast', 'speaking', 'mentorship']);

let lastY = window.scrollY;

const updateNavigation = () => {
  const y = window.scrollY;
  const delta = y - lastY;

  // Header Visibility
  if (header) {
    if (delta > 8 && y > 100) {
      header.classList.add('is-hidden');
      document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => d.removeAttribute('open'));
    } else if (delta < -6 || y <= 20) {
      header.classList.remove('is-hidden');
    }
  }

  // ScrollSpy: Determine the single current active section
  if (sections.length > 0) {
    const scrollPos = y + 140;
    const isBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 60;

    let activeId = 'about';

    if (isBottom) {
      activeId = 'contact';
    } else {
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].offsetTop) {
          activeId = sections[i].id;
          break;
        }
      }
    }

    // Strictly highlight only one target link
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Highlight Contributions parent trigger when one of its sub-sections is active
    if (contribTrigger) {
      const inContrib = contribIds.has(activeId);
      contribTrigger.classList.toggle('is-active', inContrib);
      if (inContrib) {
        contribTrigger.setAttribute('aria-current', 'true');
      } else {
        contribTrigger.removeAttribute('aria-current');
      }
    }
  }

  lastY = y;
};

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation, { passive: true });
updateNavigation();

// Synchronize scroll to bottom as footer disclosure expands
document.querySelector('.footer-metrics-disclosure')?.addEventListener('toggle', (e) => {
  const details = e.target;
  if (!details.open) return;
  const start = performance.now();
  const step = (now) => {
    if (!details.open) return;
    window.scrollTo(0, document.documentElement.scrollHeight);
    if (now - start < 450) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});
