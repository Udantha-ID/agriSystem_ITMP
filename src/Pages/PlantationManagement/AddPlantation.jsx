import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';
import { format, addMonths } from 'date-fns';

// Plantation growth periods in months
const growthPeriods = {
  coconut: 12,
  mango: 6,
  rambutan: 8,
  pineapple: 4,
  tea: 9,
};

// Hardcoded land area options (from other members)
const landAreaOptions = [
  '1 core',
  '2 cores',
  '5 cores',
  '10 cores',
  '20 cores',
];

export default function AddPlantation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    type: '',
    landArea: '',
    startDate: '',
    harvestingDate: '',
    location: '',
    employees: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.type && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const period = growthPeriods[formData.type.toLowerCase()] || 0;
      const harvestDate = addMonths(startDate, period);
      setFormData(prev => ({
        ...prev,
        harvestingDate: format(harvestDate, 'yyyy-MM-dd')
      }));
    }
  }, [formData.type, formData.startDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Submit logic here (API call, etc.)
      console.log('Form submitted:', formData);
      navigate('/plantations');
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.projectName.trim()) errors.projectName = 'Project name is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.landArea) errors.landArea = 'Land area is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.employees || formData.employees < 1) errors.employees = 'Invalid employee count';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div>
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-3xl mx-auto mt-20">

          <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Plantation</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.projectName ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                />
                {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
              </div>

              {/* Plantation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plantation Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.type ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                >
                  <option value="">Select Type</option>
                  {Object.keys(growthPeriods).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              {/* Land Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land Area
                </label>
                <select
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.landArea ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                >
                  <option value="">Select Land Area</option>
                  {landAreaOptions.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.landArea && <p className="text-red-500 text-sm mt-1">{errors.landArea}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              {/* Harvesting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harvesting Date
                </label>
                <input
                  type="date"
                  name="harvestingDate"
                  value={formData.harvestingDate}
                  readOnly
                  className="block w-full rounded-md border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.location ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              {/* Employees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Employees
                </label>
                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  min="1"
                  className={`block w-full rounded-md border ${errors.employees ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-emerald-500 focus:ring-emerald-500`}
                />
                {errors.employees && <p className="text-red-500 text-sm mt-1">{errors.employees}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Create Plantation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}