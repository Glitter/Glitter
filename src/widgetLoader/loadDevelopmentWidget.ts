import catchify from 'catchify';
import { v4 as uuid } from 'uuid';
import { cast } from 'mobx-state-tree';
import store, { DevelopmentWidgetConfig } from '@appStore/development';
import { verifyDevelopmentWidget } from '@widgetLoader/verifyDevelopmentWidget';
import { Either, left, right, isLeft } from 'fp-ts/lib/Either';
import { startWidgetBundler } from '@widgetLoader/bundler';

interface LoadDevelopmentWidgetInputInterface {
  dir: string;
  securityScopedBookmark?: string;
}

export const loadDevelopmentWidget = async ({
  dir,
  securityScopedBookmark,
}: LoadDevelopmentWidgetInputInterface): Promise<Either<string, string>> => {
  const [verifyWidgetError, verifyWidgetResult]: [
    Error,
    Either<string, typeof DevelopmentWidgetConfig.Type>,
  ] = await catchify(verifyDevelopmentWidget({ dir }));

  if (verifyWidgetError) {
    return left(`Failed to verify widget in ${dir}. Something went wrong`);
  }

  if (isLeft(verifyWidgetResult)) {
    return verifyWidgetResult;
  }

  const widgetConfig = verifyWidgetResult.right;

  const existingWidget = store.widgets.find((widget) => widget.path === dir);

  if (existingWidget !== undefined) {
    // This widget is already loaded, we only reload the config
    if (widgetConfig.settings === undefined) {
      widgetConfig.settings = cast([]);
    }

    store.updateWidgetConfig({
      id: existingWidget.id,
      config: { ...existingWidget.config, ...widgetConfig },
    });
    return right('Widget successfully updated');
  }

  const widgetId = uuid();

  store.addWidget({
    path: dir,
    config: {
      ...widgetConfig,
      active: false,
    },
    id: widgetId,
    securityScopedBookmark,
  });

  const [startWidgetBundlerError, startedWidgetBundler]: [
    Error,
    Either<string, { port: number }>,
  ] = await catchify(startWidgetBundler({ id: widgetId }));

  if (startWidgetBundlerError !== null || isLeft(startedWidgetBundler)) {
    return left('Could not start the widget bundling');
  }

  store.toggleWidgetActive({
    id: widgetId,
    active: true,
    port: startedWidgetBundler.right.port,
  });

  return right('Widget successfully loaded');
};
