import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Dummy candidate data
const candidateNames = ['Rajesh Kumar', 'Anita Reddy', 'Chandru Naidu', 'Ravi Kumar'];
const partyNames = ['BJP', 'INC', 'YSRCP', 'RJD'];

const getRandomCandidate = () => {
  const name = candidateNames[Math.floor(Math.random() * candidateNames.length)];
  const party = partyNames[Math.floor(Math.random() * partyNames.length)];
  return { name, party };
};

const CandidatePage = () => {
  const { stateName, cityName } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate random candidates for the city (3 candidates per city)
    setLoading(true);
    const generatedCandidates = Array.from({ length: 3 }, getRandomCandidate);
    setCandidates(generatedCandidates);
    setLoading(false);
  }, [cityName]);

  const handleSubmit = () => {
    if (selectedCandidate !== null) {
      alert(`You voted for ${candidates[selectedCandidate].name} from ${candidates[selectedCandidate].party}`);
    } else {
      alert('Please select a candidate');
    }
  };

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
      
      <div className="bg-white rounded-b-lg shadow-lg p-6 mb-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 ${
                  selectedCandidate === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
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
              onClick={handleSubmit}
              disabled={selectedCandidate === null}
              className={`mt-8 w-full py-3 px-4 rounded-md shadow transition-colors text-white font-medium text-lg ${
                selectedCandidate !== null
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
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

export default CandidatePage;