import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import jwt from 'jsonwebtoken';

const BCRYPT_ROUNDS = 10;

class userService {
    async createLocal({ name, email, password }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) throw new Error('EMAIL_IN_USE');

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        return userRepository.create({
            name,
            email,
            passwordHash,
            provider: 'local',
        });
    }

    async createGoogle({ name, email, googleId, avatarUrl }) {
        const existingGoogle = await userRepository.findByGoogleId(googleId);
        if (existingGoogle) throw new Error('GOOGLE_ID_IN_USE');

        if (email) {
            const existingEmail = await userRepository.findByEmail(email);
            if (existingEmail) throw new Error('EMAIL_IN_USE');
        }

        return userRepository.create({
            name,
            email,
            googleId,
            avatarUrl,
            provider: 'google',
        });
    }

    async list() {
        return userRepository.findAll();
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error('INVALID_CREDENTIALS');

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash || '');
        if (!isPasswordValid) throw new Error('INVALID_CREDENTIALS');

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { passwordHash, ...safeUser } = user.toObject ? user.toObject() : user;
        return { user: safeUser, token };
    }

    async changePassword({ userId, targetUserId, currentPassword, newPassword }) {
        if (String(userId) !== String(targetUserId)) throw new Error('FORBIDDEN');

        const user = await userRepository.findById(targetUserId);
        if (!user) throw new Error('NOT_FOUND');

        const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash || '');
        if (!isCurrentValid) throw new Error('INVALID_PASSWORD');

        const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
        await userRepository.updatePassword(targetUserId, passwordHash);
    }
}

export default new userService();
