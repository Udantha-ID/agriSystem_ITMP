import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Marketplace from './Pages/MarketPlace.jsx'
import Inventory from './Pages/Inventory.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import UserRegister from "./pages/SmartFarm/UserRegister.jsx";
import UserLogin from "./pages/SmartFarm/UserLogin.jsx";
import UserRegPayment from "./pages/SmartFarm/UserRegPayment.jsx";
import SmartFarm from "./pages/SmartFarm/SmartFarm.jsx";
import UserProfile from "./pages/SmartFarm/UserProfile.jsx";
import Explore from "./pages/SmartFarm/Explore.jsx";
import Drone from "./pages/SmartFarm/Drone.jsx";
import Irrigation from "./pages/SmartFarm/Irrigation.jsx";
import UserDashboard from "./pages/SmartFarm/UserDashboard.jsx";
// import LandDevelopment from './Pages/LandDevelopment/LandBoundary.jsx'

function App() {
  return (
    <BrowserRouter> {/* Wrap the whole app with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />


        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/payment" element={<UserRegPayment />} />
        <Route path="/smart" element={<SmartFarm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/drone" element={<Drone />} />
        <Route path="/irrigation" element={<Irrigation />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
