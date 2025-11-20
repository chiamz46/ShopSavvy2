import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo1} alt="" />
            <p>Bringing flavors to your doorstep, one meal at a time. At Gourmet Express Online Food Delivery Platform, we are dedicated to connecting you with your favorite local restaurants and hidden gems, making delicious food just a click away. Order now and enjoy the finest meals, wherever you are!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-629-278-2643</li>
                <li>+1-602-810-3723</li>
                <li></li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 - All Right Reserved.</p>
    </div>
  )
}

export default Footer
