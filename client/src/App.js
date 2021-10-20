import React, { useState, useEffect, useRef } from 'react';
import Gun from 'gun/gun';
import 'gun/sea';

import Login from './Login';

const App = () => {
  const gunRef = useRef();
  const userRef = useRef();
  const channelRef = useRef();
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

    const channel = new BroadcastChannel('test_channel');

    // let other tabs know we're here, in case one is logged in
    channel.postMessage({
      eventName: 'I_NEED_CREDS',
    });

    // check if other tabs are logged in
    channel.onmessage = (e) => {
      if (e.isTrusted) {
        const { eventName, value } = e.data;

        if (eventName === 'I_NEED_CREDS') {
          // send to tab
          channel.postMessage({
            eventName: 'I_HAVE_CREDS',
            value: window.sessionStorage.getItem('pair'),
          });
        }

        if (eventName === 'I_HAVE_CREDS') {
          const storedPair = window.sessionStorage.getItem('pair');

          if (value && !storedPair) {
            user.auth(JSON.parse(value));
          }
        }

        if (eventName === 'REMOVE_YOUR_CREDS') {
          logOut();
        }
      }
    };

    gun.on('auth', () => {
      // notify other tabs
      channel.postMessage({
        eventName: 'I_HAVE_CREDS',
        value: window.sessionStorage.getItem('pair'),
      });

      setIsLoggedIn(true);
    });

    gunRef.current = gun;
    userRef.current = user;
    channelRef.current = channel;

    return () => {
      channel.close();
    };
  }, []);

  const logOut = (e) => {
    userRef.current.leave();

    if (e) {
      // logged out from click, notify other tabs
      channelRef.current.postMessage({
        eventName: 'REMOVE_YOUR_CREDS',
      });
    }

    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn && <Login userRef={userRef} />}
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
