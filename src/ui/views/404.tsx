import React from 'react';
import { observer } from 'mobx-react-lite';

const NotFound: React.FC = observer(() => {
  return (
    <div>
      <br />
      Whoops, how did you get here?
    </div>
  );
});

export default NotFound;
