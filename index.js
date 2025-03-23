const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const EmployeeModel = require('./models/Employee')
const VoteModel = require('./models/vote') // Import the new Vote model

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://gokulprakash1109:NzNmyDtk24ESrRy7@cluster0.rlx96.mongodb.net/votingsystem")

// Pre-approved voter IDs
const validVoterIds = [
    'VID123456', 
    'VID789012', 
    'VID345678',
    'VID345679',
    'VID234567',
    'VID456789',
    'VID567890',
    'VID678901',
    'VID890123',
    'VID901234',
    'VID012345',
    'VID123457',
    'VID789013',
    'VID345680',
    'VID234568',
    'VID777777',
    'VID111111',
    'VID100000',
    'VID200000',
    'VID300000',
]; 

// List of candidates
const candidates = [
    'Candidate A',
    'Candidate B',
    'Candidate C',
    'Candidate D',
    'Amit Kumar',
    'Priya Sharma',
    'Rajesh Singh',
    'Sunita Patel'
];

app.post("/login", (req, res) => {
    const { email, password, voterId } = req.body;
    
    // Find user by email and voter ID
    EmployeeModel.findOne({ email: email, voterId: voterId })
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.json("success")
            } else {
                res.json("The password is incorrect")
            }
        } else {
            res.json("No record exists with this email and voter ID")
        }
    })
})

app.post('/register', (req, res) => {
    const { voterId } = req.body;
    
    // Check if voter ID is in the pre-approved list
    if (!validVoterIds.includes(voterId)) {
        return res.json({ error: "Invalid voter ID" });
    }
    
    // Check if voter ID is already registered
    EmployeeModel.findOne({ voterId: voterId })
    .then(existingUser => {
        if (existingUser) {
            return res.json({ error: "This voter ID is already registered" });
        }
        
        // If voter ID is valid and not yet registered, create the new user
        EmployeeModel.create(req.body)
        .then(employee => res.json(employee))
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err));
})

// Modified submit-vote endpoint in index.js
app.post('/submit-vote', (req, res) => {
    const { voterId, candidate, party, state, city } = req.body;
    
    // Validate voter ID
    if (!validVoterIds.includes(voterId)) {
        return res.json({ error: "Invalid voter ID" });
    }
    
    // Validate candidate (optional check if you want to keep a strict list)
    if (!candidates.includes(candidate)) {
        return res.json({ error: "Invalid candidate selection" });
    }
    
    // Check if user has already voted
    VoteModel.findOne({ voterId: voterId })
    .then(existingVote => {
        if (existingVote) {
            return res.json({ error: "You have already voted" });
        }
        
        // Create new vote with additional info
        VoteModel.create({ 
            voterId, 
            candidate, 
            party, 
            state, 
            city,
            timestamp: new Date() 
        })
        .then(vote => res.json({ 
            message: "Your vote has been recorded", 
            vote 
        }))
        .catch(err => res.json({ 
            error: "Error recording vote", 
            details: err 
        }))
    })
    .catch(err => res.json({ 
        error: "Error checking vote status", 
        details: err 
    }));
})

