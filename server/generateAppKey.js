const SEA = require('gun/sea');

SEA.pair().then((pair) => {
  console.log(
    'This is your secret app key pair.\nAdd this to your .dotenv file:'
  );
  console.log(`APP_KEY_PAIR='${JSON.stringify(pair)}'`);
});
