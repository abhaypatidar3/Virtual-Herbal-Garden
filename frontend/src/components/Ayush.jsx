// src/pages/Ayush.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { logout } from "@/store/slices/userSlice";

const Ayush = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = '/public/images/Ayush.jpg'; // Use absolute path from public
    
    img.onload = () => {
      setImageLoaded(true);
      // Small delay for smooth transition
      setTimeout(() => setShowContent(true), 100);
    };

    img.onerror = () => {
      // If image fails to load, still show content
      setImageLoaded(true);
      setShowContent(true);
    };

    // Show content after 2 seconds even if image hasn't loaded
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Loading Skeleton */}
      {!showContent && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-700 animate-pulse flex items-center justify-center">
          <div className="text-white text-2xl font-itim">Loading...</div>
        </div>
      )}

      {/* Background Image Layer */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url('/public/images/Ayush.jpg')`,
          willChange: 'opacity' // Optimize for animation
        }}
      />

      {/* Content Layer */}
      <div 
        className={`relative z-10 w-full h-full flex flex-col sm:flex-row border border-b-black transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Right side - Main Content */}
        <div className='w-full sm:w-1/2 ml-[5vw] h-[60vh]'>
          <div className='bg-black/60 backdrop-blur-sm border-slate-500 border w-[90vw] sm:w-[35vw] h-[40vh] sm:h-[70vh] mt-[20vh] sm:mx-[6vw] rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]'>
            <div className='text-4xl sm:text-[70px] font-itim text-white px-[10vw] mt-[6vh] sm:mt-[10vh] flex justify-center w-full'>
              <h1>AYUSH</h1>
            </div>
            <p className='font-itim text-white text-xl sm:text-4xl text-center px-[4vw] mt-[2vh] sm:mt-[5vh] leading-relaxed'>
              Discover the healing power of nature with our premium Ayurvedic and medicinal plant products, nurtured for your health and well-being. Embrace sustainable wellness through traditional wisdom and modern quality standards.
            </p>
          </div>

          {/* Mobile Buttons */}
          <div className='flex flex-col sm:hidden h-[20vh] w-[70vw] mx-[17vw] mt-[10vh] gap-[5vh] justify-center'>
            <div>
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className='bg-[#556B2F] w-[50vw] h-[7vh] mx-[2vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition-all duration-300 active:scale-95 shadow-lg'
                >
                  Logout
                </button>
              ) : (
                <NavLink to='/login'>
                  <button className='bg-[#556B2F] w-[50vw] h-[7vh] mx-[2vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition-all duration-300 active:scale-95 shadow-lg'>
                    Login
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Left side - Desktop Buttons */}
        <div className="hidden sm:block sm:w-50vw h-[50px] sm:h-screen">
          <div className='h-[40vh] w-[25vw] mx-[12vw] my-[10vh] sm:my-[30vh] flex flex-col gap-[5vh] justify-center'>
            {/* Welcome Message */}
            {isAuthenticated && (
              <div className='bg-black/60 backdrop-blur-sm border-slate-500 border w-[30vw] sm:w-[25vw] h-[20vh] sm:h-[10vh] mt-[2vh] rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]'>
                <div className='font-itim text-white text-xl sm:text-4xl text-start px-[3vw] pl-[3vw] mt-[2vh] sm:mt-[25px]'>
                  Hello, {user?.username || 'Guest'}
                </div>
              </div>
            )}

            {/* Logout Button */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className='bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition-all duration-300 active:scale-95 shadow-lg hover:shadow-2xl'
              >
                LOGOUT
              </button>
            ) : (
              <>
                {/* Login Button */}
                <NavLink to='/login'>
                  <button className='bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition-all duration-300 active:scale-95 shadow-lg hover:shadow-2xl'>
                    LOGIN
                  </button>
                </NavLink>

                {/* Sign Up Button */}
                <NavLink to='/login'>
                  <button className='bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition-all duration-300 active:scale-95 shadow-lg hover:shadow-2xl'>
                    SIGN UP
                  </button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ayush;