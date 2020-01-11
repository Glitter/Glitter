import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';

export const removeDevelopmentWidgetInstance = async (
  id: string,
): Promise<Either<string, string>> => {
  const widgetInstance = store.widgetsInstances.find(
    widgetInstance => widgetInstance.id === id,
  );

  if (widgetInstance === undefined) {
    return left('Could not find the widget instance, please try again');
  }

  store.removeWidgetInstance(id);

  return right('Widget instance successfully removed');
};
