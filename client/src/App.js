import React, { useState, useEffect, useRef } from 'react';
import Gun from 'gun/gun';
import 'gun/sea';

import Login from './Login';
import useSessionChannel from './useSessionChannel';

const App = () => {
  const gunRef = useRef();
  const userRef = useRef();
  const sessionChannel = useSessionChannel({ userRef });
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const gun = Gun(['http://localhost:8765/gun']);

    // create user
    const user = gun
      .user()
      // save user creds in session storage
      // this appears to be the only type of storage supported.
      // use broadcast channels to sync between tabs
      .recall({ sessionStorage: true });

    gun.on('auth', () => {
      // notify other tabs
      sessionChannel.postMessage({
        eventName: 'I_HAVE_CREDS',
        value: window.sessionStorage.getItem('pair'),
      });

      setIsLoggedIn(true);
    });

    sessionChannel.onMessage((e) => {
      const { eventName } = e.data;

      if (eventName === 'REMOVE_YOUR_CREDS') {
        logOut();
      }
    });

    gunRef.current = gun;
    userRef.current = user;
  }, []);

  const logOut = (evt) => {
    userRef.current.leave();

    // check if logout failed, if so manually remove
    // user from session storage
    // see https://gun.eco/docs/User#user-leave
    if (userRef.current._.sea) {
      window.sessionStorage.removeItem('pair');
    }

    // logged out from click, notify other tabs
    if (evt) {
      sessionChannel.postMessage({
        eventName: 'REMOVE_YOUR_CREDS',
      });
    }

    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn && <Login gunRef={gunRef} userRef={userRef} />}
      {isLoggedIn && (
        <div>
          <div>logged in</div>
          <button onClick={logOut}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default App;
