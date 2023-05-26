import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: 'AIzaSyDcuDIddVQKAQoj0yMLrWsDTQDDAaAFY00',
    authDomain: 'fir-44abd.firebaseapp.com',
    databaseURL: 'https://fir-44abd-default-rtdb.firebaseio.com',
    projectId: 'fir-44abd',
    storageBucket: 'fir-44abd.appspot.com',
    messagingSenderId: '513391440326',
    appId: '1:513391440326:web:1c076486af50e8572742c7',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
