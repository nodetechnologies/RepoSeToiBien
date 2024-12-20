import React from 'react';
import LogRocket from 'logrocket';

const PublicLayout = ({ children }) => {
  if (
    window.location.hostname !== 'localhost' &&
    window.location.port !== '3000' &&
    window.location.hostname !== 'usenode' &&
    window.location.hostname !== 'usenode.com' &&
    window.location.hostname !== 'usenode.ca'
  ) {
    LogRocket.init('hpp7xp/node');
    LogRocket.identify('Guest', {});
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        alignContent: 'center',
        textAlign: 'center',
        padding: '0',
        backgroundColor: '#fff',
      }}
    >
      <div>{children}</div>
    </div>
  );
};
export default PublicLayout;
