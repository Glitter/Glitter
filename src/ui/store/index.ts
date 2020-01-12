/* eslint-disable no-param-reassign */
import { types, flow, cast } from 'mobx-state-tree';
import catchify from 'catchify';
import { listDevelopmentWidgets as apiListDevelopmentWidgets } from '@ui/api/widgetLoader';
import { listDevelopmentWidgetsInstances as apiListDevelopmentWidgetsInstances } from '@ui/api/widgetInstantiator';

const CurrentView = types.model({
  name: types.string,
  title: types.optional(types.string, ''),
});

const DevelopmentWidgetConfig = types.model({
  title: types.string,
  subtitle: types.optional(types.string, ''),
  type: types.union(types.literal('vue'), types.literal('react')),
  version: types.string,
  description: types.optional(types.string, ''),
  active: types.boolean,
  width: types.number,
  height: types.number,
});

const DevelopmentWidget = types.model({
  path: types.string,
  config: DevelopmentWidgetConfig,
  id: types.identifier,
});

export const DevelopmentWidgetsValue = types.array(DevelopmentWidget);

const DevelopmentWidgets = types.model({
  value: DevelopmentWidgetsValue,
  state: types.union(
    types.literal('pending'),
    types.literal('fulfilled'),
    types.literal('rejected'),
  ),
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

export const DevelopmentWidgetsInstancesValue = types.array(
  DevelopmentWidgetInstance,
);

const DevelopmentWidgetsInstances = types.model({
  value: DevelopmentWidgetsInstancesValue,
  state: types.union(
    types.literal('pending'),
    types.literal('fulfilled'),
    types.literal('rejected'),
  ),
});

export const Store = types
  .model('Store', {
    currentView: CurrentView,
    developmentWidgets: DevelopmentWidgets,
    developmentWidgetsLogs: types.map(types.array(types.string)),
    developmentWidgetsInstances: DevelopmentWidgetsInstances,
  })
  .views(self => ({
    get availableWidgets(): typeof DevelopmentWidgetsValue.Type {
      return self.developmentWidgets.value;
    },
    screenDevelopmentWidgetInstances(
      displayId?: number,
    ): typeof DevelopmentWidgetInstance.Type[] {
      if (displayId === undefined) {
        return [];
      }

      return self.developmentWidgetsInstances.value.filter(
        widgetInstance => widgetInstance.displayId === displayId,
      );
    },
  }))
  .actions(self => {
    // Development
    const listDevelopmentWidgets = flow(function* listDevelopmentWidgets({
      silent = false,
    }: { silent?: boolean } = {}) {
      if (silent === false) {
        self.developmentWidgets.value = cast([]);
        self.developmentWidgets.state = 'pending';
      }

      const [developmentWidgetsError, developmentWidgets]: [
        Error,
        typeof DevelopmentWidgetsValue.Type,
      ] = yield catchify(apiListDevelopmentWidgets());

      if (developmentWidgetsError) {
        self.developmentWidgets.state = 'rejected';
        return;
      }

      self.developmentWidgets.value = developmentWidgets;
      self.developmentWidgets.state = 'fulfilled';
    });
    const addWidgetLog = ({ id, text }: { id: string; text: string }): void => {
      self.developmentWidgetsLogs.set(id, [
        ...(self.developmentWidgetsLogs.get(id) || []),
        text,
      ]);
    };

    // Widget instances
    const listDevelopmentWidgetsInstances = flow(
      function* listDevelopmentWidgetsInstances({
        silent = false,
      }: { silent?: boolean } = {}) {
        if (silent === false) {
          self.developmentWidgetsInstances.value = cast([]);
          self.developmentWidgetsInstances.state = 'pending';
        }

        const [developmentWidgetsInstancesError, developmentWidgetsInstances]: [
          Error,
          typeof DevelopmentWidgetsInstancesValue.Type,
        ] = yield catchify(apiListDevelopmentWidgetsInstances());

        if (developmentWidgetsInstancesError) {
          self.developmentWidgetsInstances.state = 'rejected';
          return;
        }

        self.developmentWidgetsInstances.value = developmentWidgetsInstances;
        self.developmentWidgetsInstances.state = 'fulfilled';
      },
    );

    // Views
    const setCurrentView = (view: typeof CurrentView.Type): void => {
      self.currentView = view;
    };
    const showHome = (): void => {
      self.currentView = {
        name: 'home',
        title: 'Dashboard',
      };

      listDevelopmentWidgets({ silent: true });
      listDevelopmentWidgetsInstances({ silent: true });
    };
    const showWidgets = (): void => {
      self.currentView = {
        name: 'widgets',
        title: 'Widgets',
      };
      listDevelopmentWidgets({ silent: true });
      listDevelopmentWidgetsInstances({ silent: true });
    };
    const showDevelopers = (): void => {
      self.currentView = {
        name: 'developers',
        title: 'For developers',
      };
      listDevelopmentWidgets({ silent: true });
    };

    return {
      setCurrentView,
      showHome,
      showWidgets,
      showDevelopers,
      listDevelopmentWidgets,
      addWidgetLog,
      listDevelopmentWidgetsInstances,
    };
  });

const store = Store.create({
  currentView: {
    name: 'home',
    title: 'Dashboard',
  },
  developmentWidgets: {
    value: [],
    state: 'pending',
  },
  developmentWidgetsLogs: {},
  developmentWidgetsInstances: {
    value: [],
    state: 'pending',
  },
});

store.showHome();

export default store;
