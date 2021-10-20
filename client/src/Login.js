import Gun from 'gun/gun';
import React, { useState } from 'react';

export default function Login({ gunRef, userRef }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState();

  const logIn = () => {
    userRef.current.auth(username, password, ({ err }) => {
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
    gunRef.current.get(`~@${username}`).once((user) => {
      if (user) {
        setAuthError('Username already taken');
      } else {
        userRef.current.create(username, password, ({ err }) => {
          if (err) {
            setAuthError(err);
          } else {
            // add user to db
            const newUser = gunRef.current
              .get(username)
              .put({ displayName: null });

            gunRef.current.get('users').set(newUser);

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
