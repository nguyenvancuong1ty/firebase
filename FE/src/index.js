import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux';
import NotificationComponent from './Notification';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
        <NotificationComponent />
    </Provider>,
);

// Đăng ký service worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('../firebase-messaging-sw.js')
//         .then(function (registration) {
//             console.log('Registration successful, scope is:', registration.scope);
//         })
//         .catch(function (err) {
//             console.log('Service worker registration failed, error:', err);
//         });
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
