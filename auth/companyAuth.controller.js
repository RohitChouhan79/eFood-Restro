import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // Import the crypto module
import CompanyModel from "../models/company.model.js";
import nodemailer from "nodemailer"; // Import nodemailer for sending emails

// Function to generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Login handler
export async function login(req, res) {
    try {
        const { emailAddress, password } = req.body;

        // Find company by email address
        const company = await CompanyModel.findOne({ emailAddress });

        // Check if the company exists
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, company.password);

        // Check if passwords match
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token expires in 1 hour

        // Respond with user data and token
        res.status(200).json({ company, token });
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

async function sendPasswordResetEmail(company, resetToken) {
    try {
        await transporter.sendMail({
            from: 'suryaumpteen@gmail.com',
            to: company.emailAddress,
            subject: 'Password Reset',
            text: `Hello ${company.companyName},\n\nPlease use the following link to reset your password: ${resetToken}`
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

        // Find company by email address
        const company = await CompanyModel.findOne({ emailAddress });
        console.log("company--->", company);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Generate a reset token
        const resetToken = generateToken();

        // Update company with reset token and expiry time
        company.resetPasswordToken = resetToken;
        company.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await company.save();

        // Send password reset email
        await sendPasswordResetEmail(company, resetToken);

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

        // Find company by reset token
        const company = await CompanyModel.findOne({ resetPasswordToken: resetToken });
        console.log("company", company);

        if (!company) {
            return res.status(404).json({ error: "Invalid or expired reset token" });
        }

        // Check if the reset token has expired
        if (company.resetPasswordExpires < Date.now()) {
            return res.status(401).json({ error: "Reset token has expired" });
        }

        // Generate a new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update company's password and clear reset token
        company.password = hashedPassword;
        company.resetPasswordToken = undefined;
        company.resetPasswordExpires = undefined;

        // Save the updated company
        await company.save();

        // Respond to the client
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}


// Method to change company password
export async function changePassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const companyId = decodedToken.companyId;

        // Find the company by companyId
        const company = await CompanyModel.findById(companyId);

        // If company not found
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update company's password
        company.password = hashedNewPassword;
        await company.save();

        // Send success response
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


