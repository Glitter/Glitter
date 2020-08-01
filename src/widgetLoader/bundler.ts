import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Either, left, right } from 'fp-ts/lib/Either';
import getPort from 'get-port';
import store from '@appStore/development';
import { getUiWindow } from '@main/uiWindow';
import catchify from 'catchify';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nativeRequire = require('../main/node/nativeRequire');
const { createServer, resolveConfig } = nativeRequire('vite');

const widgetBundlers = new Map();

interface StartWidgetBundlerInputInterface {
  id: string;
}

export const startWidgetBundler = async ({
  id,
}: StartWidgetBundlerInputInterface): Promise<
  Either<string, { port: number }>
> => {
  const widget = store.widgets.find((storeWidget) => storeWidget.id === id);

  if (widget === undefined) {
    return left('Could not start the widget bundler, please try again');
  }

  const bundlerEntry = path.resolve(widget.path, 'index.html');

  // Verify entry exists
  const [entryExistsError, entryExists]: [Error, boolean] = await catchify(
    fs.pathExists(bundlerEntry),
  );

  if (entryExistsError || !entryExists) {
    getUiWindow().webContents.send('api/logs/addWidgetLog', {
      id: widget.id,
      text: `Could not read ${bundlerEntry}`,
    });
    return left(`Could not read ${bundlerEntry}`);
  }

  const alreadyWatching = widgetBundlers.get(widget.id);

  if (alreadyWatching !== undefined) {
    return right({
      port: alreadyWatching.port,
    });
  }

  getUiWindow().webContents.send('api/logs/addWidgetLog', {
    id,
    text: 'Starting bundling',
  });

  const config = await resolveConfig(
    'development',
    path.resolve(__dirname, './vite.config.js'),
  );
  const bundler = createServer({
    ...config,
    root: widget.path,
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-types
  let stopAccessingSecurityScopedResource: Function = () => {};

  if (widget.securityScopedBookmark) {
    // OSX only, needed to be able to write to the directory through the widget bundler
    stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(
      widget.securityScopedBookmark,
    );
  }

  await bundler.listen(await getPort());

  widgetBundlers.set(widget.id, {
    bundler,
    port: bundler.address().port,
    stopAccessingSecurityScopedResource,
  });

  getUiWindow().webContents.send('api/logs/addWidgetLog', {
    id,
    text: 'Bundling started',
  });

  return right({
    port: bundler.address().port,
  });
};

interface StopWidgetBundlerInputInterface {
  id: string;
}

export const stopWidgetBundler = async ({
  id,
}: StopWidgetBundlerInputInterface): Promise<Either<string, string>> => {
  const bundler = widgetBundlers.get(id);

  if (bundler === undefined) {
    return right('Bundler successfully stopped');
  }

  getUiWindow().webContents.send('api/logs/addWidgetLog', {
    id,
    text: 'Stopping bundling',
  });

  await bundler.bundler.close();

  getUiWindow().webContents.send('api/logs/addWidgetLog', {
    id,
    text: 'Bundling stopped',
  });

  bundler.stopAccessingSecurityScopedResource();
  widgetBundlers.delete(id);

  return right('Bundler successfully stopped');
};
