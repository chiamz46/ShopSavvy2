import React, { useState } from 'react';
import './Auth.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

const Auth = ({setToken}) => {
  const [currState, setCurrState] = useState("Sign In");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  const url = "https://idx-shop-savvy-92055922-394185122079.us-central1.run.app";

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Sign In") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
    } else {
        alert(response.data.message);
    }
  }

  return (
    <div className='auth'>
      <form onSubmit={onLogin} className="auth-container">
        <div className="auth-title">
          <h2>{currState}</h2>
        </div>
        <div className="auth-inputs">
          {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Store name' required /> : null}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="auth-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Sign In" 
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Sign In")}>Login here</span></p>
        }
      </form>
    </div>
  );
};

export default Auth;
