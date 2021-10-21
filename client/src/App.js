import React, { useState, useEffect } from 'react';

import Login from './Login';
import UserInfo from './UserInfo';
import UserList from './UserList';
import useSessionChannel from './useSessionChannel';
import useGunContext from './useGunContext';

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const App = () => {
  const { getGun, getUser, setCertificate, onAuth } = useGunContext();
  const sessionChannel = useSessionChannel();
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    onAuth(() => {
      // notify other tabs
      sessionChannel.postMessage({
        eventName: 'I_HAVE_CREDS',
        value: window.sessionStorage.getItem('pair'),
      });

      getGun()
        .get(`~${APP_PUBLIC_KEY}`)
        .get('profiles')
        .get(getUser().is.pub)
        .on((profile) => {
          setUserProfile(profile);
        });
    });

    sessionChannel.onMessage((e) => {
      const { eventName } = e.data;

      console.log(eventName);

      if (eventName === 'REMOVE_YOUR_CREDS') {
        logOut();
      }
    });
  }, []);

  const logOut = (evt) => {
    setCertificate(null);

    const user = getUser();

    user.leave();

    // check if logout failed, if so manually remove
    // user from session storage
    // see https://gun.eco/docs/User#user-leave
    if (user._.sea) {
      window.sessionStorage.removeItem('pair');
    }

    // logged out from click, notify other tabs
    if (evt) {
      sessionChannel.postMessage({
        eventName: 'REMOVE_YOUR_CREDS',
      });
    }

    setUserProfile();
  };

  return (
    <div>
      {!userProfile && (
        <div>
          <Login />
        </div>
      )}
      {userProfile && (
        <div>
          <h1>community</h1>
          <div>
            logged in as {userProfile.displayName} ({userProfile.username}).{' '}
            <button onClick={logOut}>Log out</button>
          </div>
          <h2>user profiles</h2>
          <div>
            <UserList />
          </div>
          <h2>your info</h2>
          <div>
            <UserInfo />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
