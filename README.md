# gunDB + React + Express users demo app

Example with:

- sign up
- sign in
- change password
- update user profile
- users' online/offline status
- multi-tab session syncing

no-style styled. it's ugly but it "works"

## Running the app

start the server:

```bash
$ cd server
$ yarn
$ yarn start
```

the server runs on port 8765.

start the client app:

```bash
$ cd client
$ yarn
$ yarn start
```

open http://localhost:8081 and try it out.

### Stuff I learned

- Webpack doesn't love the gun package. Add `noParse: /(\/gun|gun\/sea)\.js$/` to webpack.config.js to suppress warnings
- gun only supports sessionStorage, which means users need to log in to each tab/window they open. I'm using BroadcastChannel (with a polyfill) to get around this
