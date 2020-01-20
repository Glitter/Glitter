import { Either, left, right } from 'fp-ts/lib/Either';
import store from '@appStore/development';
import { startParcelWatcher, stopParcelWatcher } from '@widgetLoader/parcel';

interface ToggleDevelopmentWidgetActiveInputInterface {
  id: string;
  active: boolean;
}

export const toggleDevelopmentWidgetActive = async ({
  id,
  active,
}: ToggleDevelopmentWidgetActiveInputInterface): Promise<Either<
  string,
  string
>> => {
  const widget = store.widgets.find(storeWidget => storeWidget.id === id);

  if (widget === undefined) {
    return left('Could not toggle widget active state, please try again');
  }

  store.toggleWidgetActive({ id, active });

  if (active === true) {
    await startParcelWatcher({ id });
    return right('Widget successfully activated');
  }

  await stopParcelWatcher({ id });
  return right('Widget successfully deactivated');
};
