import React, { useState, useEffect, useRef } from 'react';
import Gun from 'gun/gun';
import 'gun/sea';

export default function Login() {
  const gunRef = useRef();
  const userRef = useRef();
  const [username, setUsername] = useState('');
  const [passphrase, setPassphrase] = useState('');

  useEffect(() => {
    const gun = Gun([
      'http://localhost:8765/gun',
      'https://gun-manhattan.herokuapp.com/gun',
    ]);

    const user = gun.user();

    // only initialize once when component is mounted
    gunRef.current = gun;
    userRef.current = user;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    userRef.current.auth(username, password);
  };

  const handleSignUp = () => {
    userRef.current.create(username, password);
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
      <button onClick={handleSignUp}>sign up</button>
    </form>
  );
}
