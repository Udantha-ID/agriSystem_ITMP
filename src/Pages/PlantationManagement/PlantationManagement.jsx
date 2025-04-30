// frontend/src/Pages/PlantationManagement.jsx (updated)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  MapPinIcon,
  UserGroupIcon,
  Square3Stack3DIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";
import jsPDF from "jspdf";

function PlantationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plantations, setPlantations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/plantations");
        setPlantations(response.data.filter((p) => !p.completed));
      } catch (error) {
        console.error("Error fetching plantations:", error);
      }
    };
    fetchPlantations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/plantations/${id}`);
      setPlantations(plantations.filter((plantation) => plantation._id !== id));
    } catch (error) {
      console.error("Error deleting plantation:", error);
    }
  };

// frontend/src/Pages/PlantationManagement.jsx
const handleComplete = async (id) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/plantations/${id}/complete`
    );

    if (response.data?.completed) {
      // Force refresh by refetching data
      const updatedResponse = await axios.get("http://localhost:5000/plantations");
      setPlantations(updatedResponse.data.filter((p) => !p.completed));
      
      alert("Project marked as completed successfully!");
    }
  } catch (error) {
    console.error("Error completing plantation:", error);
    alert(
      `Error completing project: ${
        error.response?.data?.error || error.message
      }`
    );
  }
};

  const generateReport = (plantation) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const mainColor = "#047857";
      const secondaryColor = "#064e3b";

      // Add Cover Page
      doc.setFillColor(232, 253, 245);
      doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

      // Header
      doc.setFontSize(28);
      doc.setTextColor(mainColor);
      doc.setFont("helvetica", "bold");
      doc.text("Green Plantations Co.", pageWidth / 2, 40, { align: "center" });

      // Project Title
      doc.setFontSize(22);
      doc.text(`${plantation.projectName} Report`, pageWidth / 2, 60, {
        align: "center",
      });

      // Report Details
      doc.setFontSize(12);
      doc.setTextColor(secondaryColor);
      doc.text(
        `Report Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        170,
        { align: "center" }
      );

      // Add Content Page
      doc.addPage();

      // Content Styling
      const margin = 20;
      let yPos = margin;

      // Section Header Function
      const addSectionHeader = (text, y) => {
        doc.setFillColor(209, 250, 229);
        doc.rect(margin - 5, y - 5, 50, 10, "F");
        doc.setFontSize(14);
        doc.setTextColor(secondaryColor);
        doc.text(text, margin, y);
        return y + 10;
      };

      // Key Value Pair Function
      const addKeyValue = (key, value, y) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(secondaryColor);
        doc.text(`${key}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40);
        doc.text(value, margin + 40, y);
        return y + 8;
      };

      // Project Overview
      yPos = addSectionHeader("Project Overview", yPos);
      yPos += 5;

      const overviewData = [
        ["Project Type", plantation.type || "N/A"],
        ["Land Area", `${plantation.landArea || 0} acres`],
        [
          "Start Date",
          new Date(plantation.startDate).toLocaleDateString() || "N/A",
        ],
        [
          "Harvest Date",
          new Date(plantation.harvestingDate).toLocaleDateString() || "N/A",
        ],
        ["Location", plantation.location || "N/A"],
        ["Employees", plantation.employees?.toString() || "0"],
      ];

      overviewData.forEach(([key, value]) => {
        yPos = addKeyValue(key, value, yPos);
      });

      // Progress Section
      yPos += 10;
      yPos = addSectionHeader("Project Progress", yPos);
      yPos += 5;

      // Progress Bar
      const progress = 65; // Replace with real data
      doc.setFillColor(209, 250, 229);
      doc.rect(margin, yPos, 100, 8, "F");
      doc.setFillColor(mainColor);
      doc.rect(margin, yPos, progress, 8, "F");
      doc.setFontSize(10);
      doc.setTextColor(mainColor);
      doc.text(`${progress}% Completed`, margin + 105, yPos + 6);
      yPos += 15;

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        "© 2024 Green Plantations Co. - Confidential Report",
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      // Save PDF
      doc.save(
        `${plantation.projectName}_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Plantation Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your plantation projects and activities
              </p>
            </div>
            <button
              onClick={() => navigate("/addplantation")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-emerald-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Plantation
            </button>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Search and Table */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border-0 ring-1 ring-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                  placeholder="Search plantations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 ring-1 ring-gray-200">
              <table className="w-full divide-y divide-gray-200">
                {/* Table Head */}
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Project Name",
                      "Type",
                      "Land Area",
                      "Start Date",
                      "Harvest Date",
                      "Location",
                      "Employees",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {plantations
                    .filter((plantation) =>
                      plantation.projectName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((plantation) => (
                      <tr
                        key={plantation._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Table Cells */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {plantation.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium text-center">
                            {plantation.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          {plantation.landArea} acres
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          {new Date(plantation.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          {new Date(
                            plantation.harvestingDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 ">
                          <div className="flex items-center justify-center">
                            <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {plantation.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center justify-center">
                            <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {plantation.employees}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              onClick={() =>
                                navigate(`/updateplantation/${plantation._id}`)
                              }
                              className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50"
                              title="Update Plantation"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(plantation._id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                              title="Delete Plantation"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleComplete(plantation._id)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                              title="Mark as completed"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => generateReport(plantation)}
                              className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50"
                              title="Download Report"
                            >
                              <DocumentArrowDownIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantationManagement;
