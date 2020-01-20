/* eslint-disable no-param-reassign */
import { types, cast } from 'mobx-state-tree';
import catchify from 'catchify';
import uuid from 'uuid/v4';
import persist from '@appStore/persist';
import { snapshotProcessor } from 'mobx-state-tree/dist/internal';

const DevelopmentWidgetSettingsField = types.model({
  name: types.string,
  type: types.string,
  label: types.string,
  description: types.optional(types.string, ''),
  multiline: types.optional(types.boolean, false),
  inputType: types.optional(
    types.union(
      types.literal('text'),
      types.literal('number'),
      types.literal('email'),
      types.literal('tel'),
      types.literal('color'),
      types.literal('date'),
      types.literal('password'),
      types.literal('time'),
      types.literal('url'),
    ),
    'text',
  ),
  size: types.optional(
    types.union(
      types.literal('small'),
      types.literal('medium'),
      types.literal('large'),
    ),
    'large',
  ),
  required: types.optional(types.boolean, false),
});

const DevelopmentWidgetSettingsField = types.model({
  name: types.string,
  type: types.string,
  label: types.string,
  description: types.optional(types.string, ''),
  multiline: types.optional(types.boolean, false),
  inputType: types.optional(
    types.union(
      types.literal('text'),
      types.literal('number'),
      types.literal('email'),
      types.literal('tel'),
      types.literal('color'),
      types.literal('date'),
      types.literal('password'),
      types.literal('time'),
      types.literal('url'),
    ),
    'text',
  ),
  size: types.optional(
    types.union(
      types.literal('small'),
      types.literal('medium'),
      types.literal('large'),
    ),
    'large',
  ),
  required: types.optional(types.boolean, false),
});

export const DevelopmentWidgetConfig = types.model({
  title: types.string,
  subtitle: types.optional(types.string, ''),
  type: types.string,
  version: types.string,
  description: types.optional(types.string, ''),
  active: types.boolean,
  width: types.number,
  height: types.number,
  settings: types.array(DevelopmentWidgetSettingsField),
});

export const DevelopmentWidget = types.model({
  path: types.string,
  config: DevelopmentWidgetConfig,
  id: types.optional(types.identifier, uuid),
  securityScopedBookmark: types.maybe(types.string),
});

export const DevelopmentWidgetInstanceSettings = types.array(
  types.model({
    name: types.string,
    value: types.union(types.number, types.string),
  }),
);

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
  settings: DevelopmentWidgetInstanceSettings,
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
      settings,
    }: {
      widgetId: string;
      displayId: number;
      id: string;
      settings: { [key: string]: string | number };
    }): void => {
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
        settings: cast(
          Object.keys(settings).reduce(
            (
              acc: { name: string; value: string | number }[],
              curr,
            ): {
              name: string;
              value: string | number;
            }[] => {
              return [...acc, { name: curr, value: settings[curr] }];
            },
            [],
          ),
        ),
      });
    };
    const removeWidgetInstance = (id: string): void => {
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
    }): void => {
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
    const setWidgetInstanceSettings = ({
      id,
      settings,
    }: {
      id: string;
      settings: { [key: string]: string | number };
    }): void => {
      const widgetInstanceIndex = self.widgetsInstances.findIndex(
        widgetInstance => widgetInstance.id === id,
      );

      if (widgetInstanceIndex === -1) {
        return;
      }

      self.widgetsInstances[widgetInstanceIndex].settings = cast(
        Object.keys(settings).reduce(
          (
            acc: { name: string; value: string | number }[],
            curr,
          ): {
            name: string;
            value: string | number;
          }[] => {
            return [...acc, { name: curr, value: settings[curr] }];
          },
          [],
        ),
      );
    };
    const addWidget = (widget: typeof DevelopmentWidget.Type): void => {
      self.widgets.push(widget);
    };
    const updateWidgetConfig = ({
      id,
      config,
    }: {
      id: string;
      config: typeof DevelopmentWidgetConfig.Type;
    }): void => {
      const widgetIndex = self.widgets.findIndex(widget => widget.id === id);

      if (widgetIndex === -1) {
        return;
      }

      self.widgets[widgetIndex].config = config;
    };
    const removeWidget = (id: string): void => {
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
    }): void => {
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
      setWidgetInstanceSettings,
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
  await catchify(
    persist({
      name: 'development',
      store,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modifySnapshot(snapshot): any {
        if (snapshot.widgets === undefined) {
          return snapshot;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {
          ...snapshot,
          widgets: snapshot.widgets.map((widget: any) => {
            if (widget.config.active !== undefined) {
              return widget;
            }

            return {
              ...widget,
              config: {
                ...widget.config,
                active: true,
              },
            };
          }),
        };
      },
    }),
  );

  return store;
};

export default store;
