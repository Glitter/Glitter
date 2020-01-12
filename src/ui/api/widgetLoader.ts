import { ipcRenderer } from 'electron';
import { DevelopmentWidgetsValue } from '@ui/store';

export const listDevelopmentWidgets = async (): Promise<typeof DevelopmentWidgetsValue.Type> => {
  return await ipcRenderer.invoke('api/widgetLoader/listDevelopmentWidgets');
};

export const showSelectDevelopmentWidgetFsDialog = async (): Promise<{
  filePaths: string[];
  bookmarks?: string[];
}> => {
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
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke('api/widgetLoader/loadDevelopmentWidget', {
    path,
    securityScopedBookmark,
  });
};

export const unloadDevelopmentWidget = async ({
  id,
}: {
  id: string;
}): Promise<{ success: boolean; message?: string }> => {
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
}): Promise<{ success: boolean; message?: string }> => {
  return await ipcRenderer.invoke(
    'api/widgetLoader/toggleDevelopmentWidgetActive',
    {
      id,
      active,
    },
  );
};
