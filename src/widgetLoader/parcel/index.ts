import { app, ipcRenderer } from 'electron';
const nativeRequire = require('../../main/node/nativeRequire');
const Bundler = nativeRequire('parcel-bundler');

const parcelWatchers = new Map();

ipcRenderer.on(
  'api/bundler/startParcelWatcher',
  async (_event, { widget, bundlerEntry, bundlerConfig }) => {
    const alreadyWatching = parcelWatchers.get(widget.id);

    if (alreadyWatching !== undefined) {
      return;
    }

    const bundler = new Bundler(bundlerEntry, bundlerConfig);
    let stopAccessingSecurityScopedResource: Function = () => {};

    if (widget.securityScopedBookmark) {
      // OSX only, needed to be able to write to the directory through parcel bundler
      stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(
        widget.securityScopedBookmark,
      );
    }

    parcelWatchers.set(widget.id, {
      bundler,
      stopAccessingSecurityScopedResource,
    });

    bundler.on('bundled', () => {
      ipcRenderer.invoke('api/logs/addWidgetLog', {
        id: widget.id,
        text: 'Bundling completed',
      });
    });

    bundler.on('buildError', (error: Error & { fileName?: string }) => {
      let errorMessage =
        error.fileName === undefined
          ? error.message
          : `${error.message} -- in ${error.fileName}`;

      if (errorMessage.includes("Cannot read property 'type' of undefined")) {
        errorMessage = `${errorMessage} - We are working on a fix. Meanwhile, restarting the development should make this issue go away`;
      }

      ipcRenderer.invoke('api/logs/addWidgetLog', {
        id: widget.id,
        text: errorMessage,
      });
    });

    ipcRenderer.invoke('api/logs/addWidgetLog', {
      id: widget.id,
      text:
        'Bundling started, first run might take a while, you will get a message here once the build is completed',
    });

    await bundler.bundle();
    ipcRenderer.invoke(`api/bundler/startedParcelWatcher/${widget.id}`);
  },
);

ipcRenderer.on(
  'api/bundler/stopParcelWatcher',
  async (_event, { widgetId }) => {
    const parcelWatcher = parcelWatchers.get(widgetId);

    if (parcelWatcher === undefined) {
      return;
    }

    ipcRenderer.invoke('api/logs/addWidgetLog', {
      id: widgetId,
      text: 'Stopping bundling',
    });

    await parcelWatcher.bundler.stop();

    ipcRenderer.invoke('api/logs/addWidgetLog', {
      id: widgetId,
      text: 'Bundling stopped',
    });

    parcelWatcher.stopAccessingSecurityScopedResource();
    parcelWatchers.delete(widgetId);
  },
);
