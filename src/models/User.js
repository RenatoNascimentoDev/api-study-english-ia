import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, lowercase: true, trim: true },
        passwordHash: { type: String },
        googleId: { type: String },
        provider: { type: String },
        avatarUrl: { type: String },
    },
    { timestamps: true }
)

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true});

export default mongoose.model('User', userSchema);