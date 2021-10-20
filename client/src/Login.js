import React, { useState } from 'react';

export default function Login({ userRef }) {
  const [username, setUsername] = useState('juic8y-test');
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

    userRef.current.create(username, passphrase, ({ err }) => {
      if (err) {
        setAuthError(err);
      }
    });
  };

  return (
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
        <button onClick={handleSignUp}>sign up</button>
      </div>
    </form>
  );
}
