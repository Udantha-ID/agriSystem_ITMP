// frontend/src/Pages/PlantationDashboard.jsx (updated)
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAmericasIcon,
  CalendarIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  WifiIcon,
  CheckCircleIcon,
  MapPinIcon,
  DocumentTextIcon,  // Add this
  BugAntIcon        // Add this
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

function PlantationDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [allPlantations, setAllPlantations] = useState([]);
  const [totalWorkers] = useState(100);
  const [assignedWorkers, setAssignedWorkers] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [cities] = useState([
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Anuradhapura",
    "Matara",
    "Negombo",
    "Trincomalee",
    "Batticaloa",
    "Ratnapura",
  ]);
  const [selectedCity, setSelectedCity] = useState("Colombo");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch weather data
        const weatherResponse = await axios.get(
          `http://localhost:5000/api/weather?city=${selectedCity}`
        );
        setWeatherData(weatherResponse.data);

        // Fetch plantations data
        const plantationsResponse = await axios.get("http://localhost:5000/plantations");
        setAllPlantations(plantationsResponse.data);
        
        // Calculate assigned workers
        const activeProjects = plantationsResponse.data.filter(p => !p.completed);
        const assigned = activeProjects.reduce((sum, p) => sum + (p.employees || 0), 0);
        setAssignedWorkers(assigned);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [selectedCity]);

  const completedPlantations = allPlantations.filter(p => p.completed);
  const activePlantations = allPlantations.filter(p => !p.completed);

  const ProjectModal = ({ project, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-4 text-emerald-700">{project.projectName}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">Location:</span> {project.location}
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">Employees:</span> {project.employees}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">Start Date:</span> 
            {new Date(project.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">Completed:</span> 
            {new Date(project.completedDate).toLocaleDateString()}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Planning Details</h4>
          {project.planning ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm flex items-center gap-1">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="font-medium">Fertilizer Schedules:</span> 
                  {project.planning.fertilizerSchedules?.length || 0}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <BugAntIcon className="w-4 h-4" />
                  <span className="font-medium">Pest Controls:</span> 
                  {project.planning.pestControls?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm flex items-center gap-1">
                  <SunIcon className="w-4 h-4" />
                  <span className="font-medium">Soil Quality:</span> 
                  {project.planning.soilData?.quality || 'N/A'}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-medium">Last Updated:</span> 
                  {new Date(project.planning.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No planning data available</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <PlantationSidebar />
      <div className="ml-60 p-8 min-h-screen w-full bg-gradient-to-br from-green-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          {/* Header and City Selector */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Dashboard Content */}
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Plantations",
                  value: allPlantations.length,
                  icon: GlobeAmericasIcon,
                  color: "emerald",
                },
                {
                  title: "Active Plantation",
                  value: activePlantations.length,
                  icon: ArrowTrendingUpIcon,
                  color: "emerald",
                },
                {
                  title: "Completed Plantation",
                  value: completedPlantations.length,
                  icon: CalendarIcon,
                  color: "emerald",
                },
                {
                  title: "Available Workers",
                  value: `${totalWorkers - assignedWorkers} / ${totalWorkers}`,
                  icon: UserGroupIcon,
                  color: "emerald",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500"
                >
                  <h3 className="text-gray-500 text-sm mb-2 font-semibold">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-800">
                      {card.value}
                    </span>
                    <card.icon className={`h-8 w-8 text-${card.color}-600`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Weather Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                <GlobeAmericasIcon className="h-6 w-6 text-emerald-500/80" />
                Live Climate Monitoring - {selectedCity}
              </h2>
              {weatherData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Temperature Card */}
                  <div className="relative bg-orange-50/60 backdrop-blur-sm p-5 rounded-2xl border border-orange-200/50 hover:border-orange-300 transition-all">
                    <div className="absolute top-2 right-2 opacity-30">
                      <SunIcon className="h-16 w-16 text-amber-400" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Temperature
                      </h3>
                      <p className="text-4xl font-bold text-gray-700 mb-2">
                        {Math.round(weatherData.main.temp)}°
                        <span className="text-2xl text-gray-600">C</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Feels like {Math.round(weatherData.main.feels_like)}°
                      </p>
                    </div>
                  </div>

                  {/* Humidity Card */}
                  <div className="relative bg-sky-50/60 backdrop-blur-sm p-5 rounded-2xl border border-sky-200/50 hover:border-sky-300 transition-all">
                    <div className="absolute top-2 right-2 opacity-30">
                      <BeakerIcon className="h-16 w-16 text-sky-400" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Humidity
                      </h3>
                      <p className="text-4xl font-bold text-gray-700 mb-2">
                        {weatherData.main.humidity}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Pressure: {weatherData.main.pressure}hPa
                      </p>
                    </div>
                  </div>

                  {/* Conditions Card */}
                  <div className="relative bg-purple-50/60 backdrop-blur-sm p-5 rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all">
                    <div className="absolute top-2 right-2 opacity-30">
                      <CloudIcon className="h-16 w-16 text-violet-400" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Conditions
                      </h3>
                      <p className="text-2xl font-bold text-gray-700 mb-2 capitalize">
                        {weatherData.weather[0].description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Visibility: {(weatherData.visibility / 1000).toFixed(1)}
                        km
                      </p>
                    </div>
                  </div>

                  {/* Wind Card */}
                  <div className="relative bg-emerald-50/60 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200/50 hover:border-emerald-300 transition-all">
                    <div className="absolute top-2 right-2 opacity-30">
                      <WifiIcon className="h-16 w-16 text-emerald-400 transform rotate-45" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Wind
                      </h3>
                      <p className="text-4xl font-bold text-gray-700 mb-2">
                        {weatherData.wind.speed}m/s
                      </p>
                      <p className="text-sm text-gray-500">
                        Direction: {weatherData.wind.deg}°
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Completed Plantations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Completed Plantations
                </h2>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {completedPlantations.map((plantation) => (
                  <div
                    key={plantation._id}
                    onClick={() => setSelectedProject(plantation)}
                    className="group flex items-center justify-between p-4 hover:bg-emerald-50 rounded-xl cursor-pointer border-l-4 border-emerald-100 hover:border-emerald-400 transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {plantation.projectName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Completed{" "}
                        {new Date(
                          plantation.completedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}

export default PlantationDashboard;
