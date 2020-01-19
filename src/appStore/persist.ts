import fs from 'fs-extra';
import path from 'path';
import electron from 'electron';
import { onSnapshot, applySnapshot, IStateTreeNode } from 'mobx-state-tree';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StrToAnyMap = { [key: string]: any };

interface OptionsInterface {
  name: string;
  store: IStateTreeNode;
}

const persist = ({ name, store }: OptionsInterface): Promise<void> => {
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

    applySnapshot(store, snapshot);
  });
};

export default persist;
