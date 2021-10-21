# gunDB + Express users demo app

This demo app works through the concept of an "app" user type. The server is just another `user` in the gun sense, with a private space that logged in end users can edit.

For example, when a user makes a POST request to `/api/certificates` with their public key, the server issues the user a certificate with a policy that allows them to update a `'profiles'` space indexed with their public key. With this certificate, the client user can do this:

```js
gun
  .get(`~${APP_PUBLIC_KEY}`)
  .get('profiles')
  .get(user.pub)
  .put({ name: 'alice' }, null, { opt: { cert: certificate } });
// successfully updated own profile in app space!
```

Unauthenticated users and users who are not alice would be able to read but not update this profile. Try it out in the client code:

```js
gun
  .get(`~${APP_PUBLIC_KEY}`)
  .get('profiles')
  .get('anon')
  .put({ name: 'alice' });
// you should see `Signature did not match.` in the console log

gun
  .get(`~${APP_PUBLIC_KEY}`)
  .get('profiles')
  .get(alicePublicKey)
  .put({ name: 'alice' }, null, { opt: { cert: 'bad cert' } });
// you should see `Signature did not match.` in the console log.
//
// note, if you try to use an invalid cert with your current user
// it might just fail silently :)
```

As it stands, this isn't much different in terms of functionality from defining a profile as `gun.user().put({ name: 'alice' })`, storing all public keys somewhere and getting public data from each user, but the policy can be extended to other private app spaces (like a user-edited message board.)

JSON web tokens can be used to prevent just _anyone_ from modifying public data. JWTs are implemented as access tokens in this example, before heading to production you'll want to configure a couple things:

- CORS, if you want to restrict API routes to generate tokens & certificates to specific origins (gundb allows all origins by default, since CORS is not enforced with websockets.)
- Handle invalid tokens, e.g. when they expire--you can do this server side or client side.

## Dev

generate an app key pair:

```bash
$ cd server
$ yarn generate-app-key
# output should be kept secret
```

save env variable to .env file:

```bash
$ cp .env.example .env
# save the output from last step in your new file
```

start the server:

```bash
$ yarn
$ yarn start
```

the server runs on port 8765. to start with file watching and server reload enabled:

```bash
$ yarn watch
# instead of yarn start
```
