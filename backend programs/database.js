const fs = require('fs').promises;
const path = require('path');

class JSONDatabase {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.ensureDataDir();
    }

    async ensureDataDir() {
        try {
            await fs.access(this.dataDir);
        } catch {
            await fs.mkdir(this.dataDir, { recursive: true });
            await this.initializeDefaultData();
        }
    }

    async initializeDefaultData() {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const defaultData = {
            users: [
                {
                    id: 1,
                    username: 'admin',
                    password: hashedPassword,
                    email: 'admin@eci.gov.in',
                    firstName: 'System',
                    lastName: 'Administrator',
                    role: 'admin',
                    organization: 'Election Commission of India',
                    phone: '+911234567890',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
            ],
            incidents: [],
            pollingStations: this.generatePollingStations(),
            electionData: this.generateElectionData()
        };

        for (const [key, data] of Object.entries(defaultData)) {
            await this.writeFile(key, data);
        }
    }

    generatePollingStations() {
        const states = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
            'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ];

        const stations = [];
        let id = 1;

        states.forEach(state => {
            const stationsInState = Math.floor(Math.random() * 100) + 50;
            for (let i = 0; i < stationsInState; i++) {
                stations.push({
                    id: id++,
                    code: `PS-${state.substring(0, 3).toUpperCase()}-${i + 1}`,
                    name: `Polling Station ${i + 1}`,
                    state: state,
                    district: `${state} District ${Math.floor(i / 10) + 1}`,
                    location: {
                        latitude: (Math.random() * 10) + 20,
                        longitude: (Math.random() * 10) + 70
                    },
                    totalVoters: Math.floor(Math.random() * 1000) + 500,
                    currentVoters: 0,
                    status: 'active',
                    lastUpdated: new Date().toISOString()
                });
            }
        });

        return stations;
    }

    generateElectionData() {
        const states = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
            'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ];

        const stateData = states.map(state => ({
            name: state,
            totalVoters: Math.floor(Math.random() * 5000000) + 1000000,
            pollingStations: Math.floor(Math.random() * 50000) + 10000,
            currentTurnout: Math.floor(Math.random() * 70) + 20,
            incidents: Math.floor(Math.random() * 50),
            status: ['normal', 'alert', 'critical'][Math.floor(Math.random() * 3)],
            lastUpdated: new Date().toISOString()
        }));

        return {
            national: {
                totalVoters: stateData.reduce((sum, state) => sum + state.totalVoters, 0),
                pollingStations: stateData.reduce((sum, state) => sum + state.pollingStations, 0),
                constituencies: 2600,
                currentTurnout: stateData.reduce((sum, state) => sum + state.currentTurnout, 0) / stateData.length,
                incidentsReported: stateData.reduce((sum, state) => sum + state.incidents, 0),
                incidentsResolved: Math.floor(stateData.reduce((sum, state) => sum + state.incidents, 0) * 0.7),
                lastUpdated: new Date().toISOString()
            },
            states: stateData
        };
    }

    async readFile(filename) {
        try {
            const data = await fs.readFile(path.join(this.dataDir, `${filename}.json`), 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeFile(filename, data) {
        await fs.writeFile(
            path.join(this.dataDir, `${filename}.json`),
            JSON.stringify(data, null, 2),
            'utf8'
        );
    }

    async find(filename, query = {}) {
        const data = await this.readFile(filename);
        return data.filter(item => {
            return Object.entries(query).every(([key, value]) => {
                return item[key] === value;
            });
        });
    }

    async findOne(filename, query) {
        const data = await this.readFile(filename);
        return data.find(item => {
            return Object.entries(query).every(([key, value]) => {
                return item[key] === value;
            });
        });
    }

    async create(filename, item) {
        const data = await this.readFile(filename);
        const newItem = {
            ...item,
            id: data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newItem);
        await this.writeFile(filename, data);
        return newItem;
    }

    async update(filename, id, updates) {
        const data = await this.readFile(filename);
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return null;

        data[index] = {
            ...data[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        await this.writeFile(filename, data);
        return data[index];
    }

    async delete(filename, id) {
        const data = await this.readFile(filename);
        const filteredData = data.filter(item => item.id !== id);
        await this.writeFile(filename, filteredData);
        return true;
    }
}

module.exports = new JSONDatabase();

