import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Explore from './pages/Explore'
import MyGarden from './pages/MyGarden'
import Quizzes from './pages/Quizzes'
import MyProfile from './pages/MyProfile'

function App() {

  return (
    <>
      <div className='px-2 sm:px-[3vw] md:px-[4vw] lg:px-[1.5vw]'>
        <Navbar />
      </div>
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/myGarden' element={<MyGarden/>} />
          <Route path='/quizzes' element={<Quizzes/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/myprofile' element={<MyProfile/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
