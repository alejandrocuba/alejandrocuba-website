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

  // Smart Header: Hide on scroll down, show on scroll up
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;

            if (currentScrollY <= 20) {
              header.classList.remove('is-hidden', 'is-scrolled');
            } else {
              header.classList.add('is-scrolled');
              if (delta > 8 && currentScrollY > 100) {
                // Scrolling down - hide header
                header.classList.add('is-hidden');
                navDropdowns.forEach((details) => details.removeAttribute('open'));
              } else if (delta < -6) {
                // Scrolling up - show header
                header.classList.remove('is-hidden');
              }
            }

            lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ScrollSpy: Update active navigation item based on section in view
  const sectionIds = ['about', 'articles', 'podcast', 'speaking', 'mentorship', 'contact'];
  const contributionSectionIds = ['articles', 'podcast', 'speaking', 'mentorship'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
  const contributionsTrigger = document.querySelector('.nav-dropdown-trigger');

  if (sections.length > 0) {
    const setActiveSection = (sectionId) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });

      if (contributionsTrigger) {
        if (contributionSectionIds.includes(sectionId)) {
          contributionsTrigger.classList.add('is-active');
          contributionsTrigger.setAttribute('aria-current', 'true');
        } else {
          contributionsTrigger.classList.remove('is-active');
          contributionsTrigger.removeAttribute('aria-current');
        }
      }
    };

    const updateActiveNav = () => {
      const scrollPosition = window.scrollY + 120;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page activates contact
      if (window.scrollY + windowHeight >= documentHeight - 50) {
        setActiveSection('contact');
        return;
      }

      let currentSectionId = 'about';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (scrollPosition >= section.offsetTop) {
          currentSectionId = section.id;
          break;
        }
      }

      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // Footer Metrics Disclosure: Smooth, seamless and elegant expand & collapse animation
  const footerDisclosure = document.querySelector('.footer-metrics-disclosure');
  if (footerDisclosure) {
    const summary = footerDisclosure.querySelector('.footer-metrics-summary');
    const wrapper = footerDisclosure.querySelector('.footer-metrics-content-wrapper');

    if (summary && wrapper) {
      let shrinkAnimationId = null;
      let scrollAnimationId = null;
      let isClosing = false;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const cancelActiveAnimations = () => {
        if (shrinkAnimationId) {
          cancelAnimationFrame(shrinkAnimationId);
          shrinkAnimationId = null;
        }
        if (scrollAnimationId) {
          cancelAnimationFrame(scrollAnimationId);
          scrollAnimationId = null;
        }
      };

      const scrollToAbsoluteBottom = (duration = 520) => {
        const startScroll = window.scrollY;
        const targetScroll = document.documentElement.scrollHeight - window.innerHeight;
        const distance = targetScroll - startScroll;
        if (distance <= 2) return;

        const startTime = performance.now();

        const scrollStep = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);

          window.scrollTo({
            top: startScroll + distance * eased,
            behavior: 'auto'
          });

          if (progress < 1) {
            scrollAnimationId = requestAnimationFrame(scrollStep);
          } else {
            // Ensure the exact absolute bottom is set at finish
            window.scrollTo({
              top: document.documentElement.scrollHeight - window.innerHeight,
              behavior: 'auto'
            });
            scrollAnimationId = null;
          }
        };

        scrollAnimationId = requestAnimationFrame(scrollStep);
      };

      const expand = () => {
        isClosing = false;
        cancelActiveAnimations();

        footerDisclosure.setAttribute('open', '');
        footerDisclosure.classList.remove('is-closing');
        footerDisclosure.classList.add('is-open');
        footerDisclosure.style.height = '';
        footerDisclosure.style.overflow = '';

        // Immediately start smooth scroll to the very bottom of the page (520ms duration)
        scrollToAbsoluteBottom(520);
      };

      const shrink = () => {
        isClosing = true;
        cancelActiveAnimations();

        const startHeight = footerDisclosure.offsetHeight;
        const endHeight = summary.offsetHeight;
        const heightDelta = startHeight - endHeight;

        footerDisclosure.classList.remove('is-open');
        footerDisclosure.classList.add('is-closing');
        footerDisclosure.style.overflow = 'hidden';

        const startTime = performance.now();
        const duration = 500;

        const shrinkStep = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);

          const currentHeight = startHeight - heightDelta * eased;
          footerDisclosure.style.height = `${currentHeight}px`;

          if (progress < 1 && isClosing) {
            shrinkAnimationId = requestAnimationFrame(shrinkStep);
          } else if (isClosing) {
            footerDisclosure.removeAttribute('open');
            footerDisclosure.classList.remove('is-closing');
            footerDisclosure.style.height = '';
            footerDisclosure.style.overflow = '';
            isClosing = false;
            shrinkAnimationId = null;
          }
        };

        shrinkAnimationId = requestAnimationFrame(shrinkStep);
      };

      summary.addEventListener('click', (e) => {
        e.preventDefault();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          if (footerDisclosure.hasAttribute('open')) {
            footerDisclosure.removeAttribute('open');
            footerDisclosure.classList.remove('is-open', 'is-closing');
          } else {
            footerDisclosure.setAttribute('open', '');
            footerDisclosure.classList.add('is-open');
          }
          return;
        }

        if (isClosing || !footerDisclosure.hasAttribute('open')) {
          expand();
        } else {
          shrink();
        }
      });
    }
  }
});




