import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import PlayLayout from './pages/PlayLayout';
import ContactPage from './pages/ContactPage';
import MobileAppPage from './pages/MobileAppPage';

function App() {
    return (
        <>
            <ScrollToTop/>
            <Routes>
                <Route path="/" element={<><Navbar/><HomePage/><Footer/></>}/>
                <Route path="/about" element={<><Navbar/><AboutPage/><Footer/></>}/>
                <Route path="/contact" element={<><Navbar/><ContactPage/><Footer/></>}/>
                <Route path="/mobile" element={<><Navbar/><MobileAppPage/><Footer/></>}/>
                <Route path="/play/*" element={<PlayLayout/>}/>
            </Routes>
        </>
    );
}

export default App;
