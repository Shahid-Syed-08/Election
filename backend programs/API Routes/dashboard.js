const express = require('express');
const { authenticateToken } = require('../auth');
const ElectionData = require('../ElectionData');
const Incident = require('../Incident');
const PollingStation = require('../PollingStation');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const electionData = await ElectionData.getDashboardStats();
        const incidentStats = await Incident.getStats();
        const pollingStats = await PollingStation.getStats();

        res.json({
            electionData,
            incidentStats,
            pollingStats,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;

