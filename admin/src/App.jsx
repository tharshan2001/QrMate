import React from 'react';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<AdminPanel/>} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;
