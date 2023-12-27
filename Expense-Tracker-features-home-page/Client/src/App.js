import React, { useState } from 'react';
import './App.scss';
import logo from './logo.png';
import axios from 'axios'; // Import axios

const YourComponent = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleSigninClick = () => {
    setShowSignup(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error.response.data); // Handle error
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error.response.data); // Handle error
    }
  };

  return (
    // ... (your existing JSX)

    <form autoComplete="off">
      {/* ... (your existing form inputs) */}
      <button className="button submit" onClick={showSignup ? handleSignup : handleSignin}>
        {showSignup ? 'Create Account' : 'Login'}
      </button>
    </form>

    // ...
  );
};

export default YourComponent;
