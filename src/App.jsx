import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import Home from './Pages/Home.jsx'
import Marketplace from './Pages/MarketPlace/MarketPlace.jsx'
import Inventory from './Pages/MarketPlace/Inventory.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import UserRegister from "./Pages/SmartFarm/UserRegister.jsx";
import UserLogin from "./Pages/SmartFarm/UserLogin.jsx"; 
import UserRegPayment from "./Pages/SmartFarm/UserRegPayment.jsx";
import SmartFarm from "./Pages/SmartFarm/SmartFarm.jsx";
import UserProfile from "./Pages/SmartFarm/UserProfile.jsx";
import Explore from "./Pages/SmartFarm/Explore.jsx";
import Drone from "./Pages/SmartFarm/Drone.jsx";
import AISolutions from "./Pages/SmartFarm/AISolutions.jsx";
import GPSTracking from "./Pages/SmartFarm/GPSTracking.jsx";
import VerticalFarming from "./Pages/SmartFarm/VerticalFarming.jsx";
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
import Dashboard from './Pages/LandingDevelopment/Dashboard.jsx'
import LandBoundary from './Pages/LandingDevelopment/LandBoundary.jsx';
import PlantationManagementAbout from './Pages/PlantationManagement/PlantationmanagementAbout.jsx'
import SavedAnalyses from './Pages/Dashboard/SavedAnalyses.jsx'
import UpdatePlanning from './Pages/PlantationManagement/UpdatePlanning.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/pmdashboard" element={<PlantationDashboard />} />
          <Route path="/plantations" element={<PlantationManagement />} />
          <Route path="/resources" element={<FarmResourcePlanning />} />
          <Route path="/create-planning/:projectId" element={<PlanningForm />} />
          <Route path="/update-planning/:id" element={<UpdatePlanning />} />          
          <Route path="/reports" element={<MonitoringReports />} />
          <Route path="/addplant" element={<AddPlantation />} />
          <Route path="/updateplant/:id" element={<UpdatePlantation />} />
          <Route path="/plantabout" element={<PlantationManagementAbout />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses"
            element={
              <ProtectedRoute>
                <SavedAnalyses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/landboundary" 
            element={
              <ProtectedRoute>
                <LandBoundary />
              </ProtectedRoute>
            } 
          />

          {/* Public routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/payment" element={<UserRegPayment />} />
          <Route path="/smart" element={<SmartFarm />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/drone" element={<Drone />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/ai" element={<AISolutions />} />
          <Route path="/gps" element={<GPSTracking />} />
          <Route path="/vertical" element={<VerticalFarming />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
