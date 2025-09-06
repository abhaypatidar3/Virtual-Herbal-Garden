import React, { useState } from 'react'
import logo from '../assets/VHG_logo.png'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className='w-full md:w-[90vw] md:left-[5vw] py-4 px-8 text-white bg-gradient-to-r from-[#008080]/90 to-[#556B2F]/90 rounded-b-3xl top-0 left-0 z-10 justify-between flex items-center font-medium absolute'>
      <img src={logo} alt="logo nii aaya" className='w-[150px] rounded-2xl'/>

      <ul className='hidden sm:flex font-itim gap-[30px] py-5 text-[18px]'>
        <NavLink to='/' className='flex items-center flex-col gap-1 cursor-pointer'>
          <p>HOME</p>
          <hr className='w-2/3 h-[2px] border-none bg-gray-400 p-0 m-0 hidden' />
        </NavLink>
        <NavLink to='/explore' className='flex items-center flex-col gap-1 cursor-pointer'>
          <p>EXPLORE PLANTS</p>
          <hr className='w-2/3 h-[2px] border-none bg-gray-400 p-0 m-0 hidden' />
        </NavLink>
        <NavLink to='/myGarden' className='flex items-center flex-col gap-1 cursor-pointer'>
          <p>MY GARDEN</p>
          <hr className='w-2/3 h-[2px] border-none bg-gray-400 p-0 m-0 hidden' />
        </NavLink>
        <NavLink to='/quizzes' className='flex items-center flex-col gap-1 cursor-pointer'>
          <p>QUIZZES</p>
          <hr className='w-2/3 h-[2px] border-none bg-gray-400 p-0 m-0 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex items-center flex-col gap-1 cursor-pointer'>
          <p>ABOUT US</p>
          <hr className='w-2/3 h-[2px] border-none bg-gray-400 p-0 m-0 hidden' />
        </NavLink>
      </ul>
      <div className='flex item-center gap-6'>
        <div className='flex item-center gap-6 py-3 group relative top-0  pb-0 h-[10px] mb-[50px]'>
            <img src={assets.profile_icon} alt="profile icon gayab" className='w-[55px] h-[35px] cursor-pointer right-0'/>
            <div className='hidden group-hover:block absolute dropdown menu left-1 -translate-x-1/2 pt-10'>
                <div className='flex flex-col w-36 py-3 px-5 gap-2 bg-[#E1EEBC] text-gray-600 rounded-lg'>
                    <NavLink to='/' className='cursor-pointer hover:text-black px-3'>My Profile</NavLink>
                    <NavLink to='/myGarden' className='cursor-pointer hover:text-black px-3'>My Garden</NavLink>
                    <NavLink to='/about' className='cursor-pointer hover:text-black px-3'>Contact Us</NavLink>
                    <NavLink to='/login' className='cursor-pointer hover:text-black px-3'>Login</NavLink>
                </div>
            </div>
        </div>
        <img onClick={()=>setVisible(true)} src={assets.menu_icon} alt="menu icon problem" className='block sm:hidden w-5 cursor-pointer h-5 mt-4'/>
      </div>
      <div className={`absolute top-0 h-screen right-0 transition-all overflow-auto bg-[#E1EEBC] ${visible? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                        <div onClick={()=>setVisible(false)} className='flex gap-4 p-3 items-center cursor-pointer'>
                          <img src={assets.dropdown_icon} alt="back icon problem" className='h-4 rotate-180' />
                          <p>Back</p>
                        </div>
                        <NavLink onClick={()=>setVisible(false)} className={'py-1 pl-9  bg-[#E1EEBC] border border-t-gray-400'} to='/' >Home</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className={'py-1 pl-9  bg-[#E1EEBC] border border-t-gray-400'} to='/explore'>Explore Plants</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className={'py-1 pl-9  bg-[#E1EEBC] border border-t-gray-400'} to='/myGarden'>My Garden</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className={'py-1 pl-9  bg-[#E1EEBC] border border-t-gray-400'} to='/quizzes'>QUIZZES</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className={'py-1 pl-9  bg-[#E1EEBC] border border-gray-400'} to='/about'>ABOUT US</NavLink>
                </div>
      </div>
    </div>
  )
}

export default Navbar
