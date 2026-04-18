import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function registerPatient(req, res, next) {
  try {
    const { name, email, password, phone = "" } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "patient",
    });

    await Patient.create({
      user: user._id,
      name,
      email,
      phone,
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials.");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("Your account has been deactivated. Contact administration.");
    }

    res.json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(req, res) {
  res.json({ success: true, user: req.user });
}

// Admin registration (admin-only endpoint)
export async function registerAdmin(req, res, next) {
  try {
    const { name, email, password, phone = "" } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Doctor registration (admin-only endpoint)
export async function registerDoctor(req, res, next) {
  try {
    const { name, email, password, phone = "", department, specialization, qualifications, experience } = req.body;

    if (!name || !email || !password || !department || !specialization) {
      res.status(400);
      throw new Error("Name, email, password, department, and specialization are required.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "doctor",
    });

    await Doctor.create({
      user: user._id,
      name,
      email,
      phone,
      department,
      specialization,
      qualifications: qualifications || "",
      experience: experience || "",
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Staff registration (admin-only endpoint)
export async function registerStaff(req, res, next) {
  try {
    const { name, email, password, phone = "" } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "staff",
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
