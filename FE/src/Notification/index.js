import React, { useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
const messaging = getMessaging();
getToken(messaging, {
    vapidKey: 'BHgrWIs5bQOgWTw9Onj-qWpZaBs_34LP3ihalsBoflURtmkK2T3xPGv4Al478s7NdpNl7S_ltBxNw_ZW58cW25k',
})
    .then((currentToken) => {
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    })
    .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
function NotificationComponent() {
    useEffect(() => {
        // if ('Notification' in window) {
        //     // Kiểm tra hỗ trợ Notification API
        //     if (Notification.permission === 'granted') {
        //         console.log('Notification permission granted.');
        //     } else if (Notification.permission !== 'denied') {
        //         Notification.requestPermission().then((permission) => {
        //             if (permission === 'granted') {
        //                 console.log('Notification permission granted.');
        //             }
        //         });
        //     } else {
        //         console.log(2);
        //     }
        // } else {
        //     console.log('Notification API not supported in this browser.');
        // }
        function requestPermission() {
            console.log('Requesting permission...');
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    }, []);

    return <h1>Notification</h1>;
}

export default NotificationComponent;
