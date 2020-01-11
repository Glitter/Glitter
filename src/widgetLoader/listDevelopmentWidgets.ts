import { Either, right } from 'fp-ts/lib/Either';
import developmentStore, { DevelopmentWidget } from '@appStore/development';

export const listDevelopmentWidgets = (): Either<
  never,
  typeof DevelopmentWidget.Type[]
> => {
  return right(developmentStore.widgets);
};
