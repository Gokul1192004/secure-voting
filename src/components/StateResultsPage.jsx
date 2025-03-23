import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StateResultsPage = () => {
  const [stateResults, setStateResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    // Fetch state-wise results from the backend
    setLoading(true);
    axios.get('http://localhost:3001/results-by-state')
      .then(response => {
        setLoading(false);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setStateResults(response.data.stateResults || []);
          setTotalVotes(response.data.totalVotes || 0);
          
          // Initialize all states as collapsed
          const initialExpandedStates = {};
          response.data.stateResults.forEach(state => {
            initialExpandedStates[state.state] = false;
          });
          setExpandedStates(initialExpandedStates);
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Failed to load state-wise results. Please try again later.');
        console.error('Error fetching results:', err);
      });
  }, []);

  const getBarWidth = (percentage) => {
    return `${percentage}%`;
  };

  const toggleStateExpand = (stateName) => {
    setExpandedStates(prev => ({
      ...prev,
      [stateName]: !prev[stateName]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Loading State Results</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Unable to Load Results</h2>
          <p className="text-red-600 text-center mb-6 px-4">{error}</p>
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 md:mb-0">
              <span className="text-blue-600">Election</span> Results by State
            </h1>
            <div className="bg-blue-50 py-2 px-4 rounded-lg border border-blue-100">
              <p className="text-gray-700">
                Total Votes: <span className="font-bold text-blue-700">{totalVotes.toLocaleString()}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mb-2">
            <Link
              to="/results"
              className="inline-block bg-white text-blue-600 border border-blue-200 py-2.5 px-5 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center shadow-sm"
            >
              View Overall Results
            </Link>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center shadow-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {stateResults.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No votes have been cast yet</p>
            <p className="text-gray-400">Check back after the voting has begun</p>
          </div>
        ) : (
          <div className="space-y-6">
            {stateResults.map((stateResult, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                <div 
                  className="bg-gradient-to-r from-blue-50 to-white p-5 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleStateExpand(stateResult.state)}
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{stateResult.state || "Unknown State"}</h2>
                    <p className="text-gray-600 mt-1">
                      Total Votes: <span className="font-semibold">{stateResult.totalVotes.toLocaleString()}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-4 rounded-lg mr-4 border border-blue-100 shadow-sm">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Winner</p>
                        <p className="font-bold text-blue-800 text-lg">{stateResult.winner?.name || "No votes"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stateResult.winner ? `${stateResult.winner.percentage}% (${stateResult.winner.votes.toLocaleString()})` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 hover:bg-gray-200">
                      <svg 
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedStates[stateResult.state] ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {expandedStates[stateResult.state] && (
                  <div className="p-5 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Candidate Results</h3>
                    <div className="space-y-5">
                      {stateResult.candidates.map((candidate, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <div className="flex items-center mb-2 sm:mb-0">
                              {idx === 0 && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1.5 rounded-full mr-2 font-medium border border-yellow-200">
                                  Winner
                                </span>
                              )}
                              <span className="font-semibold text-gray-800">{candidate.name}</span>
                            </div>
                            <span className="text-gray-600 text-sm">{candidate.votes.toLocaleString()} votes ({candidate.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-5 mt-1 overflow-hidden">
                            <div 
                              className={`h-5 rounded-full ${idx === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-300'}`}
                              style={{ width: getBarWidth(candidate.percentage) }}
                            >
                              {candidate.percentage > 10 && (
                                <span className="text-xs text-white ml-2 inline-block mt-0.5 font-medium">{candidate.percentage}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StateResultsPage;