import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ← import here
import './CreateAccount.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ← initialize here

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3000/api/admin/create', formData);
      setMessage(res.data.message);

      // Optional delay before redirecting (e.g., 1 second to show success message)
      setTimeout(() => {
        navigate('/add'); // ← your target route
      }, 1000);

    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Something went wrong.');
      }
    }
  };

  return (
    <div className="create-account-wrapper">
      <div className="create-account-form">
        <h2>Create Admin Account</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
