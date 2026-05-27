window.dataLayer = window.dataLayer || [];
window.gtag = function() {
  window.dataLayer.push(arguments);
};
window.gtag('js', new Date());
window.gtag('config', 'G-XJEFKVEFGM');

(function() {
  var loaded = false;
  function loadGtag() {
    if (loaded) return;
    loaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XJEFKVEFGM';
    document.head.appendChild(script);
  }

  // Delay loading until interaction
  var events = ['scroll', 'mousemove', 'mousedown', 'touchstart', 'keydown'];
  events.forEach(function(event) {
    window.addEventListener(event, loadGtag, { once: true, passive: true });
  });

  // Fallback: load after load event (with delay)
  if (document.readyState === 'complete') {
    setTimeout(loadGtag, 2000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(loadGtag, 2000);
    });
  }
})();
