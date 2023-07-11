"use strict";
// const { initializeApp } = require('firebase/app');
// const { getFirestore } = require('firebase/firestore');
// const { getAuth } = require('firebase/auth');
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = exports.Timestamp = exports.db = void 0;
// const firebaseConfig = {
//     apiKey: 'AIzaSyDcuDIddVQKAQoj0yMLrWsDTQDDAaAFY00',
//     authDomain: 'fir-44abd.firebaseapp.com',
//     databaseURL: 'https://fir-44abd-default-rtdb.firebaseio.com',
//     projectId: 'fir-44abd',
//     storageBucket: 'fir-44abd.appspot.com',
//     messagingSenderId: '513391440326',
//     appId: '1:513391440326:web:1c076486af50e8572742c7',
// };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// module.exports = { db, auth, app };          browser
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
exports.Timestamp = Timestamp;
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fir-44abd-default-rtdb.firebaseio.com',
});
const db = getFirestore();
exports.db = db;
const messaging = admin.messaging();
exports.messaging = messaging;
