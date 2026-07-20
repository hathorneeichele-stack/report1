(function () {
  function post(type, detail) {
    if (window.parent === window) return;
    window.parent.postMessage({
      channel: 'local-frame-sync',
      type,
      path: window.location.pathname.split('/').pop(),
      title: document.title,
      height: document.documentElement.scrollHeight,
      ...(detail || {})
    }, '*');
  }

  function init() {
    post('frame-ready');

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => post('frame-resize'));
      observer.observe(document.documentElement);
      if (document.body) observer.observe(document.body);
    }

    window.EmbeddedFrameSync.refreshParentFrame = function () {
      post('refresh-frame');
    };
    window.EmbeddedFrameSync.refreshAllFrames = function () {
      post('refresh-all');
    };
    window.EmbeddedFrameSync.openCalendar = function (calendar) {
      post('open-calendar', { calendar });
    };
    window.EmbeddedFrameSync.setModule = function (module) {
      post('set-module', { module });
    };
  }

  window.EmbeddedFrameSync = {
    init
  };
})();
