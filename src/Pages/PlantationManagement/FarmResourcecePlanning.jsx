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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Farm Resource Planning Dashboard
          </h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects Column */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-50">
                <div className="flex items-center mb-6">
                  <div className="bg-green-500 p-3 rounded-lg mr-3">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Agricultural Projects
                  </h2>
                </div>

                {plantations.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No agricultural projects found
                  </div>
                ) : (
                  plantations.map((project) => (
                    <div
                      key={project._id}
                      className="group relative p-4 bg-white rounded-lg border border-gray-100 mb-4 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {project.projectName}
                          </h3>
                          {project.planning ? (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              {/* Soil Quality Card */}
                              <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <SunIcon className="w-5 h-5 text-green-600 mr-2" />
                                  <span className="font-medium">Soil Quality</span>
                                </div>
                                <div className={`text-sm px-2 py-1 rounded-full inline-block ${
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
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <BeakerIcon className="w-5 h-5 text-blue-600 mr-2" />
                                  <span className="font-medium">Next Fertilizer</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {getNextFertilizerDate(project.planning)}
                                </div>
                              </div>

                              {/* Pest Control Card */}
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <BugAntIcon className="w-5 h-5 text-purple-600 mr-2" />
                                  <span className="font-medium">Next Pest Control</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {getNextPestControlDate(project.planning)}
                                </div>
                              </div>

                              {/* Timeline Card */}
                              <div className="p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <CalendarIcon className="w-5 h-5 text-orange-600 mr-2" />
                                  <span className="font-medium">Created</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    project.planning.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              No planning created yet
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {project.planning ? (
                            <>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/update-planning/${project.planning._id}`
                                  )
                                }
                                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                              >
                                Update
                              </button>

                              <button
                                onClick={() =>
                                  handleDeletePlanning(project.planning._id)
                                }
                                className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/create-planning/${project._id}`)
                              }
                              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              Create Plan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reminders Column */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-50 h-fit">
              <div className="flex items-center mb-6">
                <div className="bg-purple-500 p-3 rounded-lg mr-3">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Upcoming Reminders
                </h2>
              </div>

              {getReminderTasks().length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No upcoming reminders
                </div>
              ) : (
                <div className="space-y-4">
                  {getReminderTasks().map((task, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`text-sm font-medium mb-1 ${
                            task.type === 'Fertilizer' 
                              ? 'text-blue-600' 
                              : 'text-purple-600'
                          }`}>
                            {task.type}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {task.project}
                          </div>
                          <div className="text-sm text-gray-700">
                            {task.details}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-600">
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