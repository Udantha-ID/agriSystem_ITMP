// Pages/MonitoringReports.jsx
import { ChartBarIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';

export default function MonitoringReports() {
  return (
    <div>
        <PlantationSidebar/>
    <div className="md:pl-64 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitoring & Reports</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Yield Prediction Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">📈 Yield Prediction</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>

          {/* Soil Quality Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">🌱 Soil Quality Report</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>pH Level</span>
                <span className="text-emerald-600">6.5 (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span>Nitrogen Content</span>
                <span className="text-yellow-600">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}