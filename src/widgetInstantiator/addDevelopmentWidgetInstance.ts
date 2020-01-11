import uuid from 'uuid/v4';
import store from '@appStore/development';
import { Either, left, right } from 'fp-ts/lib/Either';

interface IAddDevelopmentWidgetInstanceInput {
  widgetId: string;
  displayId: number;
}

export const addDevelopmentWidgetInstance = async ({
  widgetId,
  displayId,
}: IAddDevelopmentWidgetInstanceInput): Promise<Either<string, string>> => {
  const widget = store.widgets.find(storeWidget => storeWidget.id === widgetId);

  if (widget === undefined) {
    return left('Could not find a development widget, please try again');
  }

  store.addWidgetInstance({
    widgetId,
    displayId,
    id: uuid(),
  });

  return right('Widget instance successfully created');
};
