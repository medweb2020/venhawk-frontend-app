import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import VenHawkLogo from '../../assets/venhawk.svg';
import VenAiLogo from '../../assets/ven-ai.svg';

/**
 * Header Component
 * @description Main header with navigation and user info
 */
const Header = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [showDropdown, setShowDropdown] = useState(false);
  const displayName = user?.name || user?.email || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img src={VenHawkLogo} alt="VenHawk" className="h-5 md:h-6 w-auto" />
          </Link>

          {/* Right side */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 md:gap-6">
              <img src={VenAiLogo} alt="Ven AI" className="h-5 md:h-6 w-auto shrink-0" />

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 md:gap-3 rounded-full px-1.5 py-1 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/20"
                  aria-haspopup="menu"
                  aria-expanded={showDropdown}
                  aria-label="Open user menu"
                >
                  <span className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z"
                      />
                    </svg>
                  </span>
                  <span className="hidden md:block max-w-[180px] truncate text-base font-medium text-[#465168]">
                    {displayName}
                  </span>
                  <svg
                    className={`h-4 w-4 text-[#4B5563] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10 cursor-pointer"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
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
