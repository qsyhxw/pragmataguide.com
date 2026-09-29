(function () {
  'use strict';

  var CONTAINER_ID = 'container-f1af66866cc5383aaa85c11c3fb2bc5b';

  function hasRenderedAd(container) {
    if (container.querySelector('iframe[src], img[src], video, object, embed')) {
      return true;
    }

    return Array.prototype.some.call(container.querySelectorAll('a[href]'), function (link) {
      return Boolean(link.textContent.trim() || link.querySelector('img, picture, svg'));
    });
  }

  function watchNativeAd(adRegion) {
    if (adRegion.dataset.adWatcherReady === 'true') {
      return;
    }

    var container = adRegion.querySelector('#' + CONTAINER_ID);
    var providerScript = adRegion.querySelector('script[src*="bauval.org/21/f1af66866cc5383aaa85c11c3fb2bc5b"]');

    if (!container || !providerScript) {
      return;
    }

    adRegion.dataset.adWatcherReady = 'true';

    function revealWhenFilled() {
      if (!hasRenderedAd(container)) {
        return;
      }

      adRegion.dataset.adState = 'filled';
      adRegion.removeAttribute('aria-hidden');
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

    revealWhenFilled();
  }

  function initializeNativeAds() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-native-ad]'), watchNativeAd);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNativeAds, { once: true });
  } else {
    initializeNativeAds();
  }
})();
