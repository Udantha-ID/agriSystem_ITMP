// Pages/PlanningForm.jsx
import { useNavigate, useParams } from 'react-router-dom';
import PlantationSidebar from '../../Components/PlantationSidebar';

function PlanningForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would update state here
    navigate('/resources');
  };

  return (
    <div>
      <PlantationSidebar/>
    <div className="p-6 md:pl-64">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Project Planning</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Soil Quality</label>
            <select
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Soil Quality</option>
              <option value="High">Good</option>
              <option value="Medium">Medium</option>
              <option value="Low">Bad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Harvesting Schedule</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fertilizer Type</label>
            <select
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Fertilizer Type</option>
              <option value="Organic">Organic</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pest Control</label>
            <select
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Pest Control</option>
              <option value="Chemical">Chemical</option>
              <option value="Biological">Biological</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Save Planning
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default PlanningForm;