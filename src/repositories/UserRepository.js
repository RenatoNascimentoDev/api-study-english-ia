import User from '../models/User.js';

class UserRepository {
    create(data) {
        return User.create(data);
    }

    findByEmail(email) {
        return User.findOne({ email });
    }

    findByGoogleId(googleId) {
        return User.findOne({ googleId });
    }

    findAll() {
        return User.find({}, { passwordHash: 0 });
    }

    findById(id) {
        return User.findById(id);
    }

    updatePassword(id, passwordHash) {
        return User.findByIdAndUpdate(id, { passwordHash }, { new: true });
    }
}

export default new UserRepository();