import React from 'react';

export default function Navbar({ phoneNumber, onLogout, onOpenAbout }) {
  return (
    <header style={{
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#ffffff',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand: Just GSI */}
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1a73e8',
          letterSpacing: '-0.3px'
        }}>
          GSI
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onOpenAbout}
            style={{
              fontSize: '13px',
              color: '#5f6368',
              fontWeight: 500
            }}
          >
            About
          </button>

          <span style={{
            fontSize: '13px',
            color: '#202124',
            fontWeight: 500
          }}>
            {phoneNumber}
          </span>

          <button
            onClick={onLogout}
            style={{
              fontSize: '13px',
              color: '#d93025',
              fontWeight: 500
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
