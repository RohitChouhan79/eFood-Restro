import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // Import the crypto module
import CustomerModel from "../models/customer.model.js";
import nodemailer from "nodemailer"; // Import nodemailer for sending emails

// Function to generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Login handler
export async function login(req, res) {
    try {
        const { emailAddress, password } = req.body;

        // Find customer by email address
        const customer = await CustomerModel.findOne({ emailAddress });

        // Check if the customer exists
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        // Check if passwords match
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token expires in 1 hour

        // Respond with user data and token
        res.status(200).json({ customer, token });
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

async function sendPasswordResetEmail(customer, resetToken) {
    try {
        await transporter.sendMail({
            from: 'suryaumpteen@gmail.com',
            to: customer.emailAddress,
            subject: 'Password Reset',
            text: `Hello ${customer.customerName},\n\nPlease use the following link to reset your password: ${resetToken}`
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

        // Find customer by email address
        const customer = await CustomerModel.findOne({ emailAddress });
        console.log("customer--->", customer);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Generate a reset token
        const resetToken = generateToken();

        // Update customer with reset token and expiry time
        customer.resetPasswordToken = resetToken;
        customer.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await customer.save();

        // Send password reset email
        await sendPasswordResetEmail(customer, resetToken);

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

        // Find customer by reset token
        const customer = await CustomerModel.findOne({ resetPasswordToken: resetToken });
        console.log("customer", customer);

        if (!customer) {
            return res.status(404).json({ error: "Invalid or expired reset token" });
        }

        // Check if the reset token has expired
        if (customer.resetPasswordExpires < Date.now()) {
            return res.status(401).json({ error: "Reset token has expired" });
        }

        // Generate a new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update customer's password and clear reset token
        customer.password = hashedPassword;
        customer.resetPasswordToken = undefined;
        customer.resetPasswordExpires = undefined;

        // Save the updated customer
        await customer.save();

        // Respond to the client
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}


// Method to change customer password
export async function changePassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decodedToken.customerId;

        // Find the customer by customerId
        const customer = await CustomerModel.findById(customerId);

        // If customer not found
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update customer's password
        customer.password = hashedNewPassword;
        await customer.save();

        // Send success response
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


