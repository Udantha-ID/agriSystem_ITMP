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
import UpdatePlantation from './Pages/PlantationManagement/UpdatePlantation.jsx'
// import LandDevelopment from './Pages/LandDevelopment/LandBoundary.jsx'
import UpdatePlanning from './Pages/PlantationManagement/UpdatePlanning.jsx'

import LandBoundary from './Pages/LandingDevelopment/LandBoundary.jsx';
import PlantationManagementAbout from './Pages/PlantationManagement/PlantationmanagementAbout.jsx'


function App() {
  return (
    <BrowserRouter> {/* Wrap the whole app with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/pmdashboard" element={<PlantationDashboard />} />
        <Route path="/plantationsmanage" element={<PlantationManagement />} />
        <Route path="/resourcesplan" element={<FarmResourcePlanning/>} />
        <Route path="/create-planning/:projectId" element={<PlanningForm />} />
        <Route path="/update-planning/:id" element={<UpdatePlanning />} />
        <Route path="/mreports" element={<MonitoringReports/>} />
        <Route path="/addplantation" element={<AddPlantation />} />
        <Route path="/updateplantation/:id" element={<UpdatePlantation />} />
        <Route path="/plantabout" element={<PlantationManagementAbout />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/landboundary" element={<LandBoundary />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
