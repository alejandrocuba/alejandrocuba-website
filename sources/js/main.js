/**
 * Main application script for alejandrocuba.com
 */

// YouTube Video Facade: Instantiates iframe on click
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.video-facade-btn');
  if (!btn?.dataset.videoId) return;

  const iframe = document.createElement('iframe');
  Object.assign(iframe, {
    src: `https://www.youtube-nocookie.com/embed/${btn.dataset.videoId}?autoplay=1&rel=0`,
    title: btn.getAttribute('aria-label') || 'YouTube Video',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullscreen: true,
    style: 'width:100%;height:100%;position:absolute;inset:0;border:0;'
  });
  btn.parentElement?.replaceChildren(iframe);
});

// Light-dismiss navigation dropdown on outside click or dropdown item click
document.addEventListener('click', (e) => {
  if (!e.target.closest('details.nav-dropdown') || e.target.closest('.dropdown-link')) {
    document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => (d.open = false));
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
      document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => (d.open = false));
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

// Smooth Accordion Animation for Footer Disclosure
class SmoothDisclosure {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.content = el.querySelector('.footer-metrics-content-wrapper');
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    if (!this.summary || !this.content) return;
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.open = !this.el.open;
      return;
    }

    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 1000, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    const scrollStart = performance.now();
    const step = (now) => {
      if (!this.el.open || this.isClosing) return;
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      if (now - scrollStart < 1050) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = '';
    this.el.style.overflow = '';
  }
}

const footerDisclosure = document.querySelector('.footer-metrics-disclosure');
if (footerDisclosure) {
  new SmoothDisclosure(footerDisclosure);
}

// Interactive 3D Earth Globe Follower & Right-Click Easter Egg
const countriesStat = document.querySelector('.podcast-stat-item--countries');
const globeFollower = countriesStat?.querySelector('.globe-easter-egg');

if (countriesStat && globeFollower) {
  let tooltipTimeout;

  const updatePosition = (e) => {
    const rect = countriesStat.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    globeFollower.style.setProperty('--cursor-x', `${x}px`);
    globeFollower.style.setProperty('--cursor-y', `${y}px`);
  };

  countriesStat.addEventListener('pointerenter', updatePosition, { passive: true });
  countriesStat.addEventListener('pointermove', updatePosition, { passive: true });

  countriesStat.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    updatePosition(e);

    globeFollower.classList.remove('is-inspecting');
    void globeFollower.offsetWidth;
    globeFollower.classList.add('is-inspecting');

    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      globeFollower.classList.remove('is-inspecting');
    }, 2400);
  });

  countriesStat.addEventListener('pointerleave', () => {
    clearTimeout(tooltipTimeout);
    globeFollower.classList.remove('is-inspecting');
  });
}

// Live Core Web Vitals Measurement (LCP, CLS, INP)
(() => {
  const lcpEl = document.getElementById('cwv-lcp');
  const clsEl = document.getElementById('cwv-cls');
  const inpEl = document.getElementById('cwv-inp');

  if (!lcpEl && !clsEl && !inpEl) return;

  const updateLCP = (val) => {
    if (lcpEl) {
      lcpEl.textContent = val < 1000 ? `${(val / 1000).toFixed(2)}s` : `${(val / 1000).toFixed(2)}s`;
    }
  };

  let clsValue = 0;
  const updateCLS = (val) => {
    if (clsEl) {
      clsEl.textContent = val.toFixed(2);
    }
  };

  let maxInp = 0;
  const updateINP = (val) => {
    if (inpEl) {
      inpEl.textContent = `${Math.max(1, Math.round(val))}ms`;
    }
  };

  if ('PerformanceObserver' in window) {
    // 1. Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          updateLCP(entries[entries.length - 1].startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Graceful fallback for unsupported entry type
    }

    // 2. Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            updateCLS(clsValue);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Graceful fallback
    }

    // 3. Interaction to Next Paint (INP)
    try {
      const inpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const duration = entry.duration;
          if (duration > maxInp) {
            maxInp = duration;
            updateINP(maxInp);
          }
        }
      });
      inpObserver.observe({ type: 'event', durationThreshold: 0, buffered: true });
    } catch {
      try {
        const fallbackInp = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.duration > maxInp) {
              maxInp = entry.duration;
              updateINP(maxInp);
            }
          }
        });
        fallbackInp.observe({ type: 'event', durationThreshold: 16, buffered: true });
      } catch {
        // Graceful fallback
      }
    }
  }

  // Fallback initial paint timing if LCP observer has not triggered yet
  window.addEventListener('load', () => {
    if (lcpEl && lcpEl.textContent === '--' && window.performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');
      if (fcp) updateLCP(fcp.startTime);
    }
  });
})();
