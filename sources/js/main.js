/**
 * Main application script for alejandrocuba.com
 */

// Delegated Click Handling: Video Facade, Dropdown Light-Dismiss & Smooth Anchors
document.addEventListener('click', (e) => {
  // YouTube Video Facade
  const videoBtn = e.target.closest('.video-facade-btn');
  if (videoBtn?.dataset.videoId) {
    const iframe = document.createElement('iframe');
    Object.assign(iframe, {
      src: `https://www.youtube-nocookie.com/embed/${videoBtn.dataset.videoId}?autoplay=1&rel=0`,
      title: videoBtn.getAttribute('aria-label') || 'YouTube Video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowFullscreen: true,
      style: 'width:100%;height:100%;position:absolute;inset:0;border:0;'
    });
    videoBtn.parentElement?.replaceChildren(iframe);
    return;
  }

  // Smooth Anchor Navigation
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        history.pushState(null, '', targetId);
      }
    }
  }

  // Close Navigation Dropdown on outside click or item selection
  if (!e.target.closest('details.nav-dropdown') || e.target.closest('.dropdown-link')) {
    document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => (d.open = false));
  }
});

// Header & ScrollSpy Navigation Controller
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
const contribTrigger = document.querySelector('.nav-dropdown-trigger');
const sectionElements = ['about', 'articles', 'podcast', 'speaking', 'mentorship', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const contribIds = new Set(['articles', 'podcast', 'speaking', 'mentorship']);

let activeSectionId = 'about';
const visibleSectionRatios = new Map();

const setActiveNav = (activeId) => {
  if (!activeId || activeId === activeSectionId) return;
  activeSectionId = activeId;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    if (link.classList.contains('is-active') !== isActive) {
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  });

  if (contribTrigger) {
    const inContrib = contribIds.has(activeId);
    if (contribTrigger.classList.contains('is-active') !== inContrib) {
      contribTrigger.classList.toggle('is-active', inContrib);
      if (inContrib) {
        contribTrigger.setAttribute('aria-current', 'true');
      } else {
        contribTrigger.removeAttribute('aria-current');
      }
    }
  }
};

// Zero-Reflow ScrollSpy via IntersectionObserver
if ('IntersectionObserver' in window && sectionElements.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSectionRatios.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSectionRatios.delete(entry.target.id);
        }
      });

      if (visibleSectionRatios.size > 0) {
        for (const el of sectionElements) {
          if (visibleSectionRatios.has(el.id)) {
            setActiveNav(el.id);
            break;
          }
        }
      }
    },
    {
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
    }
  );

  sectionElements.forEach((el) => sectionObserver.observe(el));
}

// Lightweight Header Visibility on Scroll
let lastY = 0;
let accumulatedDelta = 0;
let ticking = false;

const updateHeader = () => {
  const y = Math.max(0, window.scrollY || 0);
  const delta = y - lastY;
  const isAtTop = y <= 20;

  if (header) {
    header.classList.toggle('is-scrolled', y > 20);

    if (isAtTop) {
      if (header.classList.contains('is-hidden')) {
        header.classList.remove('is-hidden');
      }
      accumulatedDelta = 0;
    } else {
      if ((delta > 0 && accumulatedDelta < 0) || (delta < 0 && accumulatedDelta > 0)) {
        accumulatedDelta = 0;
      }
      accumulatedDelta += delta;

      if (accumulatedDelta > 25 && y > 80) {
        if (!header.classList.contains('is-hidden')) {
          header.classList.add('is-hidden');
          document.querySelectorAll('details.nav-dropdown[open]').forEach((d) => (d.open = false));
        }
      } else if (accumulatedDelta < -15) {
        if (header.classList.contains('is-hidden')) {
          header.classList.remove('is-hidden');
        }
      }
    }
  }

  lastY = y;
};

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener('scroll', onScroll, { passive: true });
updateHeader();

