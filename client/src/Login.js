import React, { useState } from 'react';

import useGunContext from './useGunContext';

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

export default function Login() {
  const { getGun, getUser, setCertificate } = useGunContext();
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

  const onCreateSuccess = ({ pub }) => {
    // get certificate and store in app memory
    fetch('http://localhost:8765/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        pub,
      }),
    })
      .then((resp) => resp.json())
      .then(({ certificate }) => {
        setCertificate(certificate);

        // add user to user/profile list
        getGun()
          .get(`~${APP_PUBLIC_KEY}`)
          .get('profiles')
          .get(pub)
          .put({ username }, null, {
            opt: { cert: certificate },
          });

        // log in
        logIn();
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
          getUser().create(username, password, ({ err, pub }) => {
            if (err) {
              setAuthError(err);
            } else {
              onCreateSuccess({ pub });
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