// Endpoint to get voting results
app.get('/results', (req, res) => {
    VoteModel.aggregate([
        { $group: { _id: "$candidate", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
    .then(results => {
        // Calculate total votes
        VoteModel.countDocuments()
        .then(totalVotes => {
            // Format results with percentages
            const formattedResults = results.map(result => ({
                candidate: result._id,
                votes: result.count,
                percentage: Math.round((result.count / totalVotes) * 100)
            }));
            
            res.json({
                totalVotes,
                results: formattedResults
            });
        })
    })
    .catch(err => res.json({ error: "Error retrieving results", details: err }));
})

// NEW ENDPOINT: Results by location
app.get('/results-by-location', (req, res) => {
    // First aggregate by state
    VoteModel.aggregate([
        // Group by state and city, and then by candidate
        { 
            $group: { 
                _id: { 
                    state: "$state", 
                    city: "$city", 
                    candidate: "$candidate" 
                }, 
                count: { $sum: 1 } 
            } 
        },
        // Sort within each location group to find the winner
        { $sort: { "_id.state": 1, "_id.city": 1, "count": -1 } },
        // Group again to get the top candidate for each state and city
        { 
            $group: { 
                _id: { state: "$_id.state", city: "$_id.city" }, 
                winner: { $first: "$_id.candidate" },
                votes: { $first: "$count" }
            } 
        },
        // Final sort by state and city
        { $sort: { "_id.state": 1, "_id.city": 1 } }
    ])
    .then(results => {
        // Group by state for easier rendering
        const stateResults = {};
        
        results.forEach(item => {
            const state = item._id.state;
            const city = item._id.city;
            
            if (!stateResults[state]) {
                stateResults[state] = [];
            }
            
            stateResults[state].push({
                city: city,
                winner: item.winner,
                votes: item.votes
            });
        });
        
        res.json({
            locationResults: stateResults
        });
    })
    .catch(err => res.json({ error: "Error retrieving location results", details: err }));
});

// Add check-vote-status endpoint (new endpoint)
app.get('/check-vote-status/:voterId', (req, res) => {
    const { voterId } = req.params;
    
    VoteModel.findOne({ voterId: voterId })
    .then(vote => {
        if (vote) {
            res.json({ hasVoted: true });
        } else {
            res.json({ hasVoted: false });
        }
    })
    .catch(err => res.json({ 
        error: "Error checking vote status", 
        details: err 
    }));
})

// Voter choice endpoint
app.get('/voter-choice/:voterId', (req, res) => {
    const { voterId } = req.params;
    
    VoteModel.findOne({ voterId: voterId })
    .then(vote => {
        if (vote) {
            res.json({ 
                voter: voterId,
                votedFor: vote.candidate,
                timestamp: vote.timestamp
            });
        } else {
            res.json({ message: "This voter has not cast a vote yet" });
        }
    })
    .catch(err => res.json({ error: "Error retrieving vote information", details: err }));
})

// Get all votes
app.get('/all-votes', (req, res) => {
    VoteModel.find({})
    .then(votes => {
        res.json(votes);
    })
    .catch(err => res.json({ error: "Error retrieving all votes", details: err }));
})

// Get user info with vote
app.get('/user-with-vote/:voterId', (req, res) => {
    const { voterId } = req.params;
    
    // Find user info
    EmployeeModel.findOne({ voterId: voterId })
    .then(user => {
        if (!user) {
            return res.json({ error: "User not found" });
        }
        
        // Find vote info
        VoteModel.findOne({ voterId: voterId })
        .then(vote => {
            res.json({
                user: {
                    name: user.name,
                    email: user.email,
                    voterId: user.voterId
                },
                vote: vote ? {
                    candidate: vote.candidate,
                    timestamp: vote.timestamp
                } : "No vote recorded"
            });
        })
    })
    .catch(err => res.json({ error: "Error retrieving user with vote", details: err }));
})

// Add this to your index.js server file

// Server time endpoint
app.get('/server-time', (req, res) => {
    // Current server time in IST
    const serverTime = new Date(); // This will be in the server's timezone
    
    // Create expiry time - set to 6:40 AM IST today or tomorrow if it's already past that time
    const expiryTime = new Date();
    
    // Set to 06:40:00 AM
    expiryTime.setHours(20, 10, 0, 0);
    
    // If it's already past 6:40 AM, set to tomorrow
    if (serverTime > expiryTime) {
        expiryTime.setDate(expiryTime.getDate() + 1);
    }
    
    res.json({
        serverTime: serverTime.toISOString(),
        expiryTime: expiryTime.toISOString(),
        timezone: "IST" // Informational only
    });
});

app.listen(3001, () => {
    console.log("server is running")
})