import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

export default function UpdatePlantation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    projectName: "",
    type: "",
    landArea: "",
    startDate: "",
    location: "",
    employees: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchPlantation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/plantations/${id}`
        );
        const data = response.data;

        // Format numbers correctly
        setFormData({
          projectName: data.projectName,
          type: data.type,
          landArea: data.landArea.toString(),
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          location: data.location,
          employees: data.employees.toString(),
        });
        setLoading(false);
      } catch (error) {
        setFetchError(
          error.response?.data?.error || "Failed to fetch plantation data"
        );
        setLoading(false);
      }
    };

    fetchPlantation();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Convert numeric fields to proper types
        const payload = {
          ...formData,
          landArea: parseFloat(formData.landArea),
          employees: parseInt(formData.employees, 10),
          startDate: new Date(formData.startDate).toISOString(),
        };

        await axios.put(`http://localhost:5000/plantations/${id}`, payload);
        navigate("/plantationsmanage");
      } catch (error) {
        console.error("Error updating plantation:", error);
        setErrors({
          submit:
            error.response?.data?.error ||
            "Failed to update plantation. Please check your data.",
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.projectName.trim())
      errors.projectName = "Project name is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.landArea.trim()) errors.landArea = "Land area is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.employees || formData.employees < 1)
      errors.employees = "Invalid employee count";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6">
          <div className="max-w-4xl mx-auto mt-8 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plantation data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <PlantationSidebar />
        <div className="md:pl-64 p-6">
          <div className="max-w-4xl mx-auto mt-8 text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-500 text-lg">{fetchError}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-8 pb-6 border-b border-emerald-100">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-emerald-600 hover:text-emerald-700 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800 ml-40">
                Edit Plantation
              </h1>
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Name */}
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Project Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full rounded-lg border ${
                        errors.projectName
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                      placeholder="Project Greenfield"
                    />
                  </div>
                  {errors.projectName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.projectName}
                    </p>
                  )}
                </div>

                {/* Plantation Type */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Plantation Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`appearance-none pr-10 py-3 w-full rounded-lg border ${
                        errors.type ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                    >
                      <option value="">Select Plantation Type</option>
                      <option value="coconut">Coconut</option>
                      <option value="mango">Mango</option>
                      <option value="rambutan">Rambutan</option>
                      <option value="pineapple">Pineapple</option>
                      <option value="tea">Tea</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Land Area */}
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Land Area <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      name="landArea"
                      value={formData.landArea}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full rounded-lg border ${
                        errors.landArea ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                      placeholder="Enter land area (e.g., 2 cores)"
                    />
                  </div>
                  {errors.landArea && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.landArea}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Location <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full rounded-lg border ${
                        errors.location ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                      placeholder="Enter location"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Start Date <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`py-3 w-full rounded-lg border ${
                        errors.startDate ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Employees */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Employees <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      min="1"
                      className={`pl-10 pr-4 py-3 w-full rounded-lg border ${
                        errors.employees ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                      placeholder="Number of employees"
                    />
                  </div>
                  {errors.employees && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.employees}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-emerald-200"
                >
                  Update Plantation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
