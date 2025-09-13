// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2014622910-298ff",
  "appId": "1:313784984521:web:a76f05405604652e9d7e18",
  "storageBucket": "studio-2014622910-298ff.firebasestorage.app",
  "apiKey": "AIzaSyD0kJHKyQgk5qWq70nKcn8lqWZVMRXLLrs",
  "authDomain": "studio-2014622910-298ff.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "313784984521"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
