import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import QrGenerator from './components/QrGenerator';
import QrScanner from './components/QrScanner';
import QrCodeHistory from './components/QrCodeHistory';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingNavDock from './components/FloatingNavDock';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/QrScanner"
          element={
            <PrivateRoute>
              <QrGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/QrGenerator"
          element={
            <PrivateRoute>
              <QrScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/QrHistory"
          element={
            <PrivateRoute>
              <QrCodeHistory />
            </PrivateRoute>
          }
        />
      </Routes>
      <FloatingNavDock />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
