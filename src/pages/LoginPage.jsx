import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [voterId, setVoterId] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        
        axios.post('http://localhost:3001/login', { email, password, voterId })
        .then(result => {
            console.log(result);
            if (result.data === "success") {
                localStorage.setItem('voterId', voterId);
                
                axios.get(`http://localhost:3001/check-vote-status/${voterId}`)
                .then(voteResult => {
                    if (voteResult.data.hasVoted) {
                        const candidate = voteResult.data.candidate;
                        navigate('/dashboard', { 
                            state: { 
                                voteData: {
                                    candidateName: candidate,
                                    candidateParty: "Retrieved from database",
                                    state: "Retrieved from database",
                                    city: "Retrieved from database",
                                    timestamp: new Date().toISOString()
                                } 
                            } 
                        });
                    } else {
                        navigate('/home');
                    }
                })
                .catch(err => {
                    console.log(err);
                    navigate('/home');
                });
            } else {
                setMessage(result.data);
            }
        })
        .catch(err => {
            console.log(err);
            setMessage("An error occurred. Please try again.");
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Login to Vote</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="voterId" className="block text-sm font-medium text-gray-700">
                                Voter ID
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your Voter ID"
                                autoComplete="off"
                                name="voterId"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                onChange={(e) => setVoterId(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="off"
                                name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {message && (
                            <div className="py-2 px-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {message}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Login
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-2">Don't have an account?</p>
                        <Link 
                            to="/register" 
                            className="block w-full py-3 px-6 rounded-lg font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 border border-indigo-200"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;