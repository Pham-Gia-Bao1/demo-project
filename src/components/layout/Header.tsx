// src/components/Header.js
import React from "react";
import { useSelector } from "react-redux";
import useAuthHandlers from "../../handlers/useAuthHandlers.ts";
import { RootState } from "../../store/store.ts";
import { User } from '../../models/Auth.ts'
const Header: React.FC = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const {
    showLoginForm,
    credentials,
    loading,
    error,
    toggleLoginForm,
    handleChange,
    handleLogin,
    handleSignup,
    handleLogout,
  } = useAuthHandlers();

  return (
    <header className="App-header">
      <div className="header-container">
        {/* Left Section: Logo and Navigation */}
        <div className="left-section">
          <img
            src="https://cdn.worldvectorlogo.com/logos/svg-2.svg"
            className="App-logo"
            alt="logo"
          />
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/upload">Upload Images</a>
            <a href="/socket">Socket</a>
          </nav>
        </div>

        {/* Right Section: Search and Auth Buttons */}
        <div className="right-section">
          {isLoggedIn ? (
            <div className="user-section">
              <div className="user-profile">
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="auth-button logout-button"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                onClick={toggleLoginForm}
                className="auth-button login-button"
                disabled={loading}
              >
                Log In
              </button>
              <button
                className="auth-button signup-button"
              >
                Sign Up 
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toggleable Login Form */}
      {showLoginForm && !isLoggedIn && (
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <h3>Login</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={toggleLoginForm}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
