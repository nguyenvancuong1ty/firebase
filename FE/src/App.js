import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Homepage';
import Header from './Header';

import { useState } from 'react';

function App() {
    const [show, setShow] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [uid, setUid] = useState(localStorage.getItem('uid'));
    return (
        <Router>
            <div className="App" onClick={() => setShowCart(false)}>
                <Header setShow={setShow} showCart={showCart} setShowCart={setShowCart} setUid={setUid} />

                <section style={{ height: 150 }}></section>
                <Routes>
                    <Route path="/" element={<Home show={show} setShow={setShow} uid={uid} setUid={setUid}></Home>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
