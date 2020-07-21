import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Either, left, right } from 'fp-ts/lib/Either';
import store from '@appStore/development';
import { getUiWindow } from '@main/uiWindow';
import catchify from 'catchify';
import { getBundlerWindow } from '@main/bundlerWindow';

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
    return left('Could not start the parcel process, please try again');
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

  const bundlerWindow = await getBundlerWindow();

  bundlerWindow.webContents.send('api/bundler/startWidgetBundler', {
    widget: {
      id: widget.id,
      path: widget.path,
      securityScopedBookmark: widget.securityScopedBookmark,
    },
  });

  return new Promise((resolve) => {
    ipcMain.removeHandler(
      `api/bundler/startWidgetBundlerCompleted/${widget.id}`,
    );
    ipcMain.handleOnce(
      `api/bundler/startWidgetBundlerCompleted/${widget.id}`,
      (_event, { port }) => {
        resolve(right({ port }));
      },
    );
  });
};

interface StopWidgetBundlerInputInterface {
  id: string;
}

export const stopWidgetBundler = async ({
  id,
}: StopWidgetBundlerInputInterface): Promise<Either<string, string>> => {
  const bundlerWindow = await getBundlerWindow();

  bundlerWindow.webContents.send('api/bundler/stopWidgetBundler', {
    widgetId: id,
  });

  return right('Parcel process successfully stopped');
};
