import React, { useState } from 'react';

import useGunContext from './useGunContext';

export default function Login() {
  const { getGun, getUser } = useGunContext();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password');
  const [authError, setAuthError] = useState();

  const logIn = () => {
    getUser().auth(username, password, ({ err }) => {
      if (err) {
        setAuthError(err);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAuthError();
    logIn();
  };

  const handleSignUp = () => {
    setAuthError();

    // check if user with username already exists
    getGun()
      .get(`~@${username}`)
      .once((user) => {
        if (user) {
          setAuthError('Username already taken');
        } else {
          getUser().create(username, password, ({ err }) => {
            if (err) {
              setAuthError(err);
            } else {
              // TODO add user to db so we can build user list
              // NOTE gundb is probably not the best place to store this
              // list since anyone can edit it?

              // log in
              logIn();
            }
          });
        }
      });
  };

  return (
    <div>
      <h1>log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {authError && <div style={{ color: 'red' }}>{authError}</div>}

        <div>
          <button type="submit">sign in</button>
        </div>
      </form>
      <div>or</div>
      <button type="button" onClick={handleSignUp}>
        sign up
      </button>
    </div>
  );
}
