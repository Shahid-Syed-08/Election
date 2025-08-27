const express = require('express');
const User = require('../User');
const { generateToken } = require('../auth');

const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { firstName, lastName, username, email, phone, role, organization, password } = req.body;
    
    // Check required fields
    if (!firstName || !lastName || !email || !phone || !role || !organization || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Validate password strength
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Password complexity requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)' 
        });
    }
    
    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ message: 'Please enter a valid phone number' });
    }
    
    // Validate username if provided
    if (username) {
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 3 and 20 characters long' });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
        }
    }
    
    // Validate role
    const validRoles = ['observer', 'coordinator', 'admin', 'monitor'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role selected' });
    }
    
    // Sanitize inputs
    req.body.firstName = firstName.trim().replace(/[<>]/g, '');
    req.body.lastName = lastName.trim().replace(/[<>]/g, '');
    req.body.email = email.trim().toLowerCase();
    req.body.phone = phone.trim();
    req.body.organization = organization.trim().replace(/[<>]/g, '');
    if (username) {
        req.body.username = username.trim();
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, username, password } = req.body;
    
    if (!password || (!email && !username)) {
        return res.status(400).json({ message: 'Email/Username and password are required' });
    }
    
    if (password.length < 1) {
        return res.status(400).json({ message: 'Password is required' });
    }
    
    // Sanitize inputs
    if (email) req.body.email = email.trim().toLowerCase();
    if (username) req.body.username = username.trim();
    
    next();
};

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { firstName, lastName, username, email, phone, role, organization, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Check if username already exists
        if (username) {
            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return res.status(409).json({ message: 'Username already taken. Please choose a different one.' });
            }
        }

        // Create new user
        const userData = {
            firstName,
            lastName,
            username,
            email,
            phone,
            role,
            organization,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };

        const newUser = await User.create(userData);

        // Generate token for immediate login
        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                organization: newUser.organization,
                phone: newUser.phone
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.message.includes('Username already taken') || error.message.includes('email already exists')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Registration failed. Please try again.' });
        }
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Find user by username or email
        let user = null;
        if (username) {
            user = await User.findByUsername(username);
        }
        if (!user && email) {
            user = await User.findByEmail(email);
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated. Please contact administrator.' });
        }

        // Generate token
        const token = generateToken(user.id);

        // Update last login
        await User.update(user.id, { lastLogin: new Date().toISOString() });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                organization: user.organization,
                phone: user.phone,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { firstName, lastName, phone, organization } = req.body;

        // Update user data
        const updatedUser = await User.update(user.id, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phone: phone || user.phone,
            organization: organization || user.organization
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                organization: updatedUser.organization,
                phone: updatedUser.phone,
                lastLogin: updatedUser.lastLogin,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Change password
router.post('/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        // Verify current password
        const isValidPassword = await User.verifyPassword(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }

        // Update password
        await User.updatePassword(user.id, newPassword);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// Get user activity log
router.get('/activity', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For now, return a simple activity log
        // In a real application, you would store and retrieve actual activity logs
        const activities = [
            {
                type: 'login',
                description: 'Successfully logged in',
                timestamp: new Date().toISOString()
            },
            {
                type: 'profile_update',
                description: 'Updated profile information',
                timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            }
        ];

        res.json(activities);
    } catch (error) {
        console.error('Activity log error:', error);
        res.status(500).json({ message: 'Failed to retrieve activity log' });
    }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Get user statistics (admin only)
router.get('/stats', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const stats = await User.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Failed to get statistics' });
    }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const users = await User.findAll();
        // Remove passwords from response
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        
        res.json(safeUsers);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Failed to get users' });
    }
});

// Activate user (admin only)
router.put('/users/:id/activate', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const adminUser = await User.findById(decoded.userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const userId = parseInt(req.params.id);
        const updatedUser = await User.activateUser(userId);
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User activated successfully' });
    } catch (error) {
        console.error('Activate user error:', error);
        res.status(500).json({ message: 'Failed to activate user' });
    }
});

// Deactivate user (admin only)
router.put('/users/:id/deactivate', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'election_monitoring_secret_2024');
        const adminUser = await User.findById(decoded.userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const userId = parseInt(req.params.id);
        const updatedUser = await User.deactivateUser(userId);
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({ message: 'Failed to deactivate user' });
    }
});

module.exports = router;

