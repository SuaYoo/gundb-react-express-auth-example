/*
 * Provide one instance of gun to your entire app.
 * NOTE Using this component blocks render until gun is ready
 *
 * Usage examples:
 * // index.js
 *   import { GunContextProvider } from './useGunContext'
 *   // ...
 *   <GunContextProvider>
 *     <App />
 *   </GunContextProvider>
 *
 * // App.js
 *   import useGunContext from './useGunContext'
 *   // ...
 *   const { getGun, getUser } = useGunContext()
 *
 *   getGun().get('ours').put('this')
 *   getUser().get('mine').put('that')
 */
import React, { createContext, useContext, useRef, useEffect } from 'react';
import Gun from 'gun/gun';
import 'gun/sea';

const GunContext = createContext({
  getGun: () => {},
  getUser: () => {},
  getCertificate: () => {},
  setCertificate: () => {},
  onAuth: () => () => {},
});

export const GunContextProvider = ({ children }) => {
  const gunRef = useRef();
  const userRef = useRef();
  const certificateRef = useRef();
  const accessTokenRef = useRef();
  const onAuthCbRef = useRef();

  useEffect(() => {
    Gun.on('opt', (ctx) => {
      if (ctx.once) return;

      ctx.on('out', function (msg) {
        const to = this.to;
        // Adds headers for put
        msg.headers = {
          accessToken: accessTokenRef.current,
        };
        to.next(msg); // pass to next middleware

        if (msg.err === 'Invalid access token') {
          // not implemented: handle invalid access token
          // you might want to do a silent refresh, or
          // redirect the user to a log in page
        }
      });
    });

    const gun = Gun(['http://localhost:8765/gun']);

    // create user
    const user = gun
      .user()
      // save user creds in session storage
      // this appears to be the only type of storage supported.
      // use broadcast channels to sync between tabs
      .recall({ sessionStorage: true });

    gun.on('auth', (...args) => {
      if (!accessTokenRef.current) {
        // get new token
        user.get('alias').once((username) => {
          fetch('http://localhost:8765/api/tokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ accessToken }) => {
              // store token in app memory
              accessTokenRef.current = accessToken;
            });
        });
      }

      if (!certificateRef.current) {
        // get new certificate
        user.get('alias').once((username) => {
          fetch('http://localhost:8765/api/certificates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ certificate }) => {
              // store certificate in app memory
              // TODO check if expiry isn't working or misconfigured
              // TODO handle expired certificates
              certificateRef.current = certificate;
            });
        });
      }

      if (onAuthCbRef.current) {
        onAuthCbRef.current(...args);
      }
    });

    gunRef.current = gun;
    userRef.current = user;
  }, []);

  return (
    <GunContext.Provider
      value={{
        getGun: () => gunRef.current,
        getUser: () => userRef.current,
        getCertificate: () => certificateRef.current,
        setCertificate: (v) => {
          certificateRef.current = v;
        },
        onAuth: (cb) => {
          onAuthCbRef.current = cb;
        },
      }}
    >
      {children}
    </GunContext.Provider>
  );
};

export default function useGunContext() {
  return useContext(GunContext);
}
