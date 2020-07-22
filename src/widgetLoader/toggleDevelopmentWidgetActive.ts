import { Either, left, right, isLeft } from 'fp-ts/lib/Either';
import catchify from 'catchify';
import store from '@appStore/development';
import { startWidgetBundler, stopWidgetBundler } from '@widgetLoader/bundler';

interface ToggleDevelopmentWidgetActiveInputInterface {
  id: string;
  active: boolean;
}

export const toggleDevelopmentWidgetActive = async ({
  id,
  active,
}: ToggleDevelopmentWidgetActiveInputInterface): Promise<
  Either<string, string>
> => {
  const widget = store.widgets.find((storeWidget) => storeWidget.id === id);

  if (widget === undefined) {
    return left('Could not toggle widget active state, please try again');
  }

  if (active === true) {
    const [startWidgetBundlerError, startedWidgetBundler]: [
      Error,
      Either<string, { port: number }>,
    ] = await catchify(startWidgetBundler({ id }));

    if (startWidgetBundlerError !== null || isLeft(startedWidgetBundler)) {
      return left('Could not toggle widget active state, please try again');
    }

    store.toggleWidgetActive({
      id,
      active,
      port: startedWidgetBundler.right.port,
    });
    return right('Widget successfully activated');
  }

  store.toggleWidgetActive({
    id,
    active,
  });

  await catchify(stopWidgetBundler({ id }));
  return right('Widget successfully deactivated');
};
