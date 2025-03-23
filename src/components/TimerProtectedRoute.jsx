import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import VotingTimer from './VotingTimer';

// This component wraps protected routes (login/register) and redirects if voting period is over
const TimerProtectedRoute = ({ children }) => {
  const [isVotingExpired, setIsVotingExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if timer is expired
    const storedExpiry = localStorage.getItem('votingTimerExpiry');
    
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      const now = Date.now();
      
      setIsVotingExpired(now >= expiryTime);
    } else {
      // If no timer exists, set a default one (should not happen if IndexPage loaded first)
      const defaultExpiryTime = Date.now() + (30 * 60 * 1000); // 30 minutes
      localStorage.setItem('votingTimerExpiry', defaultExpiryTime.toString());
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If voting period is expired, redirect to homepage
  if (isVotingExpired) {
    // Custom styled alert instead of the default browser alert
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Voting Period Ended</h2>
          <p className="text-gray-600 text-center mb-6">The voting period has ended. You can only view results now.</p>
          <div className="flex justify-center">
            <a 
              href="/"
              className="inline-block bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Go to Results
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise, render the protected route with the timer at the top
  return (
    <>
      <VotingTimer />
      {children}
    </>
  );
};

export default TimerProtectedRoute;