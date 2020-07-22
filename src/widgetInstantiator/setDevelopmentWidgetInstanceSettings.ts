import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';

interface SetDevelopmentWidgetInstanceSettingsInputInterface {
  id: string;
  settings: { [key: string]: string | number };
}

export const setDevelopmentWidgetInstanceSettings = async ({
  id,
  settings,
}: SetDevelopmentWidgetInstanceSettingsInputInterface): Promise<
  Either<string, string>
> => {
  const widgetInstance = store.widgetsInstances.find(
    (storeWidgetInstance) => storeWidgetInstance.id === id,
  );

  if (widgetInstance === undefined) {
    return left('Could not find a widget instance, please try again');
  }

  store.setWidgetInstanceSettings({
    id,
    settings,
  });

  return right('Widget instance successfully updated');
};
