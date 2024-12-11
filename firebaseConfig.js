import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-Hai1RBAPxwxzu7xfmtueSTNm4oobY8o",
    authDomain: "calendarapp-cd5e7.firebaseapp.com",
    databaseURL: "https://calendarapp-cd5e7-default-rtdb.firebaseio.com",
    projectId: "calendarapp-cd5e7",
    storageBucket: "calendarapp-cd5e7.appspot.com",
    messagingSenderId: "67863798518",
    appId: "1:67863798518:web:998f5250a6d94d740942d7",
    measurementId: "G-LNLHDGKBXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;