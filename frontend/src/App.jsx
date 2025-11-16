// src/App.jsx
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
import PlantInfo from './pages/PlantInfo'

// Admin imports
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import UserDetails from './pages/admin/UserDetails'
import PlantManagement from './pages/admin/PlantManagement'
import Analytics from './pages/admin/Analytics'

function App() {
  return (
    <>
      <div className='px-2 sm:px-[3vw] md:px-[4vw] lg:px-[1.5vw]'>
        <Navbar />
      </div>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/myGarden' element={<MyGarden/>} />
          <Route path='/quizzes' element={<Quizzes/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/myprofile' element={<MyProfile/>} />
          <Route path='/plantinfo/:plantId' element={<PlantInfo/>} />

          {/* Admin Routes */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<UserManagement />} />
            <Route path='users/:userId' element={<UserDetails />} />
            <Route path='plants' element={<PlantManagement />} />
            <Route path='analytics' element={<Analytics />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App