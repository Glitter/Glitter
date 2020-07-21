import { app, ipcRenderer } from 'electron';
import nodeConsole from 'console';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nativeRequire = require('../../main/node/nativeRequire');
const { createServer, resolveConfig } = nativeRequire('vite');
const viteConfig = require.resolve('./vite.config');

const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const widgetBundlers = new Map();

ipcRenderer.on('api/bundler/startWidgetBundler', async (_event, { widget }) => {
  const alreadyWatching = widgetBundlers.get(widget.id);

  if (alreadyWatching !== undefined) {
    ipcRenderer.invoke(`api/bundler/startWidgetBundlerCompleted/${widget.id}`, {
      port: alreadyWatching.port,
    });
    return;
  }

  myConsole.log('Gonna create a bundler soon', viteConfig);

  const config = await resolveConfig('development', viteConfig);
  const bundler = createServer({
    ...config,
    roo: widget.path,
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-types
  let stopAccessingSecurityScopedResource: Function = () => {};

  if (widget.securityScopedBookmark) {
    // OSX only, needed to be able to write to the directory through parcel bundler
    stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(
      widget.securityScopedBookmark,
    );
  }

  myConsole.log('Will ask bundler to listen soon');

  await bundler.listen(0);

  myConsole.log('Bundler is listening now!');

  widgetBundlers.set(widget.id, {
    bundler,
    port: bundler.address().port,
    stopAccessingSecurityScopedResource,
  });

  ipcRenderer.invoke('api/logs/addWidgetLog', {
    id: widget.id,
    text: 'Bundling started',
  });

  await bundler.bundle();
  ipcRenderer.invoke(`api/bundler/startedWidgetBundler/${widget.id}`, {
    port: bundler.address().port,
  });
  ipcRenderer.invoke(`api/bundler/startWidgetBundlerCompleted/${widget.id}`, {
    port: bundler.address().port,
  });
});

ipcRenderer.on(
  'api/bundler/stopWidgetBundler',
  async (_event, { widgetId }) => {
    const bundler = widgetBundlers.get(widgetId);

    if (bundler === undefined) {
      return;
    }

    ipcRenderer.invoke('api/logs/addWidgetLog', {
      id: widgetId,
      text: 'Stopping bundling',
    });

    await bundler.bundler.stop();

    ipcRenderer.invoke('api/logs/addWidgetLog', {
      id: widgetId,
      text: 'Bundling stopped',
    });

    bundler.stopAccessingSecurityScopedResource();
    widgetBundlers.delete(widgetId);
  },
);
