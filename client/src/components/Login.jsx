import React from 'react';
import { signInWithGoogle, signInAsGuest, createUser, signInUser, logOut, auth } from '../firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

const Login = ({ setUser }) => {

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, uid, isAnonymous } = user;
        setUser({
          name: displayName || 'Guest',
          email: email || 'guest@toro.com',
          uid,
          isAnonymous
        });
      } else {
        setUser(null);
      }
    });
  }, [setUser]);


  return (
    <div className="login">
      <h1>Welcome to Toro MVP</h1>
      <button
        className="google-login"
        onClick={signInWithGoogle}>
          Sign in with Google</button>
      <button
        className="guest-login"
        onClick={signInAsGuest}>
          Continue as Guest</button>
      <button
      className="logout-button"
      onClick={logOut}>
        Logout</button>
    </div>
  );
};

export default Login;



