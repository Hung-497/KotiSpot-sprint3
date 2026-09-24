const mongoose = require('mongoose');

const authCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    codeHash: {
        type: String,
        required: true,
    },

    attempts: {
        type: Number,
        default: 0,
        min: 0,
    },
    requestCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    requestWindowStartedAt: {
        type: Date,
        default: null,
    },
    lastSentAt: {
        type: Date,
        default: null,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

authCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AuthCode', authCodeSchema);