const mongoose = require('mongoose');

const GuestSessionSchema = new mongoose.Schema({
    playerId: { type: String, required: true, unique: true },
    session: {
        activeRoomId: { type: String, default: null },
        activeTeamKey: { type: String, default: null },
        lastRoomId: { type: String, default: null },
        lastPass: { type: String, default: null },
        playerName: { type: String, default: null },
        teamKeys: { type: Map, of: String, default: {} }
    },
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now }
});

// Auto-delete guest session after 30 days of inactivity
GuestSessionSchema.index({ "lastActivity": 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('GuestSession', GuestSessionSchema);
