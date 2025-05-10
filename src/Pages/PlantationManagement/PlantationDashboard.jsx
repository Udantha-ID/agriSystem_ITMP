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
  DocumentTextIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  Square3Stack3DIcon
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

function PlantationDashboard() {
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
    const fetchPlantations = async () => {
      try {
        const [plantationsResponse, planningsResponse] = await Promise.all([
          axios.get("http://localhost:5000/plantations"),
          axios.get("http://localhost:5000/plannings")
        ]);

        const plantationsWithPlanning = plantationsResponse.data.map(plantation => ({
          ...plantation,
          planning: planningsResponse.data.find(p => p.projectId === plantation._id)
        }));

        setAllPlantations(plantationsWithPlanning);
        
        const activeProjects = plantationsWithPlanning.filter(p => !p.completed);
        const assigned = activeProjects.reduce((sum, p) => sum + (p.employees || 0), 0);
        setAssignedWorkers(assigned);
      } catch (error) {
        console.error("Error fetching plantations:", error);
      }
    };

    fetchPlantations();
  }, []);

  const completedPlantations = allPlantations.filter(p => p.completed);
  const activePlantations = allPlantations.filter(p => !p.completed);

  const WeatherSection = ({ city }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchWeather = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await axios.get(
            `http://localhost:5000/api/weather?city=${city}`
          );
          
          if (response.data.status === 'success') {
            setWeatherData(response.data.data);
          } else {
            setError(response.data.message || 'Failed to fetch weather data');
          }
        } catch (err) {
          if (err.response) {
            if (err.response.data.code === 'INVALID_CITY') {
              setError('Please select a valid city from the dropdown');
            } else {
              setError(err.response.data.message || 'Weather service error');
            }
          } else {
            setError('Network error - failed to connect to weather service');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
      const interval = setInterval(fetchWeather, 300000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }, [city]);

    if (loading) {
      return (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Selected city: {city}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Temperature Card */}
        <div className="relative bg-orange-50/60 backdrop-blur-sm p-5 rounded-2xl border border-orange-200/50 hover:border-orange-300 transition-all">
          <div className="absolute top-2 right-2 opacity-30">
            <SunIcon className="h-16 w-16 text-amber-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Temperature</h3>
            <p className="text-4xl font-bold text-gray-700 mb-2">
              {Math.round(weatherData.temperature)}°
              <span className="text-2xl text-gray-600">C</span>
            </p>
            <p className="text-sm text-gray-500">
              Feels like {Math.round(weatherData.feels_like)}°
            </p>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="relative bg-sky-50/60 backdrop-blur-sm p-5 rounded-2xl border border-sky-200/50 hover:border-sky-300 transition-all">
          <div className="absolute top-2 right-2 opacity-30">
            <BeakerIcon className="h-16 w-16 text-sky-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Humidity</h3>
            <p className="text-4xl font-bold text-gray-700 mb-2">
              {weatherData.humidity}%
            </p>
            <p className="text-sm text-gray-500">
              Conditions: {weatherData.conditions}
            </p>
          </div>
        </div>

        {/* Wind Card */}
        <div className="relative bg-emerald-50/60 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200/50 hover:border-emerald-300 transition-all">
          <div className="absolute top-2 right-2 opacity-30">
            <WifiIcon className="h-16 w-16 text-emerald-400 transform rotate-45" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Wind</h3>
            <p className="text-4xl font-bold text-gray-700 mb-2">
              {weatherData.wind.speed}m/s
            </p>
            <p className="text-sm text-gray-500">
              Direction: {weatherData.wind.deg}°
            </p>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="relative bg-purple-50/60 backdrop-blur-sm p-5 rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all">
          <div className="absolute top-2 right-2 opacity-30">
            <CloudIcon className="h-16 w-16 text-violet-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Visibility</h3>
            <p className="text-4xl font-bold text-gray-700 mb-2">
              {weatherData.visibility} km
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(weatherData.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ProjectModal = ({ project, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full relative shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h3 className="text-3xl font-bold text-emerald-700 mb-2">{project.projectName}</h3>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-emerald-500" />
              {project.location}
            </span>
            <span className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-emerald-500" />
              Completed {new Date(project.completedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Project Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Square3Stack3DIcon className="h-5 w-5 mr-2 text-emerald-500" />
                Project Details
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-800">{project.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Land Area</span>
                  <span className="font-medium text-gray-800">{project.landArea} acres</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Employees</span>
                  <span className="font-medium text-gray-800">{project.employees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-800">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Harvest Date</span>
                  <span className="font-medium text-gray-800">
                    {new Date(project.harvestingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Planning Details */}
          <div className="space-y-6">
            {project.planning ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-emerald-500" />
                  Planning Details
                </h4>
                
                {/* Soil Quality */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Soil Quality</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.planning.soilData?.quality === 'High' 
                        ? 'bg-green-100 text-green-800' 
                        : project.planning.soilData?.quality === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {project.planning.soilData?.quality || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Fertilizer Schedules */}
                {project.planning.fertilizerSchedules?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <BeakerIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      Fertilizer Schedules
                    </h5>
                    <div className="space-y-2">
                      {project.planning.fertilizerSchedules.map((schedule, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{schedule.type}</p>
                              <p className="text-sm text-gray-600">{schedule.method}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(schedule.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pest Controls */}
                {project.planning.pestControls?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <BugAntIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      Pest Controls
                    </h5>
                    <div className="space-y-2">
                      {project.planning.pestControls.map((control, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{control.method}</p>
                              <p className="text-sm text-gray-600">{control.product}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(control.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                No planning data available
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
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
              <WeatherSection city={selectedCity} />
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
                {completedPlantations.slice(0, 3).map((plantation) => (
                  <div
                    key={plantation._id}
                    onClick={() => setSelectedProject(plantation)}
                    className="group flex items-center justify-between p-4 hover:bg-emerald-50 rounded-xl cursor-pointer border-l-4 border-emerald-100 hover:border-emerald-400 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-800">
                          {plantation.projectName}
                        </p>
                        <div className="flex items-center gap-2">
                          {plantation.planning && (
                            <>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {plantation.planning.fertilizerSchedules?.length || 0} Fertilizers
                              </span>
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                {plantation.planning.pestControls?.length || 0} Pest Controls
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {plantation.location}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Completed {new Date(plantation.completedDate).toLocaleDateString()}
                        </span>
                        {plantation.planning?.soilData?.quality && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plantation.planning.soilData.quality === 'High' 
                              ? 'bg-green-100 text-green-800' 
                              : plantation.planning.soilData.quality === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Soil: {plantation.planning.soilData.quality}
                          </span>
                        )}
                      </div>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-emerald-600 ml-4" />
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