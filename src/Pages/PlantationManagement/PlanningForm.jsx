// Pages/PlanningForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlantationSidebar from '../../Components/PlantationSidebar';

function PlanningForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState({
    phLevel: 7,
    texture: '',
    nutrients: '',
    quality: 'Medium'
  });

  const calculateSoilQuality = () => {
    const { phLevel, texture, nutrients } = soilData;
    let score = 0;

    // PH Level scoring
    if (phLevel >= 6 && phLevel <= 7) score += 3;
    else if (phLevel >= 5.5 && phLevel <= 7.5) score += 2;
    else score += 1;

    // Texture scoring
    if (texture === 'Sandy Loam') score += 3;
    else if (texture === 'Clay') score += 2;
    else if (texture === 'Silt') score += 2;
    else if (texture === 'Sand') score += 1;

    // Nutrient scoring
    if (nutrients === 'High') score += 3;
    else if (nutrients === 'Medium') score += 2;
    else score += 1;

    let quality = 'Low';
    if (score >= 7) quality = 'High';
    else if (score >= 4) quality = 'Medium';
    
    return quality;
  };

  useEffect(() => {
    const quality = calculateSoilQuality();
    setSoilData(prev => ({ ...prev, quality }));
  }, [soilData.phLevel, soilData.texture, soilData.nutrients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/resources');
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
              <legend className="text-lg font-semibold text-emerald-700 px-2">Soil Quality Assessment</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">pH Level</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.1"
                      value={soilData.phLevel}
                      onChange={(e) => setSoilData({ ...soilData, phLevel: e.target.value })}
                      className="w-full range accent-emerald-500"
                    />
                    <span className="text-emerald-600 font-medium">{soilData.phLevel}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Soil Texture</label>
                  <select
                    value={soilData.texture}
                    onChange={(e) => setSoilData({ ...soilData, texture: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Soil Texture</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt">Silt</option>
                    <option value="Sand">Sand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Nutrient Level</label>
                  <select
                    value={soilData.nutrients}
                    onChange={(e) => setSoilData({ ...soilData, nutrients: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Nutrient Level</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Soil Quality Result</label>
                  <input
                    type="text"
                    value={soilData.quality}
                    readOnly
                    className={`w-full p-3 rounded-lg font-medium ${
                      soilData.quality === 'High' ? 'bg-green-100 text-green-800' :
                      soilData.quality === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border-2 border-emerald-100 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-emerald-700 px-2">Fertilizer Information</legend>
              <div className="space-y-4">
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                >
                  <option value="">Select Fertilizer Type</option>
                  <option value="Organic">Organic (Natural Compost)</option>
                  <option value="Chemical">Chemical (NPK Fertilizers)</option>
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Application Schedule</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border-2 border-emerald-100 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-emerald-700 px-2">Pest Control Strategy</legend>
              <div className="space-y-4">
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                >
                  <option value="">Select Pest Control Method</option>
                  <option value="Chemical">Chemical Pesticides</option>
                  <option value="Biological">Biological Control</option>
                  <option value="Mechanical">Mechanical Traps</option>
                  <option value="Cultural">Cultural Practices</option>
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Monitoring Frequency</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Planning
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlanningForm;