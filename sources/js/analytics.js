window.dataLayer = window.dataLayer || [];
window.gtag = function() { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', 'G-XJEFKVEFGM');

const loadGtag = () => {
  if (window._gtagLoaded) return;
  window._gtagLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XJEFKVEFGM';
  document.head.appendChild(script);
};

['scroll', 'pointerdown', 'keydown'].forEach((e) =>
  window.addEventListener(e, loadGtag, { once: true, passive: true })
);
setTimeout(loadGtag, 3500);
