import React, { useState } from "react";
import logo from "../assets/VHG_logo.png";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
// Redux Auth
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full md:w-[90vw] md:left-[5vw] py-4 px-8 text-white bg-gradient-to-r from-[#008080]/90 to-[#556B2F]/90 rounded-b-3xl top-0 left-0 z-10 justify-between flex items-center font-medium absolute">
      {/* Logo */}
      <NavLink to="/">
        <img src={logo} alt="logo" className="w-[150px] rounded-2xl" />
      </NavLink>

      {/* Desktop Nav */}
      <ul className="hidden sm:flex font-itim gap-[30px] py-5 text-[18px]">
        <NavLink to="/" className="flex items-center flex-col gap-1 cursor-pointer">
          <p>HOME</p>
        </NavLink>

        <NavLink to="/explore" className="flex items-center flex-col gap-1 cursor-pointer">
          <p>EXPLORE PLANTS</p>
        </NavLink>

        <NavLink to="/myGarden" className="flex items-center flex-col gap-1 cursor-pointer">
          <p>MY GARDEN</p>
        </NavLink>

        <NavLink to="/quizzes" className="flex items-center flex-col gap-1 cursor-pointer">
          <p>QUIZZES</p>
        </NavLink>

        <NavLink to="/about" className="flex items-center flex-col gap-1 cursor-pointer">
          <p>ABOUT US</p>
        </NavLink>
      </ul>

      {/* Profile Section */}
      <div className="flex item-center gap-6">
        <div className="flex item-center gap-6 py-3 group relative top-0 pb-0 h-[10px] mb-[50px]">

          {/* Avatar */}
          {isAuthenticated ? (
            <img
              src={assets.aflogin}
              alt="profile"
              className="w-[41px] h-[41px] cursor-pointer right-0 rounded-full"
            />
          ) : (
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-[55px] h-[35px] cursor-pointer right-0"
            />
          )}

          {/* Dropdown Menu */}
          <div className="hidden group-hover:block absolute dropdown menu left-1 -translate-x-1/2 pt-10">
            <div className="flex flex-col w-[8vw] py-3 px-5 gap-2 bg-[#daebab] border border-gray-200 text-gray-600 rounded-lg">

              {isAuthenticated && (
                <>
                  <NavLink to="/myprofile" className="cursor-pointer hover:text-black px-3">
                    My Profile
                  </NavLink>

                  <NavLink to="/myGarden" className="cursor-pointer hover:text-black px-3">
                    My Garden
                  </NavLink>
                </>
              )}

              <NavLink to="/about" className="cursor-pointer hover:text-black px-3">
                Contact Us
              </NavLink>

              {/* Login / Logout */}
              <div className="cursor-pointer hover:text-black px-3">
                {isAuthenticated ? (
                  <p onClick={handleLogout}>Logout</p>
                ) : (
                  <NavLink to="/login">Login</NavLink>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="menu"
          className="block sm:hidden w-5 cursor-pointer h-5 mt-4"
        />
      </div>

      {isAuthenticated && user?.role === "super-admin" && (
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span>👑</span>
          <span className="font-medium">Admin Panel</span>
        </Link>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`absolute top-0 h-screen right-0 transition-all mobile-side overflow-auto bg-[#E1EEBC] ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex gap-4 p-3 items-center cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="back" className="h-4 rotate-180" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-t-gray-400 bg-[#E1EEBC]" to="/">
            Home
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-t-gray-400 bg-[#E1EEBC]" to="/explore">
            Explore Plants
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-t-gray-400 bg-[#E1EEBC]" to="/myGarden">
            My Garden
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-t-gray-400 bg-[#E1EEBC]" to="/quizzes">
            QUIZZES
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-gray-400 bg-[#E1EEBC]" to="/about">
            ABOUT US
          </NavLink>

          {!isAuthenticated ? (
            <NavLink onClick={() => setVisible(false)} className="py-1 pl-9 border border-gray-400 bg-[#E1EEBC]" to="/login">
              Login
            </NavLink>
          ) : (
            <p
              onClick={() => {
                handleLogout();
                setVisible(false);
              }}
              className="py-1 pl-9 border border-gray-400 bg-[#E1EEBC] cursor-pointer"
            >
              Logout
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
