(function () {
  const SYNC_PARAM = 'local_sync';

  function isLocalUrl(url) {
    return url && !/^(about:blank|data:|blob:|https?:|mailto:|tel:|#)/i.test(url);
  }

  function withSyncParam(url, token) {
    if (!isLocalUrl(url)) return url;
    const parts = String(url).split('#');
    const hash = parts.length > 1 ? `#${parts.slice(1).join('#')}` : '';
    const base = parts[0];
    const joiner = base.includes('?') ? '&' : '?';
    const clean = base.replace(new RegExp(`([?&])${SYNC_PARAM}=[^&#]*&?`, 'g'), '$1').replace(/[?&]$/, '');
    return `${clean}${clean.includes('?') ? '&' : joiner}${SYNC_PARAM}=${encodeURIComponent(token)}${hash}`;
  }

  function framePath(frame) {
    const raw = frame?.getAttribute('src') || frame?.dataset?.src || '';
    return String(raw).split('#')[0].split('?')[0];
  }

  function reloadFrame(frame, token) {
    if (!frame) return;
    const source = frame.dataset?.src || frame.getAttribute('src') || '';
    if (!isLocalUrl(source)) return;
    const synced = withSyncParam(source, token);
    if (frame.dataset?.src) frame.dataset.src = synced;
    frame.src = synced;
  }

  function initMain(options) {
    const config = options || {};
    const token = String(Date.now());
    const frames = (config.frameIds || [])
      .map(id => document.getElementById(id))
      .filter(Boolean);

    frames.forEach(frame => {
      const source = frame.dataset.src || frame.getAttribute('src');
      const synced = withSyncParam(source, token);
      if (frame.dataset.src) frame.dataset.src = synced;
      if (frame.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') {
        frame.setAttribute('src', synced);
      }
    });

    function refreshAll() {
      const nextToken = String(Date.now());
      frames.forEach(frame => reloadFrame(frame, nextToken));
    }

    function refreshMatching(sourcePath) {
      const nextToken = String(Date.now());
      frames
        .filter(frame => !sourcePath || framePath(frame) === sourcePath)
        .forEach(frame => reloadFrame(frame, nextToken));
    }

    window.addEventListener('message', event => {
      const data = event.data;
      if (!data || data.channel !== 'local-frame-sync') return;

      if (data.type === 'frame-ready' || data.type === 'frame-resize') {
        config.fitAllFrames?.();
        return;
      }

      if (data.type === 'open-calendar') {
        config.openCalendar?.(data.calendar);
        return;
      }

      if (data.type === 'set-module') {
        config.setModule?.(data.module);
        return;
      }

      if (data.type === 'refresh-frame') {
        refreshMatching(data.path);
        return;
      }

      if (data.type === 'refresh-all') {
        refreshAll();
      }
    });

    window.FrameSync.refreshAll = refreshAll;
    window.FrameSync.refreshFrame = refreshMatching;
    return { refreshAll, refreshFrame: refreshMatching };
  }

  window.FrameSync = {
    initMain,
    withSyncParam
  };
})();
