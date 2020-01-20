import catchify from 'catchify';
import uuid from 'uuid/v4';
import { cast } from 'mobx-state-tree';
import store, { DevelopmentWidgetConfig } from '@appStore/development';
import { verifyDevelopmentWidget } from '@widgetLoader/verifyDevelopmentWidget';
import { Either, left, right, isLeft } from 'fp-ts/lib/Either';
import { startParcelWatcher } from '@widgetLoader/parcel';

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

  const existingWidget = store.widgets.find(widget => widget.path === dir);

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
    config: widgetConfig,
    id: widgetId,
    securityScopedBookmark,
  });

  if (widgetConfig.active === true) {
    setTimeout(() => {
      startParcelWatcher({ id: widgetId });
    }, 2000);
  }

  return right('Widget successfully loaded');
};
