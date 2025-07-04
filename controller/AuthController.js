import User from '../model/AuthModel.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const JWT = process.env.JWT_SECRET ;

export const Register = async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;

        if (!username || !email || !password || !mobile) {
            return res.status(400).json({ message: 'All registration fields are required. Please ensure username, email, password, and mobile are provided. ⚠️' });
        }

        const isAlreadyUserEmail = await User.findOne({ email: email.toLowerCase() });
        if (isAlreadyUserEmail) {
            return res.status(409).json({ message: 'This email address is already registered. Please use a different email or log in. 📧' });
        }

        const isAlreadyUserUsername = await User.findOne({ username });
        if (isAlreadyUserUsername) {
            return res.status(409).json({ message: 'This username is already taken. Please choose a different username. 👤' });
        }

        const isAlreadyUserMobile = await User.findOne({ mobile });
        if (isAlreadyUserMobile) {
            return res.status(409).json({ message: 'This mobile number is already registered. Please use a different number or log in. 📱' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            username: username,
            mobile: mobile,
        });

        const payload = {
            username: newUser.username,
            email: newUser.email,
            mobile: newUser.mobile,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Account created successfully! Welcome aboard. 🎉', token });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred during registration. Please try again later. 🛠️' });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Input:', { email, password });

        if (!email || !password) {
            return res.status(401).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        console.log('Found user:', user ? { email: user.email, password: user.password } : 'No user');

        if (!user) {
            return res.status(401).json({ message: 'No user found' });
        }

        const checkPassword = await bcrypt.compare(password.trim(), user.password);
        console.log('Password match:', checkPassword);

        if (!checkPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};