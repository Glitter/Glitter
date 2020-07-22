import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';
import { stopWidgetBundler } from '@widgetLoader/bundler';

interface UnloadDevelopmentWidgetInputInterface {
  id: string;
}

export const unloadDevelopmentWidget = async ({
  id,
}: UnloadDevelopmentWidgetInputInterface): Promise<Either<string, string>> => {
  const widgetToUnload = store.widgets.find((widget) => widget.id === id);

  if (widgetToUnload === undefined) {
    return left('Could not unload widgets, please try again');
  }

  if (widgetToUnload.config.active === true) {
    stopWidgetBundler({ id: widgetToUnload.id });
  }

  store.removeWidget(id);

  return right('Widget successfully unloaded');
};
