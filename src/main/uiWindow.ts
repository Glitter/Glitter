import { BrowserWindow } from 'electron';
import appIcon from '@assets/glitter-icon.png';

let uiWindow: Electron.BrowserWindow | null = null;

export const getUiWindow = (): Electron.BrowserWindow => {
  if (uiWindow !== null) {
    return uiWindow as Electron.BrowserWindow;
  }

  uiWindow = new BrowserWindow({
    useContentSize: true,
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Glitter',
    backgroundColor: '#0f1a29',
    icon: process.platform === 'linux' ? appIcon : undefined,
  });
  return uiWindow;
};

export const destroyUiWindow = (): void => {
  uiWindow = null;
};
