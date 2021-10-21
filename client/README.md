# gunDB + React users demo app

## Dev

save env variable to .env file:

```bash
$ cp .env.example .env
# add just the public key from your server env here
```

start the client app:

```bash
$ yarn
$ yarn start
```

your default browser should open http://localhost:8081 in a new tab. updating any of the files in client/src will hot reload the page.

## Points of interest

### `useGunContext`

The `gun` context is provided to the entire app through the `useGunContext` hook. Example usage:

```js
// index.js
import { GunContextProvider } from './useGunContext';
import App from './App';

// use the provider somewhere high up
ReactDOM.render(
  <GunContextProvider>
    <App />
  </GunContextProvider>,
  document.getElementById('root')
);
```

```js
// App.js
import useGunContext from './useGunContext';

const App = () => {
  const { getGun, getUser, onAuth } = useGunContext();

  onAuth(() => {
    console.log('authenticated!');
  });

  const handleClick = () => {
    getGun().get('ours').put('this');
    getUser().get('mine').put('that');
  };

  return <button onClick={handleClick}>do something</button>;
};
```

`useGunContext()` gives you:

```js
{
  getGun: Function, // returns `gun` instance
  getUser: Function, // returns `gun.user()`
  getCertificate: Function, // returns current user's certificate
  setCertificate: Function, // sets current user's certificate
  onAuth: Function, // pass callback to fire on `gun.user().auth()`
}
```

### `useSessionChannel`

Syncs session across tabs using the [`Broadcast API`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) (polyfilled)
