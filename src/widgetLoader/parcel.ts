import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Either, left, right } from 'fp-ts/lib/Either';
import store from '@appStore/development';
import { getUiWindow } from '@main/uiWindow';
import catchify from 'catchify';
import { getBundlerWindow } from '@main/bundlerWindow';

interface IStartParcelWatcherInput {
  id: string;
}

export const startParcelWatcher = async ({
  id,
}: IStartParcelWatcherInput): Promise<Either<string, string>> => {
  const widget = store.widgets.find(storeWidget => storeWidget.id === id);

  if (widget === undefined) {
    return left('Could not start the parcel process, please try again');
  }

  const bundlerEntry = path.resolve(widget.path, 'index.html');
  const bundlerConfig = {
    outDir: path.resolve(widget.path, './dist'),
    watch: true,
    minify: false,
    target: 'browser',
    publicUrl: './',
    hmr: true,
    hmrHostname: 'localhost',
  };

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

  const bundlerWindow = await getBundlerWindow();

  bundlerWindow.webContents.send('api/bundler/startParcelWatcher', {
    widget,
    bundlerEntry,
    bundlerConfig,
  });

  return new Promise(resolve => {
    ipcMain.handleOnce(`api/bundler/startedParcelWatcher/${widget.id}`, () => {
      resolve();
    });
  });
};

interface IStopParcelWatcherInput {
  id: string;
}

export const stopParcelWatcher = async ({
  id,
}: IStopParcelWatcherInput): Promise<Either<string, string>> => {
  const bundlerWindow = await getBundlerWindow();

  bundlerWindow.webContents.send('api/bundler/stopParcelWatcher', {
    widgetId: id,
  });

  return right('Parcel process successfully stopped');
};
