import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz4IwYBZcZYAnk5_zCyTvNBs5aFm1k0Gg",
  authDomain: "timfix-204a8.firebaseapp.com",
  projectId: "timfix-204a8",
  storageBucket: "timfix-204a8.appspot.com",
  messagingSenderId: "587346980012",
  appId: "1:587346980012:web:86b5eeb06dd1e0af02c309"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };


