import React from 'react';
import { signInWithGoogle, signInAsGuest, createUser, signInUser, logOut, auth } from '../firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

const Login = ({ setUser }) => {

  React.useEffect(() => {
    console.log('Login component mounted');
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User state changed:', user);
        const { displayName, email, uid, isAnonymous } = user;
        setUser({
          name: displayName || 'Guest',
          email: email || 'guest@toro.com',
          uid,
          isAnonymous
        });
      } else {
        console.log('No user detected');
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



