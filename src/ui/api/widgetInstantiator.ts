import { ipcRenderer } from 'electron';
import { DevelopmentWidgetsInstancesValue } from '@ui/store';

export const listDevelopmentWidgetsInstances = async (): Promise<
  typeof DevelopmentWidgetsInstancesValue.Type
> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/listDevelopmentWidgetsInstances',
  );
};

export const addDevelopmentWidgetInstance = async ({
  widgetId,
  displayId,
  settings,
}: {
  widgetId: string;
  displayId: number;
  settings: { [key: string]: string | number };
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/addDevelopmentWidgetInstance',
    {
      widgetId,
      displayId,
      settings,
    },
  );
};

export const removeDevelopmentWidgetInstance = async (
  id: string,
): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/removeDevelopmentWidgetInstance',
    id,
  );
};

export const setDevelopmentWidgetInstancePosition = async ({
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
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/setDevelopmentWidgetInstancePosition',
    {
      id,
      position,
    },
  );
};

export const setDevelopmentWidgetInstanceSettings = async ({
  id,
  settings,
}: {
  id: string;
  settings: { [key: string]: string | number };
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/setDevelopmentWidgetInstanceSettings',
    {
      id,
      settings,
    },
  );
};
