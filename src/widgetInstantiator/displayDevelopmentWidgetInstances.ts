import { screen, BrowserWindow, Display, ipcMain } from 'electron';
import { onAction } from 'mobx-state-tree';
import path from 'path';
import urlFormat from 'url';
import { store, DevelopmentWidgetInstance } from '@appStore/development';
import { getUiWindow } from '@main/uiWindow';

export const aliveWidgetsInstances = new Map<string, BrowserWindow>();

const widgetInstanceIsAlive = (widgetInstanceId: string): boolean => {
  return aliveWidgetsInstances.get(widgetInstanceId) !== undefined;
};

export const destroyWidgetInstance = (widgetInstanceId: string): void => {
  const widgetInstanceWindow = aliveWidgetsInstances.get(widgetInstanceId);

  if (widgetInstanceWindow === undefined) {
    return;
  }

  widgetInstanceWindow.destroy();
};

const calculateWidgetInstanceCoordinates = ({
  widgetInstance,
  display,
}: {
  widgetInstance: typeof DevelopmentWidgetInstance.Type;
  display: Display;
}): { x: number; y: number } => {
  const realScreenX =
    widgetInstance.position.left !== undefined
      ? widgetInstance.position.left
      : widgetInstance.position.right !== undefined
      ? display.workAreaSize.width - widgetInstance.position.right
      : 0;
  const realScreenY =
    widgetInstance.position.top !== undefined
      ? widgetInstance.position.top
      : widgetInstance.position.bottom !== undefined
      ? display.workAreaSize.height - widgetInstance.position.bottom
      : 0;

  return {
    x: display.workArea.x + Math.round(realScreenX),
    y: display.workArea.y + Math.round(realScreenY),
  };
};

const createWidgetInstance = ({
  widgetInstance,
  display,
}: {
  widgetInstance: typeof DevelopmentWidgetInstance.Type;
  display: Display;
}): void => {
  const widgetHtml = urlFormat.format({
    protocol: 'file',
    slashes: true,
    pathname: path.resolve(widgetInstance.widget.path, './dist/index.html'),
  });

  const { x, y } = calculateWidgetInstanceCoordinates({
    widgetInstance,
    display,
  });

  // Create a browser window
  const widgetWindowConfiguration = {
    width: widgetInstance.widget.config.width,
    height: widgetInstance.widget.config.height,
    x,
    y,
    frame: false,
    transparent: true,
    useContentSize: true,
    hasShadow: false,
    skipTaskbar: true,
    movable: false,
    resizable: false,
    title: '',
    backgroundColor: '#00FFFFFF',
    webPreferences: {
      nodeIntegration: false,
    },
  };

  if (widgetInstance.widget.config.nodeIntegration === true) {
    widgetWindowConfiguration.webPreferences.nodeIntegration = true;
  }

  const widgetWindow = new BrowserWindow(widgetWindowConfiguration);

  // skipTaskbar option is not working on Ubuntu when set in the initialization
  // options for some weird reason
  widgetWindow.setSkipTaskbar(true);

  // and load the index.html of the app.
  widgetWindow.loadURL(widgetHtml);

  widgetWindow.webContents.on('dom-ready', (): void => {
    // We need to expose widget instance settings to the BrowserWindow
    const settings =
      widgetInstance.settings.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.name]: cur.value,
        };
      }, {}) || {};
    const jsCode = `
      globalThis.Glitter = {
        currentWidget: {
          getSettings() {
            return ${JSON.stringify(settings)};
          },
        },
      };

      globalThis.dispatchEvent(new CustomEvent('GlitterReady', {
        detail: {
          Glitter: globalThis.Glitter,
          settings: globalThis.Glitter.currentWidget.getSettings(),
        }
      }));
    `;

    widgetWindow.webContents.executeJavaScript(jsCode);
  });

  widgetWindow.blur();

  getUiWindow().focus();

  widgetWindow.excludedFromShownWindowsMenu = true;

  // Emitted when the window is closed.
  widgetWindow.on('closed', () => {
    aliveWidgetsInstances.delete(widgetInstance.id);
  });

  if (process.platform !== 'win32') {
    widgetWindow.on('focus', () => {
      widgetWindow.blur();
    });
  }

  aliveWidgetsInstances.set(widgetInstance.id, widgetWindow);
};

