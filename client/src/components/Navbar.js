import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className="navbar-fixed">
      <nav>
        <div
          className="nav-wrapper blue lighten-2"
          style={{ padding: '0 2rem' }}
        >
          <span className="brand-logo">Minlex bot</span>
          <ul className="right">
            <li>
              <NavLink to="/list">User list</NavLink>
            </li>
            <li>
              <NavLink to="#!">Support</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
