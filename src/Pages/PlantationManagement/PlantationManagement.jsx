// Pages/PlantationManagement.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
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
    <div>
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Plantation Management
            </h1>
            <button
              onClick={() => navigate("/addplant")}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Plantation
            </button>
          </div>

          <div className="mb-6">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Search plantations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Land Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Starting Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Harvesting Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plantations.map((plantation) => (
                  <tr key={plantation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.projectname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.TotalLandArea}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.startdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.harvestingdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plantation.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-emerald-600 hover:text-emerald-900 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 mr-4">
                        Delete
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-900">
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantationManagement;
