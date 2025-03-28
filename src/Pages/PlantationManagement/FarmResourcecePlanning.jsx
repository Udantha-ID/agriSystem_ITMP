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

  const updateProjectPlanning = (projectId, newPlanning) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, planning: newPlanning } : project
    ));
  };

  return (
    <div>
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Farm Resource Planning</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Projects Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">🌱 Resource Planning</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      {project.planning && (
                        <div className="text-sm text-gray-500 mt-2">
                          <p>Soil: {project.planning.soilQuality}</p>
                          <p>Harvest: {project.planning.harvestingSchedule}</p>
                          <p>Fertilizer: {project.planning.fertilizerType}</p>
                          <p>Pest: {project.planning.pestControl}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.planning ? (
                        <>
                          <button
                            onClick={() => navigate(`/planning/${project.id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/planning/${project.id}`)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Planning
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">⏰ Upcoming Reminders</h2>
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {reminder.date}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${reminder.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {reminder.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmResourcePlanning;