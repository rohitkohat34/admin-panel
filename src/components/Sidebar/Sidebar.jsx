import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink , useNavigate } from 'react-router-dom'

// Import only the icons needed for Payment and Balance buttons
import { FaCreditCard, FaWallet } from 'react-icons/fa'

const Sidebar = () => {

  const navigate = useNavigate();

  const handleMakePaymentClick = () => {
    // Direct to Razorpay payment page or payment component route
    navigate('/payment');
  };

  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to='/add' className='sidebar-option'>
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/payment' className='sidebar-option'>
  <FaCreditCard className='sidebar-icon' />
  <p>Make Payment</p>
</NavLink>

        <NavLink to='/balance' className='sidebar-option'>
          <FaWallet className='sidebar-icon' />
          <p>Balance Payments</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
