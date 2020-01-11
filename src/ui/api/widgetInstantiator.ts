import { ipcRenderer } from 'electron';

export const listDevelopmentWidgetsInstances = async () => {
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
}) => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/addDevelopmentWidgetInstance',
    {
      widgetId,
      displayId,
    },
  );
};

export const removeDevelopmentWidgetInstance = async (id: string) => {
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
}) => {
  return await ipcRenderer.invoke(
    'api/widgetInstantiator/setDevelopmentWidgetInstancePosition',
    {
      id,
      position,
    },
  );
};
