import fs from 'fs-extra';
import path from 'path';
import electron from 'electron';
import { onSnapshot, applySnapshot, IStateTreeNode } from 'mobx-state-tree';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StrToAnyMap = { [key: string]: any };

interface OptionsInterface {
  name: string;
  store: IStateTreeNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modifySnapshot?: (snapshot: any) => any;
}

const persist = ({
  name,
  store,
  modifySnapshot = x => x,
}: OptionsInterface): Promise<void> => {
  const storagePath = path.join(
    electron.app.getPath('userData'),
    `settings/${name}.json`,
  );

  onSnapshot(store, (_snapshot: StrToAnyMap) => {
    const snapshot = { ..._snapshot };

    fs.outputJsonSync(storagePath, snapshot);
  });

  return fs.readJson(storagePath).then(snapshot => {
    if (!snapshot) {
      return;
    }

    try {
      applySnapshot(store, modifySnapshot(snapshot));
    } catch (e) {
      console.error(e);
    }
  });
};

export default persist;
