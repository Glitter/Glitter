import { ipcMain } from 'electron';
import { getSnapshot } from 'mobx-state-tree';
import { Either, fold } from 'fp-ts/lib/Either';
import catchify from 'catchify';
import { addDevelopmentWidgetInstance } from '@widgetInstantiator/addDevelopmentWidgetInstance';
import { removeDevelopmentWidgetInstance } from '@widgetInstantiator/removeDevelopmentWidgetInstance';
import { listDevelopmentWidgetsInstances } from '@widgetInstantiator/listDevelopmentWidgetsInstances';
import { setDevelopmentWidgetInstancePosition } from '@widgetInstantiator/setDevelopmentWidgetInstancePosition';
import { setDevelopmentWidgetInstanceSettings } from '@widgetInstantiator/setDevelopmentWidgetInstanceSettings';
import { DevelopmentWidgetInstance } from '@appStore/development';

export const api = (): void => {
  ipcMain.handle(
    'api/widgetInstantiator/listDevelopmentWidgetsInstances',
    async () => {
      const developmentWidgetsInstances = fold(
        (): typeof DevelopmentWidgetInstance.Type[] => [],
        (
          x: typeof DevelopmentWidgetInstance.Type[],
        ): typeof DevelopmentWidgetInstance.Type[] => x,
      )(listDevelopmentWidgetsInstances()).map(developmentWidgetInstance =>
        getSnapshot(developmentWidgetInstance),
      );

      return developmentWidgetsInstances;
    },
  );

  ipcMain.handle(
    'api/widgetInstantiator/addDevelopmentWidgetInstance',
    async (
      _event,
      {
        widgetId,
        displayId,
        settings,
      }: {
        widgetId: string;
        displayId: number;
        settings: { [key: string]: string | number };
      },
    ) => {
      const [
        developmentWidgetInstanceAddedError,
        developmentWidgetInstanceAdded,
      ]: [Error, Either<string, string>] = await catchify(
        addDevelopmentWidgetInstance({ widgetId, displayId, settings }),
      );

      if (developmentWidgetInstanceAddedError) {
        return {
          success: false,
          message: developmentWidgetInstanceAddedError.message,
        };
      }

      return fold(
        errorMessage => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(developmentWidgetInstanceAdded);
    },
  );

  ipcMain.handle(
    'api/widgetInstantiator/removeDevelopmentWidgetInstance',
    async (_event, id: string) => {
      const [
        developmentWidgetInstanceRemovedError,
        developmentWidgetInstanceRemoved,
      ]: [Error, Either<string, string>] = await catchify(
        removeDevelopmentWidgetInstance(id),
      );

      if (developmentWidgetInstanceRemovedError) {
        return {
          success: false,
          message: developmentWidgetInstanceRemovedError.message,
        };
      }

      return fold(
        errorMessage => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(developmentWidgetInstanceRemoved);
    },
  );

  ipcMain.handle(
    'api/widgetInstantiator/setDevelopmentWidgetInstancePosition',
    async (
      _event,
      {
        id,
        position,
      }: {
        id: string;
        position: {
          top?: number;
          right?: number;
          bottom?: number;
          left?: number;
        };
      },
    ) => {
      const [positionSetError, positionSet]: [
        Error,
        Either<string, string>,
      ] = await catchify(
        setDevelopmentWidgetInstancePosition({ id, position }),
      );

      if (positionSetError) {
        return {
          success: false,
          message: positionSetError.message,
        };
      }

      return fold(
        errorMessage => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(positionSet);
    },
  );

  ipcMain.handle(
    'api/widgetInstantiator/setDevelopmentWidgetInstanceSettings',
    async (
      _event,
      {
        id,
        settings,
      }: {
        id: string;
        settings: { [key: string]: string | number };
      },
    ) => {
      const [settingsSetError, settingsSet]: [
        Error,
        Either<string, string>,
      ] = await catchify(
        setDevelopmentWidgetInstanceSettings({ id, settings }),
      );

      if (settingsSetError) {
        return {
          success: false,
          message: settingsSetError.message,
        };
      }

      return fold(
        errorMessage => ({
          success: false,
          message: errorMessage,
        }),
        () => ({
          success: true,
        }),
      )(settingsSet);
    },
  );
};
