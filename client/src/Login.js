import Gun from 'gun/gun';
import React, { useState } from 'react';

export default function Login({ gunRef, userRef }) {
  const [username, setUsername] = useState('a');
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    setAuthError();

    userRef.current.auth(username, passphrase, ({ err }) => {
      if (err) {
        setAuthError(err);
      }
    });
  };

  const handleSignUp = () => {
    setAuthError();

    // check if user with username already exists
    gunRef.current.get(`~@${username}`).once((user) => {
      if (user) {
        setAuthError('Username already taken');
      } else {
        userRef.current.create(username, passphrase, ({ err }) => {
          if (err) {
            setAuthError(err);
          }
        });
      }
    });
  };

  return (
    <div>
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
            passphrase
            <input
              name="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
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
