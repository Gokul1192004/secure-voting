import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotingTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch server time and calculate remaining time
    const fetchServerTimeAndSetTimer = async () => {
      try {
        // Get server time and target expiry time from the server
        const response = await axios.get('http://localhost:3001/server-time');
        const { serverTime, expiryTime } = response.data;
        
        // Parse times as Date objects
        const currentTime = new Date(serverTime);
        const targetTime = new Date(expiryTime);
        
        // Calculate remaining time in seconds
        const remainingMs = targetTime - currentTime;
        
        if (remainingMs <= 0) {
          // Timer already expired
          setIsExpired(true);
          setTimeRemaining(0);
          localStorage.setItem('votingTimerExpired', 'true');
        } else {
          // Set the remaining time in seconds
          setTimeRemaining(Math.floor(remainingMs / 1000));
          localStorage.setItem('votingTimerExpired', 'false');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching server time:', error);
        // Fallback to client time if server request fails
        setLoading(false);
      }
    };

    // Initial fetch
    fetchServerTimeAndSetTimer();
    
    // Set up interval to update the timer
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          localStorage.setItem('votingTimerExpired', 'true');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // For urgency visual cue - change color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining < 300) { // Less than 5 minutes
      return 'bg-red-600';
    } else if (timeRemaining < 1800) { // Less than 30 minutes
      return 'bg-yellow-600';
    } else {
      return 'bg-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-800 to-gray-700 text-white py-3 px-4 text-center shadow-lg z-50">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          <span className="font-medium">Loading timer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 right-0 ${isExpired ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-gray-800 to-gray-700'} text-white py-3 px-4 text-center shadow-lg z-50`}>
      {isExpired ? (
        <div className="flex justify-center items-center">
          <svg className="w-5 h-5 mr-2 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold">Voting period has ended</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <span className="font-medium mr-3 mb-2 sm:mb-0">Time remaining:</span>
          <div className="flex">
            <div className={`${getTimerColor()} rounded px-4 py-1.5 font-mono font-bold text-white shadow-inner`}>
              {formatTime()}
            </div>
            <div className="ml-2 flex items-center">
              <div className={`h-2 w-2 rounded-full ${timeRemaining % 2 === 0 ? 'bg-white opacity-100' : 'bg-white opacity-0'} transition-opacity duration-500`}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingTimer;