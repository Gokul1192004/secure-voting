import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VotingTimer from '../components/VotingTimer';

const IndexPage = () => {
  const [isVotingExpired, setIsVotingExpired] = useState(false);
  
  useEffect(() => {
    const checkExpiry = () => {
      const expired = localStorage.getItem('votingTimerExpired') === 'true';
      setIsVotingExpired(expired);
    };
    
    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 w-full max-w-md">
        <VotingTimer />
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mt-16">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-6">
            Smarter Voting System
          </h1>
          
          <div className="space-y-6">
            <p className="text-center text-gray-600 font-medium">
              {isVotingExpired 
                ? "Voting period has ended. You can only view results." 
                : "Please choose an option:"}
            </p>
            
            <div className="flex flex-col space-y-4">
              {isVotingExpired ? (
                <button 
                  className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gray-400 cursor-not-allowed transition-all duration-300"
                  disabled
                >
                  Register (Voting Closed)
                </button>
              ) : (
                <Link to="/register" className="w-full">
                  <button className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300">
                    Register
                  </button>
                </Link>
              )}
              
              {isVotingExpired ? (
                <button 
                  className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gray-400 cursor-not-allowed transition-all duration-300"
                  disabled
                >
                  Login (Voting Closed)
                </button>
              ) : (
                <Link to="/login" className="w-full">
                  <button className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-300">
                    Login
                  </button>
                </Link>
              )}
              
              <Link to="/results" className="w-full">
                <button className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-300">
                  Results
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="py-4 px-8 bg-indigo-50 border-t border-indigo-100">
          <p className="text-center text-sm text-indigo-700">
            Secure • Transparent • Reliable
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;