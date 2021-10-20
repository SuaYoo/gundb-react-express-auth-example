import React, { useState } from 'react';

import useGunContext from './useGunContext';

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

export default function UserInfo() {
  const { getGun, getUser, getCertificate } = useGunContext();
  const [displayName, setDisplayName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authError, setAuthError] = useState();
  const [authSuccess, setAuthSuccess] = useState();
  const [profileEditError, setProfileEditError] = useState();
  const [profileEditSuccess, setProfileEditSuccess] = useState();

  const handleSubmitProfile = (e) => {
    e.preventDefault();

    setProfileEditError();
    setProfileEditSuccess();

    getGun()
      .get(`~${APP_PUBLIC_KEY}`)
      .get('profiles')
      .get(getUser().is.pub)
      .put(
        { displayName: displayName },
        ({ err }) => {
          if (err) {
            setProfileEditError(err);
          } else {
            setProfileEditSuccess(
              `Successfully changed display name to ${displayName}`
            );
          }
        },
        {
          opt: { cert: getCertificate() },
        }
      );
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    setAuthError();
    setAuthSuccess();

    const user = getUser();

    // re-auth user
    user.get('alias').then((username) => {
      user.auth(username, oldPassword, ({ err, sea }) => {
        if (err) {
          setAuthError('Wrong password');
        } else {
          user.auth(
            sea,
            ({ err }) => {
              if (err) {
                setAuthError(err);
              } else {
                setAuthSuccess('Password successfully changed');
              }
            },
            {
              change: newPassword,
            }
          );
        }
      });
    });
  };

  return (
    <div>
      <h3>edit profile</h3>
      <form onSubmit={handleSubmitProfile}>
        <div>
          <label>
            display name
            <input
              name="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        </div>

        {profileEditError && (
          <div style={{ color: 'red' }}>{profileEditError}</div>
        )}
        {profileEditSuccess && (
          <div style={{ color: 'green' }}>{profileEditSuccess}</div>
        )}

        <div>
          <button type="submit">save changes</button>
        </div>
      </form>

      <h3>change password</h3>
      <form onSubmit={handleSubmitPassword}>
        <div>
          <label>
            old password
            <input
              name="password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            new password
            <input
              name="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
        </div>

        {authError && <div style={{ color: 'red' }}>{authError}</div>}
        {authSuccess && <div style={{ color: 'green' }}>{authSuccess}</div>}

        <div>
          <button type="submit">save changes</button>
        </div>
      </form>
    </div>
  );
}
