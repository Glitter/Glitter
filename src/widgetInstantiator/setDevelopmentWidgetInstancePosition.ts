import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';

interface SetDevelopmentWidgetInstancePositionInputInterface {
  id: string;
  position: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const setDevelopmentWidgetInstancePosition = async ({
  id,
  position,
}: SetDevelopmentWidgetInstancePositionInputInterface): Promise<
  Either<string, string>
> => {
  const widgetInstance = store.widgetsInstances.find(
    (storeWidgetInstance) => storeWidgetInstance.id === id,
  );

  if (widgetInstance === undefined) {
    return left('Could not find a widget instance, please try again');
  }

  store.setWidgetInstancePosition({
    id,
    position,
  });

  return right('Widget instance successfully updated');
};
