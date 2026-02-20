import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * AuthService
 * Encapsulates the business logic for user authentication.
 * Used to keep controllers thin and logic reusable.
 */
export class AuthService {
    /**
     * Handles user sign-up logic.
     */
    static async register(userData: Partial<IUser>) {
        const { username, email, password } = userData;

        // Check for existing identity
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = this.generateToken(user._id.toString());
        return { user, token };
    }

    /**
     * Handles credential verification.
     */
    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user._id.toString());
        return { user, token };
    }

    /**
     * Utility to generate JWT tokens.
     */
    private static generateToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
    }
}
