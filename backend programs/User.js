const db = require('./database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        try {
            const { firstName, lastName, username, email, phone, role, organization, password } = userData;
            
            // Check if email already exists
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            
            // Check if username already exists
            if (username) {
                const existingUsername = await this.findByUsername(username);
                if (existingUsername) {
                    throw new Error('Username already taken. Please choose a different one.');
                }
            }
            
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await db.create('users', {
                firstName,
                lastName,
                username: username || email.split('@')[0], // Use email prefix as default username if none provided
                email,
                role: role || 'observer',
                organization,
                phone,
                password: hashedPassword,
                createdAt: userData.createdAt || new Date().toISOString(),
                lastLogin: userData.lastLogin || null,
                isActive: userData.isActive !== undefined ? userData.isActive : true
            });
            return { ...user, password: undefined };
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        return await db.findOne('users', { email });
    }

    static async findByUsername(username) {
        return await db.findOne('users', { username });
    }

    static async findById(id) {
        return await db.findOne('users', { id: parseInt(id) });
    }

    static async findAll() {
        return await db.readFile('users');
    }

    static async update(id, updates) {
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }
        return await db.update('users', parseInt(id), updates);
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        return await db.update('users', parseInt(id), { password: hashedPassword });
    }

    static async delete(id) {
        return await db.delete('users', parseInt(id));
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async getStats() {
        const users = await this.findAll();
        return {
            total: users.length,
            byRole: users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {}),
            active: users.filter(u => u.isActive).length,
            recentLogins: users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
            byOrganization: users.reduce((acc, user) => {
                acc[user.organization] = (acc[user.organization] || 0) + 1;
                return acc;
            }, {})
        };
    }

    static async getUsersByRole(role) {
        const users = await this.findAll();
        return users.filter(user => user.role === role);
    }

    static async getActiveUsers() {
        const users = await this.findAll();
        return users.filter(user => user.isActive);
    }

    static async deactivateUser(id) {
        return await this.update(id, { isActive: false });
    }

    static async activateUser(id) {
        return await this.update(id, { isActive: true });
    }
}

module.exports = User;

