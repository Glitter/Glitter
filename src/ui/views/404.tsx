import React from 'react';
import { observer } from 'mobx-react-lite';
import { Store } from '@ui/store';

interface IProps {
  store: typeof Store.Type;
}

const NotFound: React.FC<IProps> = observer(() => {
  return (
    <div>
      <br />
      Whoops, how did you get here?
    </div>
  );
});

export default NotFound;
