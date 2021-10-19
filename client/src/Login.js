import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [passphrase, setPassphrase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <button type="submit">sign in</button>
    </form>
  );
}
