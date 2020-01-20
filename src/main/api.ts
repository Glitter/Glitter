import { api as initWidgetLoaderApi } from '@widgetLoader/api';
import { api as initWidgetCreatorApi } from '@widgetCreator/api';
import { api as initWidgetInstantiatorApi } from '@widgetInstantiator/api';

export const api = ({
  uiWindow,
}: {
  uiWindow: Electron.BrowserWindow | null;
}): void => {
  initWidgetLoaderApi({
    uiWindow,
  });
  initWidgetCreatorApi({
    uiWindow,
  });
  initWidgetInstantiatorApi();
};
