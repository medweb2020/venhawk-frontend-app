import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '../common/Avatar';
import VenHawkLogo from '../../assets/venhawk.svg';

/**
 * Header Component
 * @description Main header with navigation and user info
 */
const Header = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={VenHawkLogo} alt="VenHawk" className="h-5 md:h-6 w-auto" />
          </Link>

          {/* Right side */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              {/* User info - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-700 font-semibold">{user?.name || user?.email}</span>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="focus:outline-none"
                  >
                    <Avatar
                      src={user?.picture}
                      name={user?.name || user?.email}
                      size="small"
                      className="ring-2 ring-gray-200"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile avatar with dropdown */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="focus:outline-none"
                >
                  <Avatar
                    src={user?.picture}
                    name={user?.name || user?.email}
                    size="small"
                    className="ring-2 ring-gray-200"
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {};

export default Header;
