import { useEffect, useRef } from 'react';

import useGunContext from './useGunContext';

// sync session across tabs using a broadcast channel
export default function useSessionChannel() {
  const { getUser } = useGunContext();
  const channelRef = useRef();

  useEffect(() => {
    const channel = new BroadcastChannel('session_channel');

    // let other tabs know we're here, in case one is logged in
    channel.postMessage({
      eventName: 'I_NEED_CREDS',
    });

    // check if other tabs are logged in
    channel.onmessage = (e) => {
      if (e.isTrusted) {
        const { eventName, value } = e.data;

        if (eventName === 'I_NEED_CREDS') {
          // send to tab
          channel.postMessage({
            eventName: 'I_HAVE_CREDS',
            value: window.sessionStorage.getItem('pair'),
          });
        }

        if (eventName === 'I_HAVE_CREDS') {
          const storedPair = window.sessionStorage.getItem('pair');

          if (value && !storedPair) {
            getUser().auth(JSON.parse(value));
          }
        }
      }
    };

    channelRef.current = channel;

    return () => {
      channel.close();
    };
  }, [getUser]);

  return {
    onMessage: (cb) => {
      const onmessage = channelRef.current.onmessage;

      channelRef.current.onmessage = (e) => {
        onmessage(e);
        cb(e);
      };
    },
    postMessage: (msg) => channelRef.current.postMessage(msg),
  };
}
