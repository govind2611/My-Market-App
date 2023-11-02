import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css"
import { Link } from 'react-router-dom';

function UserLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSuccess = async (token, userRole) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);

      const loginUrl = userRole === 'user' ?`${process.env.REACT_APP_BACKEND_URL}/users/login` :`${process.env.REACT_APP_BACKEND_URL}/vendors/login`;

      const response = await axios.post(loginUrl, formData);

      if (response.data.success) {
        window.location.href = '/dashboard';
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, formData);

      if (response.data.success) {
        handleLoginSuccess(response.data.token, response.data.user.role);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="form-container-2">
    <h2>User Login</h2>
    {error && <p className="error-message">{error}</p>}
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="input-field-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="input-field-2"
      />
      <button className='btn' type="submit">Login</button>
      <Link to="/" className="login-link">Register</Link>
    </form>
  </div>
  );
}

export default UserLogin;
