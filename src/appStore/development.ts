/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';
import catchify from 'catchify';
import uuid from 'uuid/v4';
import persist from '@appStore/persist';

export const DevelopmentWidgetConfig = types.model({
  title: types.string,
  subtitle: types.optional(types.string, ''),
  type: types.string,
  version: types.string,
  description: types.optional(types.string, ''),
  active: types.boolean,
  width: types.number,
  height: types.number,
});

export const DevelopmentWidget = types.model({
  path: types.string,
  config: DevelopmentWidgetConfig,
  id: types.optional(types.identifier, uuid),
  securityScopedBookmark: types.maybe(types.string),
});

export const DevelopmentWidgetInstance = types.model({
  id: types.string,
  widget: types.reference(DevelopmentWidget),
  displayId: types.number,
  position: types.model({
    top: types.maybe(types.number),
    right: types.maybe(types.number),
    bottom: types.maybe(types.number),
    left: types.maybe(types.number),
  }),
});

const DevelopmentWidgetsInstances = types.array(DevelopmentWidgetInstance);

export const Store = types
  .model('Store', {
    widgets: types.array(DevelopmentWidget),
    widgetsInstances: DevelopmentWidgetsInstances,
  })
  .actions(self => {
    const addWidgetInstance = ({
      widgetId,
      displayId,
      id,
    }: {
      widgetId: string;
      displayId: number;
      id: string;
    }) => {
      self.widgetsInstances.push({
        id,
        widget: widgetId,
        displayId,
        position: {
          top: 0,
          right: undefined,
          bottom: undefined,
          left: 0,
        },
      });
    };
    const removeWidgetInstance = (id: string) => {
      const widgetInstanceIndex = self.widgetsInstances.findIndex(
        widgetInstance => widgetInstance.id === id,
      );

      if (widgetInstanceIndex === -1) {
        return;
      }

      self.widgetsInstances.splice(widgetInstanceIndex, 1);
    };
    const setWidgetInstancePosition = ({
      id,
      position: { top, right, bottom, left },
    }: {
      id: string;
      position: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
    }) => {
      const widgetInstanceIndex = self.widgetsInstances.findIndex(
        widgetInstance => widgetInstance.id === id,
      );

      if (widgetInstanceIndex === -1) {
        return;
      }

      self.widgetsInstances[widgetInstanceIndex].position = {
        top,
        right,
        bottom,
        left,
      };
    };
    const addWidget = (widget: typeof DevelopmentWidget.Type) => {
      self.widgets.push(widget);
    };
    const updateWidgetConfig = ({
      id,
      config,
    }: {
      id: string;
      config: typeof DevelopmentWidgetConfig.Type;
    }) => {
      const widgetIndex = self.widgets.findIndex(widget => widget.id === id);

      if (widgetIndex === -1) {
        return;
      }

      self.widgets[widgetIndex].config = config;
    };
    const removeWidget = (id: string) => {
      const widgetIndex = self.widgets.findIndex(widget => widget.id === id);

      if (widgetIndex === -1) {
        return;
      }

      const widgetInstancesToRemove = self.widgetsInstances.filter(
        widgetInstance => widgetInstance.widget.id,
      );

      if (widgetInstancesToRemove.length > 0) {
        widgetInstancesToRemove.forEach(widgetInstanceToRemove => {
          removeWidgetInstance(widgetInstanceToRemove.id);
        });
      }

      self.widgets.splice(widgetIndex, 1);
    };
    const toggleWidgetActive = ({
      id,
      active,
    }: {
      id: string;
      active: boolean;
    }) => {
      const widgetIndex = self.widgets.findIndex(widget => widget.id === id);

      if (widgetIndex === -1) {
        return;
      }

      self.widgets[widgetIndex].config.active = active;
    };

    return {
      addWidgetInstance,
      updateWidgetConfig,
      removeWidgetInstance,
      setWidgetInstancePosition,
      addWidget,
      removeWidget,
      toggleWidgetActive,
    };
  });

export const store = Store.create({
  widgets: [],
  widgetsInstances: [],
});

export const init = async (): Promise<typeof Store.Type> => {
  await catchify(persist({ name: 'development', store }));

  return store;
};

export default store;
