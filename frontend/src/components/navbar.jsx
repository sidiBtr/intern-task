import React from 'react'
import './navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className='nav-container'>
      <nav className='navbar'>
        <ul>
          <Link to={'/login'}>
            <li>Login</li>
          </Link>
          <Link to={'/register'}>
            <li>Register</li>
          </Link>
        </ul>
      </nav>
    </div>
  )
}
