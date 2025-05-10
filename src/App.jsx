import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Marketplace from './Pages/MarketPlace/MarketPlace.jsx'
import Inventory from './Pages/MarketPlace/Inventory.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import UserRegister from "./pages/SmartFarm/UserRegister.jsx";
import UserLogin from "./pages/SmartFarm/UserLogin.jsx";
import UserRegPayment from "./pages/SmartFarm/UserRegPayment.jsx";
import SmartFarm from "./pages/SmartFarm/SmartFarm.jsx";
import UserProfile from "./Pages/SmartFarm/UserProfile.jsx";
import Explore from "./pages/SmartFarm/Explore.jsx";
import Drone from "./pages/SmartFarm/Drone.jsx";
import Irrigation from "./pages/SmartFarm/Irrigation.jsx";
import UserDashboard from "./pages/SmartFarm/UserDashboard.jsx";
import PlantationDashboard from './Pages/PlantationManagement/PlantationDashboard.jsx'
import PlantationManagement from './Pages/PlantationManagement/PlantationManagement.jsx'
import FarmResourcePlanning from './Pages/PlantationManagement/FarmResourcecePlanning.jsx'
import PlanningForm from './Pages/PlantationManagement/PlanningForm.jsx'
import MonitoringReports from './Pages/PlantationManagement/MonitoringReports.jsx'
import AddPlantation from './Pages/PlantationManagement/AddPlantation.jsx'
import UpdatePlantation from './Pages/PlantationManagement/UpdatePlantation.jsx'
import ScrollToTop from './Components/ScrollToTop.js'

// import LandDevelopment from './Pages/LandDevelopment/LandBoundary.jsx'

import LandBoundary from './Pages/LandingDevelopment/LandBoundary.jsx';
import PlantationManagementAbout from './Pages/PlantationManagement/PlantationmanagementAbout.jsx'


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/pmdashboard" element={<PlantationDashboard />} />
        <Route path="/plantations" element={<PlantationManagement />} />
        <Route path="/resources" element={<FarmResourcePlanning/>} />
        <Route path="/planning/:projectId" element={<PlanningForm />} />
        <Route path="/reports" element={<MonitoringReports/>} />
        <Route path="/addplant" element={<AddPlantation />} />
        <Route path="/updateplant/:plantId" element={<UpdatePlantation />} />
        <Route path="/plantabout" element={<PlantationManagementAbout />} />
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
        <Route path="/landboundary" element={<LandBoundary />} />

      </Routes>
    </BrowserRouter>
  )
}
export default App
