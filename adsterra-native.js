(function () {
  'use strict';

  var AD_SCRIPT_SRC = 'https://bauval.org/21/f1af66866cc5383aaa85c11c3fb2bc5b';
  var CONTAINER_ID = 'container-f1af66866cc5383aaa85c11c3fb2bc5b';

  function hasRenderedAd(container) {
    if (container.querySelector('iframe[src], img[src], video, object, embed')) {
      return true;
    }

    return Array.prototype.some.call(container.querySelectorAll('a[href]'), function (link) {
      return Boolean(link.textContent.trim() || link.querySelector('img, picture, svg'));
    });
  }

  function initializeNativeAd() {
    if (window.__pragmataNativeAdLoaded || document.getElementById(CONTAINER_ID)) {
      return;
    }

    var main = document.querySelector('main');
    var heading = main && main.querySelector('h1');
    var intro = heading && heading.closest('section');

    if (!main || !intro) {
      return;
    }

    window.__pragmataNativeAdLoaded = true;

    var adRegion = document.createElement('section');
    adRegion.className = 'pg-native-ad';
    adRegion.hidden = true;
    adRegion.dataset.adState = 'loading';
    adRegion.setAttribute('aria-label', 'Advertisement');
    var frame = document.createElement('div');
    frame.className = 'pg-native-ad__frame';

    var label = document.createElement('p');
    label.className = 'pg-native-ad__label';
    label.textContent = 'Advertisement';

    var providerScript = document.createElement('script');
    providerScript.async = true;
    providerScript.dataset.cfasync = 'false';
    providerScript.src = AD_SCRIPT_SRC;

    var container = document.createElement('div');
    container.id = CONTAINER_ID;

    frame.appendChild(label);
    frame.appendChild(container);
    adRegion.appendChild(frame);

    intro.insertAdjacentElement('afterend', adRegion);

    function revealWhenFilled() {
      if (!hasRenderedAd(container)) {
        return;
      }

      adRegion.hidden = false;
      adRegion.dataset.adState = 'filled';
    }

    var observer = new MutationObserver(revealWhenFilled);
    observer.observe(container, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });

    container.addEventListener('load', revealWhenFilled, true);
    providerScript.addEventListener('load', revealWhenFilled);
    providerScript.addEventListener('error', function () {
      adRegion.dataset.adState = 'blocked';
    });

    frame.insertBefore(providerScript, container);
    revealWhenFilled();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNativeAd, { once: true });
  } else {
    initializeNativeAd();
  }
})();
