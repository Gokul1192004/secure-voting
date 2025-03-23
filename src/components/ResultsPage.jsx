import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [locationResults, setLocationResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overall');

  useEffect(() => {
    // Fetch both overall results and location results from the backend when component mounts
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3001/results'),
      axios.get('http://localhost:3001/results-by-location')
    ])
      .then(([overallResponse, locationResponse]) => {
        setLoading(false);
        if (overallResponse.data.error) {
          setError(overallResponse.data.error);
        } else {
          setResults(overallResponse.data.results || []);
          setTotalVotes(overallResponse.data.totalVotes || 0);
          
          if (locationResponse.data.locationResults) {
            setLocationResults(locationResponse.data.locationResults);
          }
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Failed to load results. Please try again later.');
        console.error('Error fetching results:', err);
      });
  }, []);

  const getBarWidth = (percentage) => {
    return `${percentage}%`;
  };

  const getBarColor = (index) => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-orange-500',
      'bg-pink-600',
      'bg-yellow-500'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Loading Results</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center mt-6 text-gray-500">Fetching the latest election data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Error</h2>
          <p className="text-red-600 text-center mb-6 font-medium">{error}</p>
          <Link
            to="/"
            className="block w-full bg-blue-500 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Election Results</h2>
            <p className="text-gray-500 mt-1">Real-time voting statistics</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-lg border border-blue-100">
            <p className="text-gray-700">
              Total Votes: <span className="font-bold text-blue-700">{totalVotes.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overall')}
              className={`py-2 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'overall'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              Overall Results
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-2 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'location'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              Results by Location
            </button>
          </div>
        </div>

        {/* Overall Results Tab */}
        {activeTab === 'overall' && (
          <>
            {results.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg">No votes have been cast yet.</p>
                <p className="text-gray-400 mt-2">Check back after voting begins.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold text-lg text-gray-800">{result.candidate}</span>
                      <span className="text-gray-600 font-medium">{result.votes.toLocaleString()} votes ({result.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className={`${getBarColor(index)} h-5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: getBarWidth(result.percentage) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Location Results Tab */}
        {activeTab === 'location' && (
          <div className="space-y-8">
            {Object.keys(locationResults).length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No location data available.</p>
                <p className="text-gray-400 mt-2">Geographic information will appear here once votes are cast.</p>
              </div>
            ) : (
              Object.entries(locationResults).map(([state, cities]) => (
                <div key={state} className="border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {state}
                  </h3>
                  <div className="space-y-3">
                    {cities.map((cityData, index) => (
                      <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{cityData.city}</span>
                        </div>
                        <div className="flex-1 text-center">
                          <span className="bg-blue-100 text-blue-800 py-1 px-4 rounded-full text-sm font-medium">
                            {cityData.winner}
                          </span>
                        </div>
                        <div className="flex-1 text-right text-gray-600 font-medium">
                          {cityData.votes.toLocaleString()} votes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-10">
          <Link
            to="/"
            className="block w-full bg-blue-500 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;