// Footer Architecture & Metrics Disclosure Accordion
const footerDisclosure = document.querySelector('.footer-metrics-disclosure');
if (footerDisclosure) {
  const summary = footerDisclosure.querySelector('summary');
  const content = footerDisclosure.querySelector('.footer-metrics-content-wrapper');

  if (summary && content) {
    let anim = null;
    let isClosing = false;
    let isExpanding = false;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        footerDisclosure.open = !footerDisclosure.open;
        return;
      }

      footerDisclosure.style.overflow = 'hidden';

      const runAnim = (startH, endH, duration, onComplete, onCancel) => {
        if (anim) anim.cancel();
        anim = footerDisclosure.animate(
          { height: [startH, endH] },
          { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
        anim.onfinish = onComplete;
        anim.oncancel = onCancel;
      };

      if (isClosing || !footerDisclosure.open) {
        isExpanding = true;
        footerDisclosure.style.height = `${footerDisclosure.offsetHeight}px`;
        footerDisclosure.open = true;

        requestAnimationFrame(() => {
          const startH = `${footerDisclosure.offsetHeight}px`;
          const endH = `${summary.offsetHeight + content.offsetHeight}px`;

          runAnim(
            startH,
            endH,
            800,
            () => {
              footerDisclosure.open = true;
              anim = null;
              isExpanding = false;
              footerDisclosure.style.height = '';
              footerDisclosure.style.overflow = '';
            },
            () => {
              isExpanding = false;
            }
          );

          const scrollStart = performance.now();
          const step = (now) => {
            if (!footerDisclosure.open || isClosing) return;
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
            if (now - scrollStart < 850) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      } else if (isExpanding || footerDisclosure.open) {
        isClosing = true;
        const startH = `${footerDisclosure.offsetHeight}px`;
        const endH = `${summary.offsetHeight}px`;

        runAnim(
          startH,
          endH,
          700,
          () => {
            footerDisclosure.open = false;
            anim = null;
            isClosing = false;
            footerDisclosure.style.height = '';
            footerDisclosure.style.overflow = '';
          },
          () => {
            isExpanding = false;
          }
        );
      }
    });
  }
}

// Interactive 3D Earth Globe Follower & Easter Egg
const countriesStat = document.querySelector('.podcast-stat-item--countries');
const globeFollower = countriesStat?.querySelector('.globe-easter-egg');

if (countriesStat && globeFollower) {
  let statRect = null;
  let tooltipTimeout = null;

  const getRect = () => {
    if (!statRect) statRect = countriesStat.getBoundingClientRect();
    return statRect;
  };

  const updatePosition = (e) => {
    const rect = getRect();
    globeFollower.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
    globeFollower.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
  };

  countriesStat.addEventListener('pointerenter', (e) => {
    statRect = countriesStat.getBoundingClientRect();
    updatePosition(e);
  }, { passive: true });

  countriesStat.addEventListener('pointermove', updatePosition, { passive: true });

  countriesStat.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    updatePosition(e);

    globeFollower.classList.remove('is-inspecting');
    globeFollower.getAnimations().forEach((anim) => anim.cancel());
    requestAnimationFrame(() => {
      globeFollower.classList.add('is-inspecting');
    });

    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      globeFollower.classList.remove('is-inspecting');
    }, 2400);
  });

  countriesStat.addEventListener('pointerleave', () => {
    clearTimeout(tooltipTimeout);
    statRect = null;
    globeFollower.classList.remove('is-inspecting');
  });
}

// Live Core Web Vitals Monitoring
(() => {
  const lcpEl = document.getElementById('cwv-lcp');
  const clsEl = document.getElementById('cwv-cls');
  const inpEl = document.getElementById('cwv-inp');

  if (!lcpEl && !clsEl && !inpEl) return;

  const updateLCP = (val) => {
    if (lcpEl) lcpEl.textContent = `${(val / 1000).toFixed(2)}s`;
  };

  let clsValue = 0;
  const updateCLS = (val) => {
    if (clsEl) clsEl.textContent = val.toFixed(2);
  };

  let maxInp = 0;
  const updateINP = (val) => {
    if (inpEl) inpEl.textContent = `${Math.max(1, Math.round(val))}ms`;
  };

  if ('PerformanceObserver' in window) {
    const supportedTypes = PerformanceObserver.supportedEntryTypes || [];
    const observePerf = (type, opts, cb) => {
      if (!supportedTypes.includes(type)) return;
      try {
        new PerformanceObserver((list) => cb(list.getEntries())).observe({ type, buffered: true, ...opts });
      } catch {}
    };

    observePerf('largest-contentful-paint', {}, (entries) => {
      if (entries.length > 0) updateLCP(entries[entries.length - 1].startTime);
    });

    observePerf('layout-shift', {}, (entries) => {
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          updateCLS(clsValue);
        }
      }
    });

    if (supportedTypes.includes('event')) {
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > maxInp) {
              maxInp = entry.duration;
              updateINP(maxInp);
            }
          }
        }).observe({ type: 'event', durationThreshold: 0, buffered: true });
      } catch {
        observePerf('event', { durationThreshold: 16 }, (entries) => {
          for (const entry of entries) {
            if (entry.duration > maxInp) {
              maxInp = entry.duration;
              updateINP(maxInp);
            }
          }
        });
      }
    }
  }

  window.addEventListener('load', () => {
    if (lcpEl && lcpEl.textContent === '--' && window.performance) {
      const fcp = performance.getEntriesByType('paint')?.find((e) => e.name === 'first-contentful-paint');
      if (fcp) updateLCP(fcp.startTime);
    }
  }, { passive: true });
})();
