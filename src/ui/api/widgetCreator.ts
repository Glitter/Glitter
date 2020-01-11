import { ipcRenderer } from 'electron';

export const showCreateDevelopmentWidgetFsDialog = async () => {
  return await ipcRenderer.invoke(
    'api/widgetCreator/showCreateDevelopmentWidgetFsDialog',
  );
};

export const createDevelopmentWidget = async ({
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
  type: string;
  description?: string;
  active: boolean;
  width: number;
  height: number;
}) => {
  return await ipcRenderer.invoke('api/widgetCreator/createDevelopmentWidget', {
    path,
    title,
    subtitle,
    type,
    description,
    active,
    width,
    height,
  });
};
