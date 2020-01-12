declare var BUNDLER_WINDOW_WEBPACK_ENTRY: string;
import { BrowserWindow } from 'electron';

let bundlerWindow: Electron.BrowserWindow | null = null;

export const getBundlerWindow = async (): Promise<Electron.BrowserWindow> => {
  if (bundlerWindow !== null) {
    return bundlerWindow as Electron.BrowserWindow;
  }

  bundlerWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    title: '',
    // show: false,
  });

  await bundlerWindow.loadURL(BUNDLER_WINDOW_WEBPACK_ENTRY);

  return bundlerWindow;
};
