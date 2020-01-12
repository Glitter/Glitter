import { ipcRenderer } from 'electron';
import { DevelopmentWidgetsInstancesValue } from '@ui/store';

export const listDevelopmentWidgetsInstances = async (): Promise<typeof DevelopmentWidgetsInstancesValue.Type> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/listDevelopmentWidgetsInstances',
  );
};

export const addDevelopmentWidgetInstance = async ({
  widgetId,
  displayId,
}: {
  widgetId: string;
  displayId: number;
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/addDevelopmentWidgetInstance',
    {
      widgetId,
      displayId,
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
