import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  MapPinIcon,
  UserGroupIcon,
  Square3Stack3DIcon
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

function PlantationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plantations] = useState([
    {
      id: 1,
      projectname: "Project1",
      type: "Coconut",
      TotalLandArea: "2 cores",
      startdate: "2023-01-15",
      harvestingdate: "2023-01-15",
      location: "Field A",
      employee: 5,
    },
    {
      id: 2,
      projectname: "Project2",
      type: "Mango",
      TotalLandArea: "1 cores",
      startdate: "2023-03-22",
      harvestingdate: "2023-01-15",
      location: "Field B",
      employee: 3,
    },
  ]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 ml-100 mt-3">Plantation Management</h1>
              <p className="mt-2 text-gray-600 ml-101">Manage your plantation projects and activities</p>
            </div>
            <button
              onClick={() => navigate("/addplant")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-emerald-200"
            >
              <PlusIcon className="h-5 w-5 mr-2 bg-emerald-700 p-1 rounded-full" />
              New Plantation
            </button>
          </div>

          {/* Search and Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border-0 ring-1 ring-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                  placeholder="Search plantations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Plantation Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-100 ring-1 ring-gray-200">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Project Name', 'Type', 'Land Area', 'Start Date',
                      'Harvest Date', 'Location', 'Employees', 'Actions'
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plantations.map((plantation) => (
                    <tr key={plantation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plantation.projectname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {plantation.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {plantation.TotalLandArea}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {plantation.startdate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {plantation.harvestingdate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {plantation.location}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {plantation.employee}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-4">
                          <button className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {plantations.length === 0 && (
            <div className="mt-12 text-center py-12">
              <div className="text-gray-400 mb-4">
                <Square3Stack3DIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-gray-900 font-medium">No plantations found</h3>
              <p className="text-gray-500 mt-1">Create your first plantation project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantationManagement;