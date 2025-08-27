
const db = require('./database');

class PollingStation {
    static async findAll(query = {}) {
        return await db.find('pollingStations', query);
    }

    static async findById(id) {
        return await db.findOne('pollingStations', { id: parseInt(id) });
    }

    static async findByCode(code) {
        return await db.findOne('pollingStations', { code });
    }

    static async update(id, updates) {
        return await db.update('pollingStations', parseInt(id), updates);
    }

    static async getStats() {
        const stations = await this.findAll();
        return {
            total: stations.length,
            active: stations.filter(s => s.status === 'active').length,
            inactive: stations.filter(s => s.status === 'inactive').length,
            byState: stations.reduce((acc, station) => {
                acc[station.state] = (acc[station.state] || 0) + 1;
                return acc;
            }, {}),
            totalVoters: stations.reduce((sum, station) => sum + station.totalVoters, 0),
            currentVoters: stations.reduce((sum, station) => sum + station.currentVoters, 0),
            overallTurnout: stations.reduce((sum, station) => sum + station.currentVoters, 0) / 
                          stations.reduce((sum, station) => sum + station.totalVoters, 1) * 100
        };
    }

    static async getStateStats(state) {
        const stations = await this.findAll({ state });
        return {
            total: stations.length,
            active: stations.filter(s => s.status === 'active').length,
            totalVoters: stations.reduce((sum, station) => sum + station.totalVoters, 0),
            currentVoters: stations.reduce((sum, station) => sum + station.currentVoters, 0),
            turnout: stations.reduce((sum, station) => sum + station.currentVoters, 0) / 
                    stations.reduce((sum, station) => sum + station.totalVoters, 1) * 100
        };
    }

    static async updateVoterCount(stationId, count) {
        return await this.update(stationId, { currentVoters: count });
    }
}

module.exports = PollingStation;
