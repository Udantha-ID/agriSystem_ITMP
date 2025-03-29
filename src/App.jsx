import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Marketplace from './Pages/MarketPlace/MarketPlace.jsx'
import Inventory from './Pages/MarketPlace/Inventory.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import PlantationDashboard from './Pages/PlantationManagement/PlantationDashboard.jsx'
import PlantationManagement from './Pages/PlantationManagement/PlantationManagement.jsx'
import FarmResourcePlanning from './Pages/PlantationManagement/FarmResourcecePlanning.jsx'
import PlanningForm from './Pages/PlantationManagement/PlanningForm.jsx'
import MonitoringReports from './Pages/PlantationManagement/MonitoringReports.jsx'
import AddPlantation from './Pages/PlantationManagement/AddPlantation.jsx'
// import LandDevelopment from './Pages/LandDevelopment/LandBoundary.jsx'

import LandBoundary from './Pages/LandingDevelopment/LandBoundary.jsx';


function App() {
  return (
    <BrowserRouter> {/* Wrap the whole app with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/pmdashboard" element={<PlantationDashboard />} />
        <Route path="/plantations" element={<PlantationManagement />} />
        <Route path="/resources" element={<FarmResourcePlanning/>} />
        <Route path="/planning/:projectId" element={<PlanningForm />} />
        <Route path="/reports" element={<MonitoringReports/>} />
        <Route path="/addplant" element={<AddPlantation />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/landboundary" element={<LandBoundary />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
