import React from 'react';
import ReactDOM from 'react-dom';
import 'broadcastchannel-polyfill';

import { GunContextProvider } from './useGunContext';
import App from './App';

ReactDOM.render(
  <GunContextProvider>
    <App />
  </GunContextProvider>,
  document.getElementById('root')
);

module.hot.accept();
