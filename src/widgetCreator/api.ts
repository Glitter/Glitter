import electron from 'electron';
import { ipcMain } from 'electron';
import { Either, fold } from 'fp-ts/lib/Either';
import catchify from 'catchify';
import { createFiles } from '@widgetCreator/createFiles';

export const api = ({
  uiWindow,
}: {
  uiWindow: Electron.BrowserWindow | null;
}): void => {
  ipcMain.handle(
    'api/widgetCreator/showCreateDevelopmentWidgetFsDialog',
    async () => {
      return electron.dialog.showOpenDialog(
        uiWindow as Electron.BrowserWindow,
        {
          properties: ['openDirectory'],
        },
      );
    },
  );

  interface ICreateDevelopmentWidgetReturn {
    success: boolean;
    message?: string;
    path?: string;
  }

  ipcMain.handle(
    'api/widgetCreator/createDevelopmentWidget',
    async (
      _event,
      {
        path,
        title,
        subtitle = '',
        type,
        description = '',
        active,
        width,
        height,
      }: {
        path: string;
        title: string;
        subtitle?: string;
        type: 'vue' | 'react';
        description?: string;
        active: boolean;
        width: number;
        height: number;
      },
    ): Promise<ICreateDevelopmentWidgetReturn> => {
      const [createdFilesError, createdFiles]: [
        Error,
        Either<string, { files: string[]; dir: string }>,
      ] = await catchify(
        createFiles({
          dir: path,
          title,
          subtitle,
          type,
          description,
          active,
          width,
          height,
        }),
      );

      if (createdFilesError) {
        return {
          success: false,
          message: createdFilesError.message,
        };
      }

      return fold(
        (errorMessage: string): ICreateDevelopmentWidgetReturn => ({
          success: false,
          message: errorMessage,
        }),
        ({ dir }: { dir: string }): ICreateDevelopmentWidgetReturn => ({
          success: true,
          path: dir,
        }),
      )(createdFiles);
    },
  );
};
