import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./UserRegistration.css"

function UserRegistration() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState('user');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        role: selectedRole,
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, dataToSend); 

      if (response.data.success) {
        setSuccessMessage('User registered successfully!');
        setFormData({ username: '', password: '' }); 
        window.location.href='/login'
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="container-3">
    <h2>User Registration</h2>
    {error && <p className="error-message">{error}</p>}
    {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className='form-3'>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input-field-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field-3"
        />
       <div className="role-container">
  <label className="role-label">Role:</label>
  <select value={selectedRole} onChange={handleRoleChange}>
    <option value="user">User</option>
    <option value="vendor">Vendor</option>
  </select>
</div>
        <button type="submit" className="submit-button">Register</button>
    <Link to="/login" className="login-link">Login</Link>

      </form>
    </div>
  );
}

export default UserRegistration;