const initWidgetsInstances = (): void => {
  const displays = screen.getAllDisplays();

  store.widgetsInstances.forEach((widgetInstance): void => {
    const display = displays.find(({ id }) => widgetInstance.displayId === id);

    if (display === undefined) {
      if (widgetInstanceIsAlive(widgetInstance.id)) {
        // Looks like the screen is gone, let's remove the widget instance
        destroyWidgetInstance(widgetInstance.id);
      }

      return;
    }

    if (widgetInstanceIsAlive(widgetInstance.id)) {
      // Widget instance is already alive, nothing to do here
      return;
    }

    createWidgetInstance({ widgetInstance, display });
  });
};

const repositionWidgetsInstances = (): void => {
  const displays = screen.getAllDisplays();

  aliveWidgetsInstances.forEach((widgetWindow, widgetInstanceId) => {
    const widgetInstance = store.widgetsInstances.find(
      ({ id }) => widgetInstanceId === id,
    );

    if (widgetInstance === undefined) {
      // This should not happen, but it looks like this BrowserWindow widget
      // instance is no longer present, let's clean up
      destroyWidgetInstance(widgetInstanceId);
      return;
    }

    const display = displays.find(({ id }) => widgetInstance.displayId === id);

    if (display === undefined) {
      // This display is no longer active, remove the instance
      destroyWidgetInstance(widgetInstanceId);
      return;
    }

    const { x, y } = calculateWidgetInstanceCoordinates({
      widgetInstance,
      display,
    });

    widgetWindow.setBounds({ x, y });
  });
};

export const init = (): void => {
  initWidgetsInstances();

  screen.on('display-added', initWidgetsInstances);
  screen.on('display-removed', initWidgetsInstances);

  onAction(store, ({ name }) => {
    if (name !== 'addWidgetInstance') {
      return;
    }

    process.nextTick(initWidgetsInstances);
  });

  // Reposition windows on position change
  screen.on('display-added', () => {
    process.nextTick(repositionWidgetsInstances);
    getUiWindow().webContents.send('api/screen/displayAdded');
  });
  screen.on('display-removed', () => {
    process.nextTick(repositionWidgetsInstances);
    getUiWindow().webContents.send('api/screen/displayRemoved');
  });

  onAction(store, ({ name }) => {
    if (name !== 'setWidgetInstancePosition') {
      return;
    }

    process.nextTick(repositionWidgetsInstances);
  });

  // Reload widget instances on widget config update
  onAction(store, ({ name, args }) => {
    if (name !== 'updateWidgetConfig' || args === undefined) {
      return;
    }

    const [{ id }] = args as [{ id: string }];
    const widgetInstances = store.widgetsInstances.filter(
      widgetInstance => widgetInstance.widget.id === id,
    );

    if (widgetInstances.length === 0) {
      return;
    }

    widgetInstances.forEach(widgetInstance => {
      destroyWidgetInstance(widgetInstance.id);
    });

    process.nextTick(initWidgetsInstances);
  });

  // Reload widget instances on widget instance settings update
  onAction(store, ({ name, args }) => {
    if (name !== 'setWidgetInstanceSettings' || args === undefined) {
      return;
    }

    const [{ id }] = args as [{ id: string }];

    if (widgetInstanceIsAlive(id) === false) {
      return;
    }

    destroyWidgetInstance(id);

    process.nextTick(initWidgetsInstances);
  });

  // Remove BrowserWindow when a widget instance is removed
  onAction(store, ({ name, args }) => {
    if (name !== 'removeWidgetInstance' || args === undefined) {
      return;
    }

    const [id] = args as [string];

    if (widgetInstanceIsAlive(id) !== true) {
      return;
    }

    destroyWidgetInstance(id);
  });

  // Reload widget instances on development toggling
  onAction(store, ({ name, args }) => {
    if (name !== 'toggleWidgetActive' || args === undefined) {
      return;
    }

    const [{ id, active }] = args as [{ id: string; active: boolean }];

    if (active !== true) {
      return;
    }

    const widgetInstances = store.widgetsInstances.filter(
      widgetInstance => widgetInstance.widget.id === id,
    );

    if (widgetInstances.length === 0) {
      return;
    }

    ipcMain.removeHandler(`api/bundler/startedParcelWatcher/${id}`);
    ipcMain.handleOnce(`api/bundler/startedParcelWatcher/${id}`, () => {
      widgetInstances.forEach(widgetInstance => {
        destroyWidgetInstance(widgetInstance.id);
      });

      process.nextTick(initWidgetsInstances);
    });
  });
};
