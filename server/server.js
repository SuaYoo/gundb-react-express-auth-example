const express = require('express');
const Gun = require('gun');

const app = express();
const port = process.env.PORT || 8765;

app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

Gun({ web: server });
