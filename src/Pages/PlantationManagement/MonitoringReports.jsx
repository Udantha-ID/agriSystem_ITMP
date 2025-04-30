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
        const params = {};
        if (filter === 'active') params.completed = false;
        if (filter === 'completed') params.completed = true;

        const [plantationsRes, planningsRes] = await Promise.all([
          axios.get("http://localhost:5000/plantations", { params }),
          axios.get("http://localhost:5000/plannings"),
        ]);

        const mergedData = plantationsRes.data.map(plantation => ({
          ...plantation,
          planning: planningsRes.data.find(p => p.projectId === plantation._id)
        }));

        setPlantations(mergedData);
      } catch (error) {
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Project Monitoring</h1>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg shadow border border-gray-200"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-8">
            {plantations.map(project => (
              <div key={project._id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{project.projectName}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.completed 
                      ? 'bg-gray-100 text-gray-700' 
                      : project.planning 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {project.completed ? 'Completed' : project.planning ? 'Active' : 'No Plan'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ChartBarIcon className="w-6 h-6 text-indigo-500" />
                        Yield Prediction
                      </h3>
                      {project.completed && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Completed Project</span>
                        </div>
                      )}
                    </div>
                    <div className="h-48 bg-indigo-50 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">
                        {calculateYield(project.planning)}
                      </span>
                      <span className="text-gray-500 mt-2">Estimated Harvest</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <SunIcon className="w-6 h-6 text-emerald-500" />
                        Soil Analysis
                      </h3>
                      {project.completed && (
                        <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                          Completed on {new Date(project.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">pH Level</span>
                          <span className="font-medium text-emerald-600">
                            {project.planning?.soilData?.phLevel || 'N/A'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" 
                            style={{ width: `${(project.planning?.soilData?.phLevel / 14) * 100 || 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Nutrient Level</span>
                          <span className="font-medium text-amber-600">
                            {project.planning?.soilData?.nutrients || 'N/A'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600" 
                            style={{ 
                              width: project.planning?.soilData?.nutrients === 'High' ? '80%' :
                              project.planning?.soilData?.nutrients === 'Medium' ? '50%' : '30%' 
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