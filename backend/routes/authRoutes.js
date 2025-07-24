const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;
const CLIENT_URL = process.env.CLIENT_URL;

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // change if you use another email provider
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS,
    },
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash and set to user
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Reset URL to send in email
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

        // Email message
        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await transporter.sendMail({
            from: EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        });

        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post('/reset-password/:resetToken', async (req, res) => {
    const resetToken = req.params.resetToken;
    const { newPassword } = req.body;

    // Hash token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
