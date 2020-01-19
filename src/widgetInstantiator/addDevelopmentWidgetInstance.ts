import uuid from 'uuid/v4';
import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';

interface AddDevelopmentWidgetInstanceInputInterface {
  widgetId: string;
  displayId: number;
  settings: { [key: string]: string | number };
}

export const addDevelopmentWidgetInstance = async ({
  widgetId,
  displayId,
  settings,
}: AddDevelopmentWidgetInstanceInputInterface): Promise<Either<
  string,
  string
>> => {
  const widget = store.widgets.find(storeWidget => storeWidget.id === widgetId);

  if (widget === undefined) {
    return left('Could not find a development widget, please try again');
  }

  store.addWidgetInstance({
    widgetId,
    displayId,
    id: uuid(),
    settings,
  });

  return right('Widget instance successfully created');
};
