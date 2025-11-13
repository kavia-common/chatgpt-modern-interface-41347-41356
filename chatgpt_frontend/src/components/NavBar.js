import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * A simple navigation bar for the app.
 */
function NavBar() {
  /** Render NavBar with Home(Chat) and Hello links */
  return (
    <nav
      className="navbar"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '12px 16px'
      }}
      aria-label="Main Navigation"
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: 'none',
          fontWeight: 600
        })}
        end
      >
        Chat
      </NavLink>
      <span aria-hidden="true" style={{ opacity: 0.25 }}>|</span>
      <NavLink
        to="/hello"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: 'none',
          fontWeight: 600
        })}
      >
        Hello
      </NavLink>
    </nav>
  );
}

export default NavBar;
