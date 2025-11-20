import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const url = "https://idx-shop-savvy-92055922-394185122079.us-central1.run.app"
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    if (token) {
        try {
            const response = await axios.get(`${url}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUserName(response.data.user.name);
            }
        } catch (error) {
            console.error('Error fetching user name:', error);
            logout();
        }
    }
};
   useEffect(() => {
        async function loadData() {
            if (token) {
                await Promise.all([
                    fetchUserName()
                ]);
            }
        }
        loadData();
    }, [token]);
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserName("");
};

  const handleLogout = () => {
    logout();
    navigate(0)
    
};
  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} style={{width: '150px'}} alt="" />
      <div className='navbar-profile'>
      <img className='profile' src={assets.profile_image} alt="" />
                        <ul className='navbar-profile-dropdown'>
                            {userName && (
                                <li className="user-info">
                                    <p className="user-name">{userName}</p>
                                </li>
                            )}
                            <hr />
                            <li onClick={handleLogout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
    </div>
  )
}

export default Navbar
