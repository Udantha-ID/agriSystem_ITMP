import React, { useEffect, useState } from "react";
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAmericasIcon,
  CalendarIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import PlantationSidebar from "../../Components/PlantationSidebar";

function PlantationDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with your actual values
  const API_KEY = "b175e63c05272021fa03cc78a66716f9";
  const LAT = "6.9498";
  const LON = "79.9969";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("Weather data unavailable");
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
    <div className="flex">
      <PlantationSidebar />
      <div className="ml-60 p-8 min-h-screen w-full bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 ml-100 mt-10 mb-10">
              Dashboard Overview
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Plantations",
                value: "142",
                icon: GlobeAmericasIcon,
                color: "emerald",
              },
              {
                title: "Growth Rate",
                value: "18.2%",
                icon: ArrowTrendingUpIcon,
                color: "blue",
              },
              {
                title: "Active Workers",
                value: "45",
                icon: UserGroupIcon,
                color: "amber",
              },
              {
                title: "Yield Projection",
                value: "82T",
                icon: CalendarIcon,
                color: "purple",
              },
            ].map((card, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-${card.color}-500 group`}
              >
                <h3 className="text-gray-500 text-sm mb-2 font-semibold">
                  {card.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-800">
                    {card.value}
                  </span>
                  <div
                    className={`p-3 rounded-lg bg-${card.color}-100 group-hover:bg-${card.color}-200 transition-colors`}
                  >
                    <card.icon className={`h-8 w-8 text-${card.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Climate Section (Unchanged) */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
              Live Climate Monitoring
            </h2>

            {loading ? (
              <div className="text-center py-4 text-gray-500 animate-pulse">
                Fetching real-time data...
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Temperature Card */}
                <div className="group relative bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-4 right-4 bg-amber-100 p-3 rounded-lg">
                    <SunIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Temperature
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                  <div className="mt-2 text-sm text-amber-600">
                    Feels like {Math.round(weatherData.main.feels_like)}°C
                  </div>
                </div>

                {/* Humidity Card */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-4 right-4 bg-blue-100 p-3 rounded-lg">
                    <BeakerIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Humidity
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {weatherData.main.humidity}%
                  </p>
                  <div className="mt-2 text-sm text-blue-600">
                    Dew point: {Math.round(weatherData.main.dew_point)}°C
                  </div>
                </div>

                {/* Conditions Card */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-4 right-4 bg-purple-100 p-3 rounded-lg">
                    <CloudIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Conditions
                  </h3>
                  <p className="text-xl font-bold text-gray-800 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                  <div className="mt-2 text-sm text-purple-600">
                    Visibility: {(weatherData.visibility / 1000).toFixed(1)}km
                  </div>
                </div>

                {/* Wind Card */}
                <div className="group relative bg-gradient-to-br from-green-50 to-white p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-4 right-4 bg-green-100 p-3 rounded-lg">
                    <WifiIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Wind Speed
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {weatherData.wind.speed} m/s
                  </p>
                  <div className="mt-2 text-sm text-green-600">
                    Direction: {weatherData.wind.deg}°
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completed Plantations Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recent Completed Plantations
              </h2>
              <button className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group flex items-center justify-between p-4 hover:bg-emerald-50 rounded-xl transition-all duration-300 cursor-pointer border-l-4 border-emerald-100 hover:border-emerald-400"
                >
                  <div>
                    <p className="font-medium text-gray-800">Project {item}</p>
                    <p className="text-sm text-gray-500">
                      Completed 2 hours ago
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-emerald-600">
                        {Math.floor(Math.random() * 40 + 60)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full group-hover:bg-emerald-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
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
