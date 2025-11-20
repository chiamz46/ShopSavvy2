import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './pages/Auth/Auth';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
      if (decodedToken.role === 'admin') {
        isAdmin = true;
      } else {
        // If role is not admin, remove the token
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Invalid token:", error);
      // If token is invalid, remove it
      localStorage.removeItem('token');
    }
  }

  if (!token || !isAdmin) {
    return (
      <Routes>
        <Route path='/auth' element={<Auth setToken={setToken} />} />
        <Route path='/*' element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/*" element={<Navigate to="/list" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
