import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [voteData, setVoteData] = useState(location.state?.voteData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown

  useEffect(() => {
    const voterId = localStorage.getItem('voterId');
    if (!voterId) {
      navigate('/login');
      return;
    }

    // If we don't have vote data from navigation state, fetch from API
    if (!voteData) {
      axios.get(`http://localhost:3001/user-with-vote/${voterId}`)
        .then(response => {
          setLoading(false);
          if (response.data.vote && response.data.vote !== "No vote recorded") {
            // Format the vote data for display
            setVoteData({
              candidateName: response.data.vote.candidate,
              candidateParty: "Retrieved", // You may need additional API to get party info
              state: "Retrieved", // You may need additional API to get location info
              city: "Retrieved",
              timestamp: response.data.vote.timestamp
            });
          } else {
            // If no vote found, redirect to home
            navigate('/home');
          }
        })
        .catch(err => {
          setLoading(false);
          setError('Failed to load voting data');
          console.error('Error fetching vote history:', err);
        });
    } else {
      setLoading(false);
    }
  }, [navigate, voteData]);

  // Add automatic navigation after viewing dashboard
  useEffect(() => {
    // Only start countdown if vote data is loaded
    if (!loading && voteData && !error) {
      const timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            navigate('/'); // Navigate to index page
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      // Clean up interval on component unmount
      return () => clearInterval(timer);
    }
  }, [loading, voteData, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Loading Vote Data</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Error</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
          <Link
            to="/"
            className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Back to Index
          </Link>
        </div>
      </div>
    );
  }

  if (!voteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">No Vote Data</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <p className="text-gray-700">You haven't cast any vote yet.</p>
          </div>
          <Link
            to="/home"
            className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Go to Voting Page
          </Link>
        </div>
      </div>
    );
  }

  // Format timestamp if available
  const formattedTime = voteData.timestamp 
    ? new Date(voteData.timestamp).toLocaleString() 
    : 'Just now';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Your Vote Details</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Candidate Name</p>
            <p className="text-xl font-semibold text-gray-800">{voteData.candidateName}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Party</p>
            <p className="text-xl font-semibold text-gray-800">{voteData.candidateParty}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Location</p>
            <p className="text-xl font-semibold text-gray-800">
              {voteData.city}, {voteData.state}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Vote Time</p>
            <p className="text-base font-semibold text-gray-800">{formattedTime}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-green-600 font-semibold text-center">
              Your vote has been successfully recorded!
            </p>
            <p className="text-gray-500 text-center mt-2">
              Redirecting to home page in {countdown} seconds...
            </p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/home"
            className="flex items-center justify-center bg-white border border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Go to Index
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;