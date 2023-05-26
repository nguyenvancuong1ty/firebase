import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Homepage';
import Header from './Header';

import { useState } from 'react';

function App() {
    const [show, setShow] = useState(false);
    return (
        <Router>
            <div className="App">
                <Header show={show} setShow={setShow} />
                <section style={{ height: 150 }}></section>
                <Routes>
                    <Route path="/" element={<Home show={show} setShow={setShow}></Home>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
