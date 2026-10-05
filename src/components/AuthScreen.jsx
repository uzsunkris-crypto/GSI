import React, { useState } from 'react';
import { signupUser, loginUser } from '../storage';

export default function AuthScreen({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      const res = signupUser(phoneNumber, password);
      if (res.success) {
        onLoginSuccess(res.user.phoneNumber);
      } else {
        setError(res.message);
      }
    } else {
      const res = loginUser(phoneNumber, password);
      if (res.success) {
        onLoginSuccess(res.user.phoneNumber);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px'
      }}>
        {/* Minimal Clean GSI Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#1a73e8',
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            GSI
          </h1>
          <p style={{ fontSize: '15px', color: '#5f6368' }}>
            {isSignup ? 'Create an account to keep records' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div style={{
            color: '#d93025',
            fontSize: '13px',
            marginBottom: '16px',
            backgroundColor: '#fdf2f2',
            padding: '8px 12px',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="gsi-field">
            <label className="gsi-label">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 555-123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="gsi-input"
              required
              autoFocus
            />
          </div>

          <div className="gsi-field" style={{ marginTop: '12px' }}>
            <label className="gsi-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gsi-input"
              required
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              style={{
                color: '#1a73e8',
                fontSize: '13px',
                fontWeight: 500,
                padding: '4px 0'
              }}
            >
              {isSignup ? 'Already have an account? Sign in' : 'Create account'}
            </button>

            <button type="submit" className="btn-gsi-primary">
              {isSignup ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
