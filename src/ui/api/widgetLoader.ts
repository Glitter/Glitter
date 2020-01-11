import { ipcRenderer } from 'electron';

export const listDevelopmentWidgets = async () => {
  return await ipcRenderer.invoke('api/widgetLoader/listDevelopmentWidgets');
};

export const showSelectDevelopmentWidgetFsDialog = async () => {
  return await ipcRenderer.invoke(
    'api/widgetLoader/showSelectDevelopmentWidgetFsDialog',
  );
};

export const loadDevelopmentWidget = async ({
  path,
  securityScopedBookmark,
}: {
  path: string;
  securityScopedBookmark?: string;
}) => {
  return await ipcRenderer.invoke('api/widgetLoader/loadDevelopmentWidget', {
    path,
    securityScopedBookmark,
  });
};

export const unloadDevelopmentWidget = async ({ id }: { id: string }) => {
  return await ipcRenderer.invoke('api/widgetLoader/unloadDevelopmentWidget', {
    id,
  });
};

export const toggleDevelopmentWidgetActive = async ({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) => {
  return await ipcRenderer.invoke(
    'api/widgetLoader/toggleDevelopmentWidgetActive',
    {
      id,
      active,
    },
  );
};
