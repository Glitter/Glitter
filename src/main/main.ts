declare var MAIN_WINDOW_WEBPACK_ENTRY: string;
import { app, shell } from 'electron';
import { fold } from 'fp-ts/lib/Either';
import { api as initApi } from '@main/api';
import {
  init as initDevelopmentStore,
  store,
  DevelopmentWidget,
} from '@appStore/development';
import { getUiWindow, destroyUiWindow } from '@main/uiWindow';
import { getBundlerWindow } from '@main/bundlerWindow';
import { listDevelopmentWidgets } from '@widgetLoader/listDevelopmentWidgets';
import { startParcelWatcher } from '@widgetLoader/parcel';
import {
  init as displayDevelopmentWidgetsInstances,
  aliveWidgetsInstances,
  destroyWidgetInstance,
} from '@widgetInstantiator/displayDevelopmentWidgetInstances';
import fixPath from './fixPath';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

app.isPackaged && fixPath();

const instantiateUi = async () => {
  const uiWindow = getUiWindow();

  uiWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  // Try to keep the widgets at the bottom
  // We disable it on Windows due to buggy behavior
  if (process.platform !== 'win32') {
    uiWindow.on('focus', () => {
      aliveWidgetsInstances.forEach(widgetWindow => {
        widgetWindow.blur();
      });
    });
  }

  // Emitted when the window is closed.
  uiWindow.on('closed', () => {
    destroyUiWindow();
  });

  return uiWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

const instantiateBundler = async () => {
  await getBundlerWindow();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Timeout necessary on Linux due to transparency bug
  // https://github.com/electron/electron/issues/2170
  const initUi = () =>
    new Promise(resolve => {
      setTimeout(() => {
        instantiateUi().then(() => {
          resolve();
        });
      }, 500);
    });

  initDevelopmentStore()
    .then(() => {
      initApi({
        uiWindow: getUiWindow(),
      });
    })
    .then(initUi)
    .then(instantiateBundler)
    .then(displayDevelopmentWidgetsInstances)
    .then(() => {
      // When the application just started, we want to automatically start the
      // bundling of all active development widgets
      const activeDevelopmentWidgets = fold(
        () => [],
        (widgets: typeof DevelopmentWidget.Type[]) =>
          widgets.filter(widget => widget.config.active === true),
      )(listDevelopmentWidgets());

      if (activeDevelopmentWidgets.length === 0) {
        return;
      }

      return Promise.all(
        activeDevelopmentWidgets.map(widget => {
          return startParcelWatcher({ id: widget.id }).then(() => {
            const widgetInstances = store.widgetsInstances.filter(
              widgetInstance => widgetInstance.widget.id === widget.id,
            );

            if (widgetInstances.length === 0) {
              return;
            }

            widgetInstances.forEach(widgetInstance => {
              destroyWidgetInstance(widgetInstance.id);
            });

            process.nextTick(displayDevelopmentWidgetsInstances);
          });
        }),
      );
    });
});
