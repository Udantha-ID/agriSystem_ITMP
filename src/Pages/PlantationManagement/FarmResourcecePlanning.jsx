import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CalendarIcon, 
  SunIcon, 
  BeakerIcon, 
  BugAntIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

function FarmResourcePlanning() {
  const [plantations, setPlantations] = useState([]);
  const [plannings, setPlannings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 // frontend/src/Pages/FarmResourcePlanning.jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [plantationsRes, planningsRes] = await Promise.all([
        axios.get("http://localhost:5000/plantations?completed=false"),
        axios.get("http://localhost:5000/plannings"),
      ]);

      const mergedData = plantationsRes.data
        .filter(plantation => !plantation.completed)
        .map((plantation) => ({
          ...plantation,
          planning: planningsRes.data.find(
            (p) => p.projectId === plantation._id
          ),
        }));

      setPlantations(mergedData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        error.response?.data?.message || error.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  // Refresh data every 5 minutes
  const interval = setInterval(fetchData, 300000);
  return () => clearInterval(interval);
}, []);

  const handleDeletePlanning = async (planningId) => {
    try {
      await axios.delete(`http://localhost:5000/plannings/${planningId}`);
      setPlantations((prev) =>
        prev.map((p) =>
          p.planning?._id === planningId ? { ...p, planning: null } : p
        )
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete planning");
    }
  };

  const getNextFertilizerDate = (planning) => {
    if (!planning?.fertilizerSchedules?.length) return "N/A";
    const dates = planning.fertilizerSchedules.map(f => new Date(f.date));
    return new Date(Math.min(...dates)).toLocaleDateString();
  };

  const getNextPestControlDate = (planning) => {
    if (!planning?.pestControls?.length) return "N/A";
    const dates = planning.pestControls.map(p => new Date(p.date));
    return new Date(Math.min(...dates)).toLocaleDateString();
  };

  const getReminderTasks = () => {
    return plantations.flatMap(project => 
      (project.planning?.fertilizerSchedules || [])
        .filter(f => f.reminder)
        .map(f => ({
          type: 'Fertilizer',
          date: f.date,
          project: project.projectName,
          details: `${f.type} (${f.method})`,
          id: f._id
        }))
        .concat(
          (project.planning?.pestControls || [])
            .filter(p => p.reminder)
            .map(p => ({
              type: 'Pest Control',
              date: p.date,
              project: project.projectName,
              details: `${p.method} - ${p.product}`,
              id: p._id
            }))
        )
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Decorative Elements */}
          <div className="relative mb-12">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                Farm Resource Planning
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and monitor your agricultural resources efficiently
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects Column */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3.5 rounded-xl mr-4 shadow-lg">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                    Agricultural Projects
                  </h2>
                </div>

                {plantations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 mb-4 shadow-lg">
                      <ChartBarIcon className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No projects found
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Start by creating a new agricultural project to manage your resources
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {plantations.map((project) => (
                      <div
                        key={project._id}
                        className="group relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                              {project.projectName}
                            </h3>
                            {project.planning ? (
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                {/* Soil Quality Card */}
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                  <div className="flex items-center mb-3">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                      <SunIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Soil Quality</span>
                                  </div>
                                  <div className={`text-sm px-3 py-1.5 rounded-full inline-block ${
                                    project.planning.soilData?.quality === 'High' 
                                      ? 'bg-green-100 text-green-800' :
                                    project.planning.soilData?.quality === 'Medium' 
                                      ? 'bg-amber-100 text-amber-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                    {project.planning.soilData?.quality || "N/A"}
                                  </div>
                                </div>

                                {/* Fertilizer Card */}
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                  <div className="flex items-center mb-3">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                      <BeakerIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Next Fertilizer</span>
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">
                                    {getNextFertilizerDate(project.planning)}
                                  </div>
                                </div>

                                {/* Pest Control Card */}
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                                  <div className="flex items-center mb-3">
                                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                      <BugAntIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Next Pest Control</span>
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">
                                    {getNextPestControlDate(project.planning)}
                                  </div>
                                </div>

                                {/* Timeline Card */}
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                                  <div className="flex items-center mb-3">
                                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                                      <CalendarIcon className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Created</span>
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">
                                    {new Date(project.planning.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-100">
                                No planning created yet
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-6">
                            {project.planning ? (
                              <>
                                <button
                                  onClick={() => navigate(`/update-planning/${project.planning._id}`)}
                                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  Update
                                </button>

                                <button
                                  onClick={() => handleDeletePlanning(project.planning._id)}
                                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => navigate(`/planning/${project._id}`)}
                                className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                Create Plan
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reminders Column */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3.5 rounded-xl mr-4 shadow-lg">
                  <CalendarIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Upcoming Reminders
                </h2>
              </div>

              {getReminderTasks().length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-4 shadow-lg">
                    <CalendarIcon className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No reminders
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    You have no upcoming reminders at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getReminderTasks().map((task, index) => (
                    <div 
                      key={index}
                      className="p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`text-sm font-semibold mb-2 ${
                            task.type === 'Fertilizer' 
                              ? 'text-blue-600' 
                              : 'text-purple-600'
                          }`}>
                            {task.type}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {task.project}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">
                            {task.details}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-600">
                            {new Date(task.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(task.date).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmResourcePlanning;