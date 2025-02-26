import React from 'react';
import { signInWithGoogle, signInAsGuest } from '../firebaseConfig.js';

const Login = () => {

  return (
    <div className="login-page">
      <div className="login">
        <h1>Welcome to Toro MVP</h1>
        <div className="login-buttons">
          <button
            className="google-login"
            onClick={signInWithGoogle}>
              Sign in with Google</button>
          <button
            className="guest-login"
            onClick={signInAsGuest}>
              Continue as Guest</button>
        </div>
      </div>
    </div>
  );
};

export default Login;



