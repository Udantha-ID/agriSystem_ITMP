import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlantationSidebar from "../../Components/PlantationSidebar";

function PlanningForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectId,
    soilData: {
      phLevel: 7,
      texture: "",
      nutrients: "",
      quality: "Medium",
    },
    fertilizerSchedules: [],
    pestControls: [],
  });

  const calculateSoilQuality = () => {
    const { phLevel, texture, nutrients } = formData.soilData;
    let score = 0;

    if (phLevel >= 6 && phLevel <= 7) score += 3;
    else if (phLevel >= 5.5 && phLevel <= 7.5) score += 2;
    else score += 1;

    if (texture === "Sandy Loam") score += 3;
    else if (texture === "Clay") score += 2;
    else if (texture === "Silt") score += 2;
    else if (texture === "Sand") score += 1;

    if (nutrients === "High") score += 3;
    else if (nutrients === "Medium") score += 2;
    else score += 1;

    return score >= 7 ? "High" : score >= 4 ? "Medium" : "Low";
  };

  useEffect(() => {
    const quality = calculateSoilQuality();
    setFormData((prev) => ({
      ...prev,
      soilData: { ...prev.soilData, quality },
    }));
  }, [
    formData.soilData.phLevel,
    formData.soilData.texture,
    formData.soilData.nutrients,
  ]);

  const handleSoilChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      soilData: { ...prev.soilData, [field]: value },
    }));
  };

  const addFertilizerSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      fertilizerSchedules: [
        ...prev.fertilizerSchedules,
        {
          type: "",
          date: "",
          quantity: "",
          method: "Broadcast",
          reminder: false,
        },
      ],
    }));
  };

  const removeFertilizerSchedule = (index) => {
    const newSchedules = formData.fertilizerSchedules.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, fertilizerSchedules: newSchedules }));
  };

  const handleFertilizerChange = (index, field, value) => {
    const updated = formData.fertilizerSchedules.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, fertilizerSchedules: updated }));
  };

  const addPestControl = () => {
    setFormData((prev) => ({
      ...prev,
      pestControls: [
        ...prev.pestControls,
        { method: "", frequency: "", product: "", date: "", reminder: false },
      ],
    }));
  };

  const removePestControl = (index) => {
    const newControls = formData.pestControls.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, pestControls: newControls }));
  };

  const handlePestControlChange = (index, field, value) => {
    const updated = formData.pestControls.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, pestControls: updated }));
  };

  const validateForm = () => {
    const requiredSoilFields = ["texture", "nutrients"];
    const requiredFertilizerFields = ["type", "date", "quantity"];
    const requiredPestFields = ["method", "date"];

    for (const field of requiredSoilFields) {
      if (!formData.soilData[field]) return `Missing soil ${field}`;
    }

    for (const [index, schedule] of formData.fertilizerSchedules.entries()) {
      for (const field of requiredFertilizerFields) {
        if (!schedule[field])
          return `Fertilizer schedule ${index + 1} missing ${field}`;
      }
    }

    for (const [index, control] of formData.pestControls.entries()) {
      for (const field of requiredPestFields) {
        if (!control[field])
          return `Pest control ${index + 1} missing ${field}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
  
    try {
      // Validate and convert dates
      const processDates = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format: ${dateString}`);
        }
        return date.toISOString();
      };
  
      const payload = {
        ...formData,
        fertilizerSchedules: formData.fertilizerSchedules.map(schedule => ({
          ...schedule,
          date: processDates(schedule.date)
        })),
        pestControls: formData.pestControls.map(control => ({
          ...control,
          date: processDates(control.date)
        }))
      };
  
      console.log('Submitting payload:', payload); 
  
      const response = await axios.post('http://localhost:5000/plannings', payload);
      
      if (response.status === 201) {
        navigate('/resources');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <PlantationSidebar />
      <div className="p-6 md:pl-64">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <h2 className="text-3xl font-bold text-white">Project Planning</h2>
            <p className="text-emerald-100 mt-1">Project ID: {projectId}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <fieldset className="border-2 border-emerald-100 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-emerald-700 px-2">
                Soil Quality Assessment
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    pH Level
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.1"
                      value={formData.soilData.phLevel}
                      onChange={(e) =>
                        handleSoilChange("phLevel", e.target.value)
                      }
                      className="w-full range accent-emerald-500"
                    />
                    <span className="text-emerald-600 font-medium">
                      {formData.soilData.phLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Soil Texture *
                  </label>
                  <select
                    value={formData.soilData.texture}
                    onChange={(e) =>
                      handleSoilChange("texture", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select Soil Texture</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt">Silt</option>
                    <option value="Sand">Sand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Nutrient Level *
                  </label>
                  <select
                    value={formData.soilData.nutrients}
                    onChange={(e) =>
                      handleSoilChange("nutrients", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select Nutrient Level</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Soil Quality Result
                  </label>
                  <input
                    type="text"
                    value={formData.soilData.quality}
                    readOnly
                    className={`w-full p-3 rounded-lg font-medium ${
                      formData.soilData.quality === "High"
                        ? "bg-green-100 text-green-800"
                        : formData.soilData.quality === "Medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border-2 border-emerald-100 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-emerald-700 px-2">
                Fertilizer Management
              </legend>

              {formData.fertilizerSchedules.map((schedule, index) => (
                <div
                  key={index}
                  className="space-y-4 mb-6 border-b border-emerald-50 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Fertilizer Type *
                      </label>
                      <select
                        value={schedule.type}
                        onChange={(e) =>
                          handleFertilizerChange(index, "type", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Organic">Organic</option>
                        <option value="NPK">NPK</option>
                        <option value="Urea">Urea</option>
                        <option value="DAP">DAP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Application Date *
                      </label>
                      <input
                        type="date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        value={schedule.date}
                        onChange={(e) => {
                          if (!e.target.validity.valid) return;
                          handleFertilizerChange(index, "date", e.target.value);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Quantity (kg/ha) *
                      </label>
                      <input
                        type="number"
                        value={schedule.quantity}
                        onChange={(e) =>
                          handleFertilizerChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter quantity"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Application Method
                      </label>
                      <select
                        value={schedule.method}
                        onChange={(e) =>
                          handleFertilizerChange(
                            index,
                            "method",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Broadcast">Broadcast</option>
                        <option value="Foliar">Foliar Spray</option>
                        <option value="Drip">Drip Irrigation</option>
                        <option value="Soil Drench">Soil Drench</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={schedule.reminder}
                        onChange={(e) =>
                          handleFertilizerChange(
                            index,
                            "reminder",
                            e.target.checked
                          )
                        }
                        className="rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      Set Reminder 3 Days Before
                    </label>
                    {formData.fertilizerSchedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFertilizerSchedule(index)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove Schedule
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFertilizerSchedule}
                className="w-full py-2 text-emerald-500 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                + Add Fertilization Schedule
              </button>
            </fieldset>

            <fieldset className="border-2 border-emerald-100 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-emerald-700 px-2">
                Pest Control Management
              </legend>

              {formData.pestControls.map((control, index) => (
                <div
                  key={index}
                  className="space-y-4 mb-6 border-b border-emerald-50 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Control Method *
                      </label>
                      <select
                        value={control.method}
                        onChange={(e) =>
                          handlePestControlChange(
                            index,
                            "method",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Biological">Biological</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Cultural">Cultural</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={control.product}
                        onChange={(e) =>
                          handlePestControlChange(
                            index,
                            "product",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Application Date *
                      </label>
                      <input
                        type="date"
                        value={control.date}
                        onChange={(e) =>
                          handlePestControlChange(index, "date", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Re-application Frequency
                      </label>
                      <select
                        value={control.frequency}
                        onChange={(e) =>
                          handlePestControlChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select Frequency</option>
                        <option value="7">Weekly</option>
                        <option value="14">Biweekly</option>
                        <option value="30">Monthly</option>
                        <option value="0">Single Application</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={control.reminder}
                        onChange={(e) =>
                          handlePestControlChange(
                            index,
                            "reminder",
                            e.target.checked
                          )
                        }
                        className="rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      Set Reminder 2 Days Before
                    </label>
                    {formData.pestControls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePestControl(index)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove Control
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPestControl}
                className="w-full py-2 text-emerald-500 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                + Add Pest Control Strategy
              </button>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
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
