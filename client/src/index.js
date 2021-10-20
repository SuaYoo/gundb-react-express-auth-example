import React from 'react';
import ReactDOM from 'react-dom';
import 'broadcastchannel-polyfill';

import App from './App';

ReactDOM.render(React.createElement(App), document.getElementById('root'));

module.hot.accept();
