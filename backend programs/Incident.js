
const db = require('./database');

class Incident {
    static async create(incidentData) {
        return await db.create('incidents', {
            type: incidentData.type,
            priority: incidentData.priority,
            state: incidentData.state,
            district: incidentData.district,
            pollingStation: incidentData.pollingStation,
            description: incidentData.description,
            status: 'pending',
            reportedBy: incidentData.reportedBy
        });
    }

    static async findById(id) {
        return await db.findOne('incidents', { id: parseInt(id) });
    }

    static async findAll(query = {}) {
        return await db.find('incidents', query);
    }

    static async update(id, updates) {
        return await db.update('incidents', parseInt(id), updates);
    }

    static async delete(id) {
        return await db.delete('incidents', parseInt(id));
    }

    static async getStats() {
        const incidents = await this.findAll();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return {
            total: incidents.length,
            byStatus: incidents.reduce((acc, incident) => {
                acc[incident.status] = (acc[incident.status] || 0) + 1;
                return acc;
            }, {}),
            byPriority: incidents.reduce((acc, incident) => {
                acc[incident.priority] = (acc[incident.priority] || 0) + 1;
                return acc;
            }, {}),
            byType: incidents.reduce((acc, incident) => {
                acc[incident.type] = (acc[incident.type] || 0) + 1;
                return acc;
            }, {}),
            today: incidents.filter(i => new Date(i.createdAt) >= today).length,
            resolvedToday: incidents.filter(i => 
                i.status === 'resolved' && new Date(i.updatedAt) >= today
            ).length
        };
    }

    static async getRecent(limit = 10) {
        const incidents = await this.findAll();
        return incidents
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }

    static async getByState(state) {
        return await this.findAll({ state });
    }
}

module.exports = Incident;
