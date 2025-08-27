
const db = require('./database');

class ElectionData {
    static async getNationalData() {
        const data = await db.readFile('electionData');
        return data.national;
    }

    static async getStateData() {
        const data = await db.readFile('electionData');
        return data.states;
    }

    static async getStateByName(stateName) {
        const data = await db.readFile('electionData');
        return data.states.find(state => state.name === stateName);
    }

    static async updateNationalData(updates) {
        const data = await db.readFile('electionData');
        data.national = { ...data.national, ...updates, lastUpdated: new Date().toISOString() };
        await db.writeFile('electionData', data);
        return data.national;
    }

    static async updateStateData(stateName, updates) {
        const data = await db.readFile('electionData');
        const stateIndex = data.states.findIndex(state => state.name === stateName);
        if (stateIndex === -1) return null;

        data.states[stateIndex] = { 
            ...data.states[stateIndex], 
            ...updates, 
            lastUpdated: new Date().toISOString() 
        };
        await db.writeFile('electionData', data);
        return data.states[stateIndex];
    }

    static async getDashboardStats() {
        const national = await this.getNationalData();
        const states = await this.getStateData();

        return {
            national,
            states,
            summary: {
                highestTurnout: states.reduce((max, state) => 
                    state.currentTurnout > max.currentTurnout ? state : max, states[0]),
                lowestTurnout: states.reduce((min, state) => 
                    state.currentTurnout < min.currentTurnout ? state : min, states[0]),
                mostIncidents: states.reduce((max, state) => 
                    state.incidents > max.incidents ? state : max, states[0]),
                totalStates: states.length
            }
        };
    }
}

module.exports = ElectionData;
