import React, { useState, useEffect } from 'react';

import useGunContext from './useGunContext';

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const UserList = () => {
  const { getGun } = useGunContext();
  const [users, setUsers] = useState({});

  useEffect(() => {
    getGun()
      .get(`~${APP_PUBLIC_KEY}`)
      .get('profiles')
      .map()
      .on((profile, pub) => {
        setUsers((users) => ({
          ...users,
          [pub]: profile,
        }));
      });
  }, []);

  return (
    <div>
      <ul>
        {Object.entries(users).map(([pub, user]) => (
          <li key={pub}>
            {user.displayName} ({user.username})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
