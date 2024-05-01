import CompanyModel from "../models/company.model.js";
import { validateCreateCompany, validateUpdateCompany } from '../validators/company.validator.js';
import bcrypt from "bcrypt";

// Company New
export async function companyInsert(req, res) {
  try {
    const companyData = req.body;

    // Validate company data before insertion
    const { error } = validateCreateCompany(companyData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if emailAddress already exists in CompanyModel
    const existingCompany = await CompanyModel.findOne({
      emailAddress: companyData.emailAddress,
    });
    if (existingCompany) {
      return res
        .status(400)
        .json({ error: "Company with the given emailAddress already exists" });
    }

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(companyData.password, saltRounds);

    // Insert Company with companyId
    const newCompany = new CompanyModel({
      ...companyData,
      password: hashedPassword,
    });
    const savedCompany = await newCompany.save();

    // Send Response
    res.status(200).json({
      message: "Company data inserted",
      companyData: savedCompany,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Company List
export async function showAllCompanys(req, res) {
  try {
    const company = await CompanyModel.find({ is_active: "true" }).select('-password');

    if (!company || company.length === 0) {
      console.log("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Company
export async function showCompany(req, res) {
  try {
    const companyId = req.params.id; // Corrected variable name
    const company = await CompanyModel.findOne({ _id: companyId }).select('-password'); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const company = await CompanyModel.find({ _id: id }); // Corrected field name
    console.log(company);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Company
export async function updateCompany(req, res) {
  try {
    const companyId = req.params.id;
    const companyDataToUpdate = req.body;

    // Validate company data before update
    const { error } = validateUpdateCompany(companyDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing company by companyId
    const existingCompany = await CompanyModel.findOne({ _id: companyId });
    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update company fields
    Object.assign(existingCompany, companyDataToUpdate);
    const updatedCompany = await existingCompany.save();

    // Send the updated company as JSON response
    res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Company
export async function deleteCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const updatedCompany = await CompanyModel.findOneAndDelete(
      { _id: companyId },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// is_active Company
export async function is_activeCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search company
export async function searchCompany(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find companys that match any field using the regex pattern
    const companys = await CompanyModel.find({
      $or: [
        { companyName: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex },
        { emailAddress: searchRegex },
        { ownerName: searchRegex }
      ],
    });

    if (!companys || companys.length === 0) {
      return res.status(404).json({ message: "No companys found" });
    }

    res.status(200).json({ companys });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
