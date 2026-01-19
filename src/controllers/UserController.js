import userService from '../services/UserService.js';

class userController {
    async createLocal(req, res) {
        try {
            const user = await userService.createLocal(req.body);
            return res.status(201).json(user);
        } catch (err) {
            if (err.message === 'EMAIL_IN_USE') {
                return res.status(409).json({ error: 'Email already in use' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createGoogle(req, res) {
        try {
            const user = await userService.createGoogle(req.body);
            return res.status(201).json(user);
        } catch (err) {
            if (err.message === 'EMAIL_IN_USE' || err.message === 'GOOGLE_ID_IN_USE' ) {
                return res.status(409).json({ error: 'User already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async list(req, res) {
        try {
            const users = await userService.list();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const result = await userService.login(req.body);
            return res.json(result);
        } catch (err) {
            if (err.message == 'INVALID_CREDENTIALS') {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async changePassword(req, res) {
        try {
            await userService.changePassword({
                userId: req.userId,
                targetUserId: req.params.id,
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword,
            });
            return res.status(204).send();
        } catch (err) {
            if (err.message === 'FORBIDDEN') {
                return res.status(403).json({ error: 'Forbidden' });
            }
            if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'User not found' });
            }
            if (err.message === 'INVALID_PASSWORD') {
            return res.status(400).json({ error: 'Invalid current password' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new userController();