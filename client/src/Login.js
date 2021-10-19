import React, { useState, useEffect, useRef } from 'react';
import gun from 'gun/gun';

export default function Login() {
  const gunRef = useRef();
  const [username, setUsername] = useState('');
  const [passphrase, setPassphrase] = useState('');

  useEffect(() => {
    const gun = Gun([
      'http://localhost:8765/gun',
      'https://gun-manhattan.herokuapp.com/gun',
    ]);

    // only initialize once when component is mounted
    gunRef.current = gun;
  }, []);

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
