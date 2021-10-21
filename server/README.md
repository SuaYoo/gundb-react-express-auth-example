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

Unauthenticated users and users who are not alice would be able to read but not update this profile.

As it stands, this isn't much different in terms of functionality from defining a profile as `gun.user().put({ name: 'alice' })`, but the policy can be extended to other private app spaces (like a user-edited message board.)

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
