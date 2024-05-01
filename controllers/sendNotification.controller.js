import SendNotificationModel from "../models/sendNotification.model.js";
import CustomerModel from "../models/customer.model.js";
import { validateCreateSendNotification, validateUpdateSendNotification } from '../validators/sendNotification.validator.js';
import { sendEmailNotification } from '../utills/email.js';

// SendNotification New
// export async function insertSendNotification(req, res) {
//   try {
//       const sendNotificationData = req.body;
//       console.log("sendNotificationData", sendNotificationData);

//       // Validate sendNotification data before insertion
//       const { error } = validateCreateSendNotification(sendNotificationData);
//       if (error) {
//           return res.status(400).json({ error: error.message });
//       }

//       // Check if roleName already exists in SendNotificationModel
//       const existingSendNotification = await SendNotificationModel.findOne({
//         title: sendNotificationData.title,
//       });
//       if (existingSendNotification) {
//         return res
//           .status(400)
//           .json({ error: "SendNotification with the given Title already exists" });
//       }

//       // Insert sendNotification with itemId
//       const newSendNotification = new SendNotificationModel(sendNotificationData);
//       const savedSendNotification = await newSendNotification.save();

//       // Send Response
//       res.status(200).json({ message: "SendNotification data inserted", datashow: savedSendNotification });
//   } catch (error) {
//       return res
//           .status(500)
//           .json({
//               success: false,
//               message: error.message || "Something went wrong",
//           });
//   }
// }
export async function insertSendNotification(req, res) {
  try {
    const sendNotificationData = req.body;
    const { emailAddresses } = sendNotificationData;

    // Validate sendNotification data before insertion
    const { error } = validateCreateSendNotification(sendNotificationData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert sendNotification
    const newSendNotification = new SendNotificationModel(sendNotificationData);
    const savedSendNotification = await newSendNotification.save();

    // Determine recipients based on emailAddresses
    let recipients = [];
    if (emailAddresses && emailAddresses.length > 0) {
      recipients = emailAddresses;
    } else {
      // Fetch all customers' email addresses
      const customers = await CustomerModel.find({});
      recipients = customers.map(customer => customer.emailAddress);
    }

    // Send notifications to recipients
    for (const emailAddress of recipients) {
      await sendEmailNotification(emailAddress, sendNotificationData.title, sendNotificationData.description);
    }

    // Send Response
    res.status(200).json({ message: "SendNotification data inserted", datashow: savedSendNotification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// SendNotification List
export async function showAllSendNotifications(req, res) {
  try {
    const sendNotification = await SendNotificationModel.find({ is_active: "true" }).select('-emailAddresses');

    if (!sendNotification || sendNotification.length === 0) {
      console.log("SendNotification not found");
      return res.status(404).json({ message: "SendNotification not found" });
    }

    res.status(200).json({ sendNotification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single SendNotification
export async function showSendNotification(req, res) {
  try {
    const sendNotificationId = req.params.id; // Corrected variable name
    const sendNotification = await SendNotificationModel.findOne({ _id: sendNotificationId }).select('-emailAddresses'); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const sendNotification = await SendNotificationModel.find({ _id: id }); // Corrected field name
    console.log(sendNotification);

    if (!sendNotification) {
      return res.status(404).json({ message: "SendNotification not found" });
    }

    res.status(200).json({ sendNotification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update SendNotification
export async function updateSendNotification(req, res) {
  try {
    const sendNotificationId = req.params.id;
    const sendNotificationDataToUpdate = req.body;

    // Validate sendNotification data before update
    const { error } = validateUpdateSendNotification(sendNotificationDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing sendNotification by sendNotificationId
    const existingSendNotification = await SendNotificationModel.findOne({ _id: sendNotificationId });
    if (!existingSendNotification) {
      return res.status(404).json({ message: "SendNotification not found" });
    }

    // Update sendNotification fields
    Object.assign(existingSendNotification, sendNotificationDataToUpdate);
    const updatedSendNotification = await existingSendNotification.save();

    // Send the updated sendNotification as JSON response
    res.status(200).json({ message: "SendNotification updated successfully", sendNotification: updatedSendNotification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete SendNotification
export async function deleteSendNotification(req, res, next) {
  try {
    const sendNotificationId = req.params.id;
    const updatedSendNotification = await SendNotificationModel.findOneAndUpdate(
      { _id: sendNotificationId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedSendNotification) {
      return res.status(404).json({ message: "SendNotification not found." });
    }

    res.status(200).json({ message: "SendNotification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search sendNotification
export async function searchSendNotification(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find sendNotifications that match any field using the regex pattern
    const sendNotifications = await SendNotificationModel.find({
      $or: [
        { title: searchRegex }
      ],
    });

    if (!sendNotifications || sendNotifications.length === 0) {
      return res.status(404).json({ message: "No sendNotifications found" });
    }

    res.status(200).json({ sendNotifications });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
