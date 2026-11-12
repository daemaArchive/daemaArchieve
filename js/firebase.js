import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC5Uuz-v8JjTJGOoNkn10VZkspt-xWkA-g',
  authDomain: 'daema-archive-dsm26.firebaseapp.com',
  projectId: 'daema-archive-dsm26',
  storageBucket: 'daema-archive-dsm26.firebasestorage.app',
  messagingSenderId: '966802428387',
  appId: '1:966802428387:web:3dc29b9b883609ded910d6'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
