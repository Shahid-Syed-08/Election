const express = require('express');
const { authenticateToken } = require('../auth');
const Incident = require('../Incident');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const incidents = await Incident.findAll();
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const incident = await Incident.create({
            ...req.body,
            reportedBy: req.user.username
        });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create incident' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const incident = await Incident.update(req.params.id, req.body);
        res.json(incident);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update incident' });
    }
});

module.exports = router;

