// Pages/MonitoringReports.jsx
import { ChartBarIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';

const projects = [
  {
    id: 1,
    name: "Project 1",
    yield: "1,240 kg/ha",
    soil: { pH: 6.5, nitrogen: "Medium" },
    status: "active"
  },
  {
    id: 2,
    name: "Project 2",
    yield: "890 kg/ha", 
    soil: { pH: 5.8, nitrogen: "Low" },
    status: "monitoring"
  },
];

export default function MonitoringReports() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar/>
      <div className="md:pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 ml-120 mt-10">Project Monitoring</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select className="bg-white pl-5 pr-3 py-2 rounded-lg shadow border border-gray-200 text-gray-600">
                  <option>All Projects</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
                
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-8">
            {projects.map(project => (
              <div key={project.id} className="space-y-6">
                {/* Project Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>

                {/* Original Cards Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Yield Prediction Card */}
                  <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">📈 Yield Prediction</h3>
                      <ChartBarIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="h-48 bg-indigo-50 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">{project.yield}</span>
                      <span className="text-gray-500 mt-2">Estimated Harvest</span>
                    </div>
                  </div>

                  {/* Soil Quality Card */}
                  <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">🌱 Soil Quality</h3>
                      <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>pH Level</span>
                          <span className="text-emerald-600">{project.soil.pH} (Optimal)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" 
                            style={{ width: `${(project.soil.pH / 7) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Nitrogen Content</span>
                          <span className="text-amber-600">{project.soil.nitrogen}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600" 
                            style={{ 
                              width: project.soil.nitrogen === 'High' ? '80%' :
                              project.soil.nitrogen === 'Medium' ? '50%' : '30%' 
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
}