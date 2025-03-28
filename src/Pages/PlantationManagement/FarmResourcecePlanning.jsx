// Pages/FarmResourcePlanning.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';

function FarmResourcePlanning() {
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Project 1',
      planning: {
        soilQuality: 'High',
        harvestingSchedule: '2023-09-15',
        fertilizerType: 'Organic',
        pestControl: 'Biological'
      }
    },
    { 
      id: 2, 
      name: 'Project 2',
      planning: null 
    }
  ]);

  const navigate = useNavigate();

  const reminders = [
    { id: 1, title: 'Fertilization Schedule', date: '2023-08-15', status: 'pending' },
    { id: 2, title: 'Pest Control Check', date: '2023-08-20', status: 'completed' },
  ];

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 ml-100 mt-15">Farm Resource Planning</h1>
            <div className="h-1 w-70 bg-green-500 rounded-full ml-106 mb-15"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Projects Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-50 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 p-3 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Agricultural Projects</h2>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="group relative p-4 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{project.name}</h3>
                        {project.planning ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Soil: {project.planning.soilQuality}
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                              {project.planning.harvestingSchedule}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                              </svg>
                              {project.planning.fertilizerType}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              {project.planning.pestControl}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No planning created yet</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {project.planning ? (
                          <>
                            <button
                              onClick={() => navigate(`/planning/${project.id}`)}
                              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => navigate(`/planning/${project.id}`)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Plan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-50 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 p-3 rounded-lg mr-3">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Agricultural Calendar</h2>
              </div>
              
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">{reminder.title}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="font-medium">{reminder.date}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reminder.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 border-t border-gray-100 pt-4">
                <button className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors">
                  <span className="mr-2">View All Reminders</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmResourcePlanning;