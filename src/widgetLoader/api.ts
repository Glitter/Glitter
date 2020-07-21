import electron from 'electron';
import { ipcMain } from 'electron';
import { getSnapshot } from 'mobx-state-tree';
import { Either, fold } from 'fp-ts/lib/Either';
import catchify from 'catchify';
import { listDevelopmentWidgets } from '@widgetLoader/listDevelopmentWidgets';
import { loadDevelopmentWidget } from '@widgetLoader/loadDevelopmentWidget';
import { unloadDevelopmentWidget } from '@widgetLoader/unloadDevelopmentWidget';
import { toggleDevelopmentWidgetActive } from '@widgetLoader/toggleDevelopmentWidgetActive';
import { DevelopmentWidget } from '@appStore/development';
import { getUiWindow } from '@main/uiWindow';

export const api = ({
  uiWindow,
}: {
  uiWindow: Electron.BrowserWindow | null;
}): void => {
  ipcMain.handle('api/widgetLoader/listDevelopmentWidgets', async () => {
    const developmentWidgets = fold(
      (): typeof DevelopmentWidget.Type[] => [],
      (x: typeof DevelopmentWidget.Type[]): typeof DevelopmentWidget.Type[] =>
        x,
    )(listDevelopmentWidgets()).map((developmentWidget) =>
      getSnapshot(developmentWidget),
    );

    return developmentWidgets;
  });

  ipcMain.handle(
    'api/widgetLoader/showSelectDevelopmentWidgetFsDialog',
    async () => {
      return electron.dialog.showOpenDialog(
        uiWindow as Electron.BrowserWindow,
        {
          properties: ['openDirectory'],
        },
      );
    },
  );

  ipcMain.handle(
    'api/widgetLoader/loadDevelopmentWidget',
    async (_event, { path, securityScopedBookmark }) => {
      const [widgetLoadedError, widgetLoaded]: [
        Error,
        Either<string, string>,
      ] = await catchify(
        loadDevelopmentWidget({ dir: path, securityScopedBookmark }),
      );

      if (widgetLoadedError) {
        return {
          success: false,
          message: widgetLoadedError.message,
        };
      }

      return fold(
        (errorMessage) => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(widgetLoaded);
    },
  );

  ipcMain.handle(
    'api/widgetLoader/unloadDevelopmentWidget',
    async (_event, { id }) => {
      const [widgetUnloadedError, widgetUnloaded]: [
        Error,
        Either<string, string>,
      ] = await catchify(unloadDevelopmentWidget({ id }));

      if (widgetUnloadedError) {
        return {
          success: false,
          message: widgetUnloadedError.message,
        };
      }

      return fold(
        (errorMessage) => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(widgetUnloaded);
    },
  );

  ipcMain.handle(
    'api/widgetLoader/toggleDevelopmentWidgetActive',
    async (_event, { id, active }) => {
      const [widgetActiveToggledError, widgetActiveToggled]: [
        Error,
        Either<string, string>,
      ] = await catchify(toggleDevelopmentWidgetActive({ id, active }));

      if (widgetActiveToggledError) {
        return {
          success: false,
          message: widgetActiveToggledError.message,
        };
      }

      return fold(
        (errorMessage) => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(widgetActiveToggled);
    },
  );

  // Handle cross-window communication (needed for our bundling window to
  // communicate to the main ui)
  ipcMain.handle('api/logs/addWidgetLog', async (_event, { id, text }) => {
    getUiWindow().webContents.send('api/logs/addWidgetLog', {
      id,
      text,
    });
  });
};
