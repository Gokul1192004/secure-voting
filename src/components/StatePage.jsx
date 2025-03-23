import React from 'react';
import { useParams, Link } from 'react-router-dom';

const citiesData = {
  'andhra-pradesh': ['visakhapatnam', 'vijayawada', 'tirupati', 'rajahmundry', 'kakinada'],
  'bihar': ['patna', 'gaya', 'bhagalpur', 'munger', 'muzaffarpur'],
  'gujarat': ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar'],
  'maharashtra': ['mumbai', 'pune', 'nagpur', 'aurangabad', 'nashik'],
  'delhi': ['new-delhi', 'old-delhi', 'dwarka', 'vasant-vihar', 'karol-bagh'],
  'uttar-pradesh': ['lucknow', 'varanasi', 'kanpur', 'agra', 'allahabad'],
  'west-bengal': ['kolkata', 'darjeeling', 'siliguri', 'asansol', 'howrah'],
  'rajasthan': ['jaipur', 'udaipur', 'jodhpur', 'ajmer', 'kota'],
  'tamil-nadu': ['chennai', 'coimbatore', 'madurai', 'trichy', 'salem'],
  'kerala': ['thiruvananthapuram', 'kochi', 'kozhikode', 'thrissur', 'palakkad'],
  'karnataka': ['bengaluru', 'mysuru', 'hubli', 'mangaluru', 'belgaum']
};

// Helper function to format location names
const formatName = (name) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const StatePage = () => {
  const { stateName } = useParams();
  const cities = citiesData[stateName] || [];
  const formattedStateName = formatName(stateName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {formattedStateName}
              </h1>
              <p className="text-gray-500 mt-1">Select a city to view detailed information</p>
            </div>
          </div>
          
          {cities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city, index) => (
                <Link
                  key={index}
                  to={`/state/${stateName}/city/${city}`}
                  className="group"
                >
                  <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-50 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-4">
                        {formatName(city).charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{formatName(city)}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">No cities found for this state.</p>
              <p className="text-gray-400 mt-2">Please select a different state.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <Link 
            to="/home" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to States
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatePage;