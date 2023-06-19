// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: 'AIzaSyDcuDIddVQKAQoj0yMLrWsDTQDDAaAFY00',
    authDomain: 'fir-44abd.firebaseapp.com',
    databaseURL: 'https://fir-44abd-default-rtdb.firebaseio.com',
    projectId: 'fir-44abd',
    storageBucket: 'fir-44abd.appspot.com',
    messagingSenderId: '513391440326',
    appId: '1:513391440326:web:1c076486af50e8572742c7',
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        // data: {
        //     link: 'https://www.facebook.com/nguyenvancuong13102001/',
        // },
    };

    // eslint disable next line no restricted globals
    // self.registration.showNotification(notificationTitle, notificationOptions);
});
