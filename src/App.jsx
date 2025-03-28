import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Marketplace from './Pages/MarketPlace.jsx'
import Inventory from './Pages/Inventory.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import PlantationDashboard from './Pages/PlantationManagement/PlantationDashboard.jsx'
// import LandDevelopment from './Pages/LandDevelopment/LandBoundary.jsx'

function App() {
  return (
    <BrowserRouter> {/* Wrap the whole app with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/pmdashboard" element={<PlantationDashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
