import React from 'react'
import { Link } from "react-router-dom";


function PlantationSidebar() {
  return (
    <div className="h-screen w-60 bg-green-600 text-white fixed">
      <h2 className="text-xl font-bold p-4 border-b border-green-700">
      Plantation Dashboard
      </h2>
      <nav className="flex flex-col mt-4">
        <Link
          to="/pmdashboard"
          className="py-4 px-4 hover:bg-gray-700 transition-all"
        >
          Dashboard Overview
        </Link>
        <Link
          to="/plantations"
          className="py-4 px-4 hover:bg-gray-700 transition-all"
        >
          Plantation Management
        </Link>
        <Link
          to="/resources"
          className="py-4 px-4 hover:bg-gray-700 transition-all"
        >
          Farm Resource Planning
        </Link>
        <Link
          to="/reports"
          className="py-4 px-4 hover:bg-gray-700 transition-all"
        >
          Monitoring & Reports
        </Link>
        <Link
          to="/login"
          className="py-4 px-4 hover:bg-gray-700 transition-all"
        >
          Logout
        </Link>
      </nav>
    </div>
  )
}

export default PlantationSidebar