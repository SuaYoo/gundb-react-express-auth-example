# gunDB + React + Express users demo app

Example with:

- [x] sign up
- [x] sign in
- [x] change password
- [x] update user profile
- [x] multi-tab session syncing
- [ ] user list
- [ ] users' online/offline status

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

### Open questions

What's the best way of keeping a list of users in the db? gun superuser?
