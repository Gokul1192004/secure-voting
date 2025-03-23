import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CityPage = () => {
  const { stateName, cityName } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define default candidates that will be used for all cities
  const defaultCandidates = [
    { name: 'Amit Kumar', party: 'BJP' },
    { name: 'Priya Sharma', party: 'INC' },
    { name: 'Rajesh Singh', party: 'Regional Party' },
    { name: 'Sunita Patel', party: 'Independent' }
  ];

  // Function to get candidates for a city
  const getCandidates = () => {
    return defaultCandidates;
  };

  const cityCandidates = getCandidates();

  // Set the first candidate as selected by default
  useEffect(() => {
    if (cityCandidates.length > 0) {
      setSelectedCandidate(0);
    }
    
    // Check if user has already voted when the component mounts
    const voterId = localStorage.getItem('voterId');
    if (voterId) {
      setLoading(true);
      axios.get(`http://localhost:3001/voter-choice/${voterId}`)
        .then(result => {
          setLoading(false);
          if (result.data.votedFor) {
            // If already voted, redirect to dashboard
            navigate('/dashboard');
          }
        })
        .catch(err => {
          setLoading(false);
          setError('Error checking vote status');
          console.error(err);
        });
    } else {
      // If no voterId, redirect to login
      navigate('/login');
    }
  }, [stateName, cityName, navigate]);

  const handleVote = () => {
    if (selectedCandidate !== null) {
      const candidate = cityCandidates[selectedCandidate];
      const voterId = localStorage.getItem('voterId');
      
      if (!voterId) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      // Submit vote to the backend
      axios.post('http://localhost:3001/submit-vote', {
        voterId: voterId,
        candidate: candidate.name,
        party: candidate.party,
        state: stateName.replace(/-/g, ' ').toUpperCase(),
        city: cityName.replace(/-/g, ' ').toUpperCase()
      })
      .then(response => {
        setLoading(false);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          // Navigate to dashboard with vote data
          const voteData = {
            candidateName: candidate.name,
            candidateParty: candidate.party,
            state: stateName.replace(/-/g, ' ').toUpperCase(),
            city: cityName.replace(/-/g, ' ').toUpperCase(),
            timestamp: new Date().toISOString()
          };
          navigate('/dashboard', { state: { voteData } });
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Error submitting vote');
        console.error(err);
      });
    } else {
      setError('Please select a candidate');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Processing your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-gradient-to-r from-blue-700 to-purple-600 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-3xl font-bold">
          Vote for Candidates
        </h1>
        <p className="text-xl mt-2">
          {cityName.replace(/-/g, ' ').toUpperCase()} ({stateName.replace(/-/g, ' ').toUpperCase()})
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-b-lg shadow-lg p-6 mb-4">
        {cityCandidates.length > 0 ? (
          <div className="space-y-4">
            {cityCandidates.map((candidate, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 ${
                  selectedCandidate === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCandidate(index)}
              >
                <input
                  type="radio"
                  id={`candidate-${index}`}
                  name="candidate"
                  value={index}
                  checked={selectedCandidate === index}
                  onChange={() => setSelectedCandidate(index)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`candidate-${index}`} className="flex-1 cursor-pointer flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-lg block">{candidate.name}</span>
                    <span className="inline-block px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                      {candidate.party}
                    </span>
                  </div>
                </label>
              </div>
            ))}
            
            <button
              onClick={handleVote}
              className="mt-8 w-full py-3 px-4 rounded-md shadow transition-colors bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
            >
              Submit Vote
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No candidates found for this city.</p>
        )}
      </div>
      
      <Link
        to={`/state/${stateName}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Cities
      </Link>
    </div>
  );
};

export default CityPage;