import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);
  
  const states = [
    'andhra-pradesh', 'bihar', 'gujarat', 'maharashtra', 'delhi', 'uttar-pradesh', 'west-bengal',
    'rajasthan', 'tamil-nadu', 'kerala', 'karnataka', 'telangana', 'madhya-pradesh', 'odisha',
    'haryana', 'punjab', 'jammu-and-kashmir', 'assam', 'chhattisgarh', 'jharkhand', 'uttarakhand',
    'himachal-pradesh', 'goa', 'nagaland', 'tripura', 'manipur', 'meghalaya', 'arunachal-pradesh',
    'sikkim'
  ];
  
  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="bg-indigo-200 h-20 w-20 rounded-full"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-indigo-200 rounded"></div>
              <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Select a State to Vote</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
            <p className="text-blue-800 text-lg">
              Welcome to the Voting Portal. Please select your state to continue with the voting process.
              Remember, after voting, your account will be locked for 12 hours.
            </p>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for a state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-lg pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStates.length > 0 ? (
              filteredStates.map((state, index) => (
                <Link
                  key={index}
                  to={`/state/${state}`}
                  className="p-6 bg-white rounded-lg border border-gray-100 hover:border-indigo-300 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1 flex items-center"
                >
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">{state.replace(/-/g, ' ').toUpperCase()}</span>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg">No states found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;