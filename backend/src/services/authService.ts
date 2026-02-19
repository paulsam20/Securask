import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
    static async register(userData: Partial<IUser>) {
        const { username, email, password } = userData;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = this.generateToken(user._id.toString());
        return { user, token };
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user._id.toString());
        return { user, token };
    }

    private static generateToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
    }
}
