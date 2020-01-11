import { Either, right } from 'fp-ts/lib/Either';
import developmentStore, {
  DevelopmentWidgetInstance,
} from '@appStore/development';

export const listDevelopmentWidgetsInstances = (): Either<
  never,
  typeof DevelopmentWidgetInstance.Type[]
> => {
  return right(developmentStore.widgetsInstances);
};
