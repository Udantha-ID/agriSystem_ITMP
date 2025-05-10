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
  CalendarIcon,
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
      `http://localhost:5000/plantations/${id}/complete`,
      { completedDate: new Date().toISOString() }
    );

    if (response.data?.completed) {
      // Remove the completed project from the current view
      setPlantations(plantations.filter((p) => p._id !== id));
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
      const pageHeight = doc.internal.pageSize.getHeight();
      const mainColor = "#047857";
      const secondaryColor = "#064e3b";
      const accentColor = "#059669";

      // Add Cover Page
      doc.setFillColor(232, 253, 245);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Decorative Elements
      doc.setFillColor(209, 250, 229);
      doc.rect(0, 0, pageWidth, 60, "F");
      doc.setFillColor(236, 253, 245);
      doc.rect(0, pageHeight - 40, pageWidth, 40, "F");

      // Logo/Header
      doc.setFontSize(32);
      doc.setTextColor(mainColor);
      doc.setFont("helvetica", "bold");
      doc.text("GREENSOIL", pageWidth / 2, 40, { align: "center" });

      // Project Title
      doc.setFontSize(24);
      doc.text(`${plantation.projectName} Report`, pageWidth / 2, 80, {
        align: "center",
      });

      // Project Details Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(20, 100, pageWidth - 40, 60, 3, 3, "F");
      doc.setDrawColor(209, 250, 229);
      doc.roundedRect(20, 100, pageWidth - 40, 60, 3, 3, "D");

      // Project Details Content
      doc.setFontSize(12);
      doc.setTextColor(secondaryColor);
      const details = [
        ["Location", plantation.location],
        ["Type", plantation.type],
        ["Land Area", `${plantation.landArea} acres`],
        ["Employees", plantation.employees.toString()],
        ["Start Date", new Date(plantation.startDate).toLocaleDateString()],
        ["Harvest Date", new Date(plantation.harvestingDate).toLocaleDateString()],
      ];

      let x = 30;
      let y = 115;
      details.forEach(([key, value], index) => {
        if (index % 2 === 0 && index !== 0) {
          y += 15;
          x = 30;
        }
        doc.setFont("helvetica", "bold");
        doc.text(`${key}:`, x, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, x + 40, y);
        x += 90;
      });

      // Report Details
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Report Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        180,
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
        doc.roundedRect(margin - 5, y - 5, pageWidth - (margin * 2) + 10, 15, 3, 3, "F");
        doc.setFontSize(16);
        doc.setTextColor(secondaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(text, margin, y);
        return y + 15;
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
        ["Start Date", new Date(plantation.startDate).toLocaleDateString() || "N/A"],
        ["Harvest Date", new Date(plantation.harvestingDate).toLocaleDateString() || "N/A"],
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
      doc.roundedRect(margin, yPos, 100, 8, 3, 3, "F");
      doc.setFillColor(mainColor);
      doc.roundedRect(margin, yPos, progress, 8, 3, 3, "F");
      doc.setFontSize(10);
      doc.setTextColor(mainColor);
      doc.text(`${progress}% Completed`, margin + 105, yPos + 6);
      yPos += 20;

      // Planning Details Section
      if (plantation.planning) {
        yPos = addSectionHeader("Planning Details", yPos);
        yPos += 5;

        // Soil Quality
        yPos = addKeyValue("Soil Quality", plantation.planning.soilData?.quality || "N/A", yPos);

        // Fertilizer Schedules
        if (plantation.planning.fertilizerSchedules?.length > 0) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(secondaryColor);
          doc.text("Fertilizer Schedules:", margin, yPos);
          yPos += 5;

          plantation.planning.fertilizerSchedules.forEach((schedule, index) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40);
            doc.text(
              `${index + 1}. ${schedule.type} - ${schedule.method} (${new Date(schedule.date).toLocaleDateString()})`,
              margin + 5,
              yPos
            );
            yPos += 7;
          });
        }

        // Pest Controls
        if (plantation.planning.pestControls?.length > 0) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(secondaryColor);
          doc.text("Pest Controls:", margin, yPos);
          yPos += 5;

          plantation.planning.pestControls.forEach((control, index) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40);
            doc.text(
              `${index + 1}. ${control.method} - ${control.product} (${new Date(control.date).toLocaleDateString()})`,
              margin + 5,
              yPos
            );
            yPos += 7;
          });
        }
      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        "© 2024 GREENSOIL. - Confidential Report",
        pageWidth / 2,
        pageHeight - 10,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
      <PlantationSidebar />
      <div className="md:pl-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Decorative Elements */}
          <div className="relative mb-12">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                    Plantation Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your plantation projects and activities
                  </p>
                </div>
                <button
                  onClick={() => navigate("/addplant")}
                  className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center shadow-lg hover:shadow-emerald-200 hover:scale-105"
                >
                  <PlusIcon className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Plantation
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Search Section */}
            <div className="mb-8">
              <div className="relative max-w-md group">
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 border-0 ring-1 ring-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                  placeholder="Search plantations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-emerald-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-xl border border-gray-100 ring-1 ring-gray-200">
              <table className="w-full divide-y divide-gray-200">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {[
                      { label: "Project Name", width: "w-1/4" },
                      { label: "Type", width: "w-1/6" },
                      { label: "Land Area", width: "w-1/6" },
                      { label: "Start Date", width: "w-1/6" },
                      { label: "Harvest Date", width: "w-1/6" },
                      { label: "Location", width: "w-1/4" },
                      { label: "Employees", width: "w-1/6" },
                      { label: "Actions", width: "w-1/6" },
                    ].map((header) => (
                      <th
                        key={header.label}
                        className={`${header.width} px-6 py-3 text-left`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {header.label}
                          </span>
                          <div className="h-3 w-px bg-gray-200"></div>
                        </div>
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
                        className="hover:bg-gray-50/50 transition-colors duration-200"
                      >
                        {/* Project Name */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center shadow-sm">
                              <Square3Stack3DIcon className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {plantation.projectName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-xs font-medium shadow-sm">
                            {plantation.type}
                          </span>
                        </td>

                        {/* Land Area */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{plantation.landArea}</span>
                            <span className="ml-1 text-xs text-gray-500">acres</span>
                          </div>
                        </td>

                        {/* Start Date */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(plantation.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Harvest Date */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(plantation.harvestingDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {plantation.location}
                            </span>
                          </div>
                        </td>

                        {/* Employees */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {plantation.employees}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-start space-x-1.5">
                            <button
                              onClick={() =>
                                navigate(`/updateplant/${plantation._id}`)
                              }
                              className="text-emerald-600 hover:text-emerald-800 p-1 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                              title="Update Plantation"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(plantation._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                              title="Delete Plantation"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleComplete(plantation._id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              title="Mark as completed"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => generateReport(plantation)}
                              className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 transition-all duration-200"
                              title="Download Report"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Empty State */}
              {plantations.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 mb-4 shadow-lg">
                    <Square3Stack3DIcon className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No plantations found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Get started by creating a new plantation project to manage your agricultural activities
                  </p>
                  <button
                    onClick={() => navigate("/addplantation")}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 hover:scale-105"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Plantation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantationManagement;
