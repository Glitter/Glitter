import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';
import { stopWidgetBundler } from '@widgetLoader/bundler';
import { destroyWidgetInstance } from '@widgetInstantiator/displayDevelopmentWidgetInstances';

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

  const widgetInstancesToRemove = store.widgetsInstances.filter(
    (widgetInstance) => widgetInstance.widget.id,
  );

  widgetInstancesToRemove.forEach((widgetInstance) => {
    destroyWidgetInstance(widgetInstance.id);
  });

  store.removeWidget(id);

  return right('Widget successfully unloaded');
};
