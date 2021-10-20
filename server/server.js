const express = require('express');
const Gun = require('gun');
const SEA = require('gun/sea');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8765;
const APP_KEY_PAIR = JSON.parse(process.env.APP_KEY_PAIR);

app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Pass the validation function as isValid
const gun = Gun({
  web: server,
  // isValid: hasValidToken,
});

// Sync everything
gun.on('out', { get: { '#': { '*': '' } } });

// Authorize this app as a user
gun.user().auth(APP_KEY_PAIR, ({ err }) => {
  // TODO handle app auth error
  if (err) {
    console.error(err);
  }
});

// parse application/json
app.use(express.json());

// TODO CORS
app.post('/api/certificates', async (req, res) => {
  const { username, pub: userPubKey } = req.body;

  // See https://gun.eco/docs/SEA.certify for policies
  const policy = [
    // allow users to add and edit their profiles with:
    //   gun
    //     .get('~'+app.pub)
    //     .get('profiles')
    //     .get(user.pub)
    //     .put({ name: 'alice' }, null, {opt: { cert: certificate }} )
    { '*': 'profiles', '+': '*' },
  ];

  // expire in 2 hours
  const expiresAt = Date.now() + 60 * 60 * 1000 * 2;

  const certificate = await SEA.certify(
    [userPubKey],
    policy,
    APP_KEY_PAIR,
    null,
    ({ err }) => {
      if (err) {
        console.log(`Error creating certificate for ${username}:`, err);
      } else {
        console.log(`Successfully created certificate for ${username}`);
      }
    }
    // FIXME neither expiry or block seem to be working?
    // https://github.com/amark/gun/issues/1143
    // {
    //   expiry: expiresAt,
    //   // name of path to blocked/banned users
    //   block: 'blocked',
    // }
  );

  res.status(201).send({
    certificate,
    expires_at: expiresAt,
  });
});
