/**
 * Main application script for alejandrocuba.com
 * Handles progressive enhancements, accessible video facades, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Remove loading class to enable transitions gracefully
  document.body.classList.remove('is-loading');

  // Video Facade Interactive Handler
  const videoButtons = document.querySelectorAll('.video-facade-btn');
  videoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const videoId = button.getAttribute('data-video-id');
      if (!videoId) return;

      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
      iframe.setAttribute('title', button.getAttribute('aria-label') || 'YouTube Video');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.position = 'absolute';
      iframe.style.inset = '0';

      const parent = button.parentElement;
      if (parent) {
        parent.innerHTML = '';
        parent.appendChild(iframe);
      }
    });
  });

  // Navigation Dropdown Handler (Close on outside click or menuitem click)
  const navDropdowns = document.querySelectorAll('details.nav-dropdown');
  if (navDropdowns.length > 0) {
    document.addEventListener('click', (e) => {
      navDropdowns.forEach((details) => {
        if (!details.contains(e.target) || e.target.closest('.dropdown-link')) {
          details.removeAttribute('open');
        }
      });
    });
  }
});

