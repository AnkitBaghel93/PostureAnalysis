import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    const res = await fetch("https://postureanalysis-backend.onrender.com/api/logout", {
      method: "POST",
      credentials: "include", 
    });

    const data = await res.json();

    if (res.ok) {
      logout(); 
      alert(data.message); 
      navigate("/signin");
    } else {
      alert(data.message || "Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err);
    alert("Logout failed due to network error");
  }
};


  const linkStyle =
    'font-medium transition-colors duration-200 text-gray-700 hover:text-indigo-600';
  const activeStyle = 'text-indigo-700 font-semibold underline underline-offset-4';

  const AuthLinks = () => (
    <>
      <NavLink
        to="/video-upload"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Video Upload
      </NavLink>
      <NavLink
        to="/results"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Results
      </NavLink>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:underline font-medium"
      >
        Logout
      </button>
    </>
  );

  const GuestLinks = () => (
    <>
      <NavLink
        to="/signin"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Sign In
      </NavLink>
      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Sign Up
      </NavLink>
    </>
  );

  return (
    <nav className="bg-gray-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-indigo-600">
          CorrectPosture
        </NavLink>

       
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ''}`
            }
          >
            Home
          </NavLink>
          {isAuthenticated ? <AuthLinks /> : <GuestLinks />}
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-3 pb-4 bg-gray-100 transition-all duration-300">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ''}`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/video-upload"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Video Upload
              </NavLink>
              <NavLink
                to="/results"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Results
              </NavLink>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
