import fs from 'fs-extra';
import path from 'path';
import electron from 'electron';
import { onSnapshot, applySnapshot, IStateTreeNode } from 'mobx-state-tree';

type StrToAnyMap = { [key: string]: any };

interface IOptions {
  name: string;
  store: IStateTreeNode;
}

const persist = ({ name, store }: IOptions): Promise<void> => {
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
