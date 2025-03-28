import React, { useEffect, useState } from 'react';
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAmericasIcon,
  CalendarIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import PlantationSidebar from '../Components/PlantationSidebar';

function PlantationDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with your actual values
  const API_KEY = 'b175e63c05272021fa03cc78a66716f9';
  const LAT = '6.9498';
  const LON = '79.9969';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Weather data unavailable');
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PlantationSidebar />
      <div className="ml-60 p-8 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500">
              <h3 className="text-gray-500 text-sm mb-2">Total Plantations</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">142</span>
                <GlobeAmericasIcon className="h-8 w-8 text-emerald-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm mb-2">Growth Rate</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">18.2%</span>
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
              <h3 className="text-gray-500 text-sm mb-2">Active Workers</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">45</span>
                <UserGroupIcon className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h3 className="text-gray-500 text-sm mb-2">Yield Projection</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">82T</span>
                <CalendarIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Climate Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Climate Monitoring</h2>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading climate data...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <SunIcon className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BeakerIcon className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="text-2xl font-bold">{weatherData.main.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CloudIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Conditions</p>
                    <p className="text-lg font-bold capitalize">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <WifiIcon className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="text-2xl font-bold">{weatherData.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
            )}
          </div>

         
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Completed Plantations</h2>
            <div className="space-y-4">
              {[1].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Project 1</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <span className="text-sm text-emerald-500 bg-emerald-100 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[2].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Project 2</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <span className="text-sm text-emerald-500 bg-emerald-100 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Project 3</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <span className="text-sm text-emerald-500 bg-emerald-100 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantationDashboard;