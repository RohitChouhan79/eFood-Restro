import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // Import the crypto module
import WaiterModel from "../models/waiter.model.js";
import nodemailer from "nodemailer"; // Import nodemailer for sending emails

// Function to generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Login handler
export async function login(req, res) {
    try {
        const { emailAddress, password } = req.body;

        // Find waiter by email address
        const waiter = await WaiterModel.findOne({ emailAddress });

        // Check if the waiter exists
        if (!waiter) {
            return res.status(404).json({ error: "Waiter not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, waiter.password);

        // Check if passwords match
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign({ waiterId: waiter._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token expires in 1 hour

        // Respond with user data and token
        res.status(200).json({ waiter, token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}

export async function logout(req, res) {
    try {
        // Clear the token cookie
        res.clearCookie('token'); // Clearing the token cookie

        // Alternatively, you can send a response instructing the client to clear the token from local storage
        res.status(200).json({ message: "Logged out successfully", clearToken: true });
    } catch (error) {
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}

const transporter = nodemailer.createTransport({
    service: 'suryaumpteen@gmail.com', // e.g., 'gmail'
    auth: {
        user: 'suryaumpteen@gmail.com',
        pass: 'egye onio jxeo rhmt'
    }
});

async function sendPasswordResetEmail(waiter, resetToken) {
    try {
        await transporter.sendMail({
            from: 'suryaumpteen@gmail.com',
            to: waiter.emailAddress,
            subject: 'Password Reset',
            text: `Hello ${waiter.waiterName},\n\nPlease use the following link to reset your password: ${resetToken}`
        });
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
}

export async function forgotPassword(req, res) {
    try {
        let { emailAddress } = req.body;
        emailAddress = emailAddress.trim().toLowerCase(); // Trim whitespace and convert to lowercase
        console.log("emailAddress--->", emailAddress);

        // Find waiter by email address
        const waiter = await WaiterModel.findOne({ emailAddress });
        console.log("waiter--->", waiter);
        if (!waiter) {
            return res.status(404).json({ error: "Waiter not found" });
        }

        // Generate a reset token
        const resetToken = generateToken();

        // Update waiter with reset token and expiry time
        waiter.resetPasswordToken = resetToken;
        waiter.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await waiter.save();

        // Send password reset email
        await sendPasswordResetEmail(waiter, resetToken);

        // Respond to the client
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}

// Reset password handler
export async function resetPassword(req, res) {
    try {
        const { resetToken, newPassword } = req.body;

        // Find waiter by reset token
        const waiter = await WaiterModel.findOne({ resetPasswordToken: resetToken });
        console.log("waiter", waiter);

        if (!waiter) {
            return res.status(404).json({ error: "Invalid or expired reset token" });
        }

        // Check if the reset token has expired
        if (waiter.resetPasswordExpires < Date.now()) {
            return res.status(401).json({ error: "Reset token has expired" });
        }

        // Generate a new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update waiter's password and clear reset token
        waiter.password = hashedPassword;
        waiter.resetPasswordToken = undefined;
        waiter.resetPasswordExpires = undefined;

        // Save the updated waiter
        await waiter.save();

        // Respond to the client
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}


// Method to change waiter password
export async function changePassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const waiterId = decodedToken.waiterId;

        // Find the waiter by waiterId
        const waiter = await WaiterModel.findById(waiterId);

        // If waiter not found
        if (!waiter) {
            return res.status(404).json({ message: "Waiter not found" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update waiter's password
        waiter.password = hashedNewPassword;
        await waiter.save();

        // Send success response
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


