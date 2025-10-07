// // import React, { useContext, useEffect, useState } from 'react'
// // import './Navbar.css'
// // import { assets } from '../../assets/assets'
// // import { Link, useNavigate, useLocation } from 'react-router-dom'
// // import { StoreContext } from '../../Context/StoreContext'

// // const Navbar = ({ setShowLogin }) => {

// //   const [menu, setMenu] = useState("home");
// //   const { getTotalCartAmount, token ,setToken } = useContext(StoreContext);
// //   const navigate = useNavigate();
  
// //   const location = useLocation();const handleMenuClick = () => {
// //       setMenu("menu");
// //       navigate('/#explore-menu');
// //       setTimeout(() => {
// //           document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
// //       }, 100);
// //   };

// //   const handleAppDownloadClick = () => {
// //       setMenu("mobile-app")
// //       navigate('/#app-download');
// //       setTimeout(() => {
// //           document.getElementById('app-download')?.scrollIntoView({ behavior: 'smooth' });
// //       }, 100);
// //     };




// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setToken("");
// //     navigate('/')
// //   }

// //   return (
// //     <div className='navbar'>
// //       <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
// //       <ul className="navbar-menu">
// //       <Link to="/" onClick={() => setMenu("home")} className={location.pathname === '/' && location.hash === '' ? "active" : ""}>home</Link>
// //       <a onClick={handleMenuClick} className={location.hash === '#explore-menu' ? "active" : ""}>menu</a>
// //         <a onClick={handleAppDownloadClick} className={location.hash === '#app-download' ? "active" : ""}>mobile-app</a>
// //         <a href="#footer" onClick={() => setMenu("contact us")} className={location.hash === '#footer' ? "active" : ""}>contact us</a>
// //       </ul>
// //       <div className="navbar-right">
// //         <img src={assets.search_icon} alt="" />
// //         <Link to='/cart' className='navbar-search-icon'>
// //           <img src={assets.basket_icon} alt="" />
// //           <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
// //         </Link>
// //         {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
// //           : <div className='navbar-profile'>
// //             <img src={assets.profile_icon} alt="" />
// //             <ul className='navbar-profile-dropdown'>
// //               <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
// //               <hr />
// //               <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
// //             </ul>
// //           </div>
// //         }

// //       </div>
// //     </div>
// //   )
// // }

// // export default Navbar
import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, userName, logout } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = () => {
        setMenu("menu");
        navigate('/#explore-menu');
        setTimeout(() => {
            document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAppDownloadClick = () => {
        setMenu("mobile-app");
        navigate('/#app-download');
        setTimeout(() => {
            document.getElementById('app-download')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='navbar'>
            <Link to='/'><img className='logo' src={assets.logo1} alt="" /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu("home")} className={location.pathname === '/' && location.hash === '' ? "active" : ""}>home</Link>
                <a onClick={handleMenuClick} className={location.hash === '#explore-menu' ? "active" : ""}>menu</a>
                <a href="#footer" onClick={() => setMenu("contact us")} className={location.hash === '#footer' ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                {/* <img src={assets.search_icon} alt="" /> */}
                <Link to='/cart' className='navbar-search-icon'>
                    <img src={assets.basket_icon} alt="" />
                    <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
                </Link>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="" />
                        <ul className='navbar-profile-dropdown'>
                            {userName && (
                                <li className="user-info">
                                    <p className="user-name">{userName}</p>
                                </li>
                            )}
                            <li onClick={() => navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="" />
                                <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={handleLogout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
