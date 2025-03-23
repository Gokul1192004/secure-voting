const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
    voterId: {
        type: String,
        required: true,
        unique: true
    },
    candidate: {
        type: String,
        required: true
    },
    party: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const VoteModel = mongoose.model("votes", VoteSchema)
module.exports = VoteModel