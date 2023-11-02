import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRegistration from './components/auth/UserRegistration';
import UserLogin from './components/auth/Login';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRegistration />}></Route>
        <Route path="/login" element={<UserLogin />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
