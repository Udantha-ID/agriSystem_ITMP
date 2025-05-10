import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartBarIcon, BeakerIcon, SunIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';

const MonitoringReports = () => {
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all plantations first
        const plantationsRes = await axios.get("http://localhost:5000/plantations");
        const planningsRes = await axios.get("http://localhost:5000/plannings");

        // Filter plantations based on the selected filter
        let filteredPlantations = plantationsRes.data;
        if (filter === 'active') {
          filteredPlantations = plantationsRes.data.filter(p => !p.completed);
        } else if (filter === 'completed') {
          filteredPlantations = plantationsRes.data.filter(p => p.completed);
        }

        // Merge with planning data
        const mergedData = filteredPlantations.map(plantation => ({
          ...plantation,
          planning: planningsRes.data.find(p => p.projectId === plantation._id)
        }));

        setPlantations(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const calculateYield = (planning) => {
    if (!planning) return 'N/A';
    const baseYield = planning.soilData?.quality === 'High' ? 1200 :
                     planning.soilData?.quality === 'Medium' ? 900 : 600;
    const fertilizerBonus = planning.fertilizerSchedules?.length * 50;
    return `${baseYield + fertilizerBonus} kg/ha`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-8 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (plantations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-12">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                    Project Monitoring
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Track and analyze your plantation projects
                  </p>
                </div>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:shadow-xl"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 mb-4 shadow-lg">
                <ChartBarIcon className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No {filter === 'active' ? 'active' : filter === 'completed' ? 'completed' : ''} projects found
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {filter === 'active' 
                  ? 'There are no active projects at the moment' 
                  : filter === 'completed' 
                    ? 'No projects have been completed yet'
                    : 'No projects have been created yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-12">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                  Project Monitoring
                </h1>
                <p className="text-gray-600 text-lg">
                  Track and analyze your plantation projects
                </p>
              </div>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:shadow-xl"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-10">
            {plantations.map(project => (
              <div key={project._id} className="space-y-6 group">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    {project.projectName}
                  </h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                    project.completed 
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-md' 
                      : project.planning 
                        ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 hover:shadow-md' 
                        : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:shadow-md'
                  }`}>
                    {project.completed ? 'Completed' : project.planning ? 'Active' : 'No Plan'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                          Yield Prediction
                        </span>
                      </h3>
                      {project.completed && (
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Completed Project</span>
                        </div>
                      )}
                    </div>
                    <div className="h-56 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex flex-col items-center justify-center border border-indigo-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 to-transparent"></div>
                      <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 relative z-10">
                        {calculateYield(project.planning)}
                      </span>
                      <span className="text-gray-500 mt-3 font-medium relative z-10">Estimated Harvest</span>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-3">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg">
                          <SunIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800">
                          Soil Analysis
                        </span>
                      </h3>
                      {project.completed && (
                        <span className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-lg shadow-sm">
                          Completed on {new Date(project.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-600 font-medium">pH Level</span>
                          <span className="font-semibold text-emerald-600">
                            {project.planning?.soilData?.phLevel || 'N/A'}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${(project.planning?.soilData?.phLevel / 14) * 100 || 0}%`,
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-600 font-medium">Nutrient Level</span>
                          <span className="font-semibold text-amber-600">
                            {project.planning?.soilData?.nutrients || 'N/A'}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: project.planning?.soilData?.nutrients === 'High' ? '80%' :
                              project.planning?.soilData?.nutrients === 'Medium' ? '50%' : '30%',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringReports;