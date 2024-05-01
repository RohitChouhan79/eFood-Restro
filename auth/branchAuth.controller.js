import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // Import the crypto module
import BranchModel from "../models/branch.model.js";
import nodemailer from "nodemailer"; // Import nodemailer for sending emails

// Function to generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Login handler
export async function login(req, res) {
    try {
        const { emailAddress, password } = req.body;

        // Find branch by email address
        const branch = await BranchModel.findOne({ emailAddress });

        // Check if the branch exists
        if (!branch) {
            return res.status(404).json({ error: "Branch not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, branch.password);

        // Check if passwords match
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign({ branchId: branch._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token expires in 1 hour

        // Respond with user data and token
        res.status(200).json({ branch, token });
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

async function sendPasswordResetEmail(branch, resetToken) {
    try {
        await transporter.sendMail({
            from: 'suryaumpteen@gmail.com',
            to: branch.emailAddress,
            subject: 'Password Reset',
            text: `Hello ${branch.branchName},\n\nPlease use the following link to reset your password: ${resetToken}`
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

        // Find branch by email address
        const branch = await BranchModel.findOne({ emailAddress });
        console.log("branch--->", branch);
        if (!branch) {
            return res.status(404).json({ error: "Branch not found" });
        }

        // Generate a reset token
        const resetToken = generateToken();

        // Update branch with reset token and expiry time
        branch.resetPasswordToken = resetToken;
        branch.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await branch.save();

        // Send password reset email
        await sendPasswordResetEmail(branch, resetToken);

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

        // Find branch by reset token
        const branch = await BranchModel.findOne({ resetPasswordToken: resetToken });
        console.log("branch", branch);

        if (!branch) {
            return res.status(404).json({ error: "Invalid or expired reset token" });
        }

        // Check if the reset token has expired
        if (branch.resetPasswordExpires < Date.now()) {
            return res.status(401).json({ error: "Reset token has expired" });
        }

        // Generate a new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update branch's password and clear reset token
        branch.password = hashedPassword;
        branch.resetPasswordToken = undefined;
        branch.resetPasswordExpires = undefined;

        // Save the updated branch
        await branch.save();

        // Respond to the client
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}


// Method to change branch password
export async function changePassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const branchId = decodedToken.branchId;

        // Find the branch by branchId
        const branch = await BranchModel.findById(branchId);

        // If branch not found
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update branch's password
        branch.password = hashedNewPassword;
        await branch.save();

        // Send success response
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


