# gunDB + React + Express users demo app

Example with:

- [x] sign up
- [x] sign in
- [x] change password
- [x] update user profile
- [x] multi-tab session syncing
- [x] access control--only allow logged in users to update areas
- [ ] user list

no-style styled. it's ugly but it "works"

## Running the app

### express server setup

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

### react client setup

save env variable to .env file:

```bash
$ cd client
$ cp .env.example .env
# add just the public key from your server env here
```

start the client app:

```bash
$ yarn
$ yarn start
```

open http://localhost:8081 and try it out. updating any of the files in client/src will hot reload the page.

### Stuff I learned

- Webpack doesn't love the gun package. Add `noParse: /(\/gun|gun\/sea)\.js$/` to webpack.config.js to suppress warnings
- gun only supports `sessionStorage`, which means users need to log in to each tab/window they open. I'm using `BroadcastChannel` to get around this

### Open questions

~~What's the best way of keeping a list of users in the db? gun superuser?~~

Create server app as super user and having it give out certificates to end users seems to be working, although certificates won't expire and block lists don't work as of `v^0.2020.1235`.
