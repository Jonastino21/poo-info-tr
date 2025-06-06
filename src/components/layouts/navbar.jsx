import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../assets/avatars/1.png'
import { BellIcon, CogIcon } from '@heroicons/react/24/outline'
import Isstm from '../../assets/isstm.png'

const Navbar = ({ user, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
         
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-16 w-auto" src={Isstm} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center space-x-4 relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
             <BellIcon className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CogIcon className="h-6 w-6" />
            </button>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="user-menu-button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={Avatar}
                  alt="Avatar utilisateur"
                />
              </button>

              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={logout}
                      className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
