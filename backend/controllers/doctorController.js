import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export async function getDoctors(_req, res, next) {
  try {
    const doctors = await Doctor.find()
      .populate("department", "name slug description")
      .sort({ createdAt: -1 });

    const data = doctors.map((doctor) => ({
      ...doctor.toObject({ flattenMaps: true }),
      department: doctor.department
        ? { _id: doctor.department._id, name: doctor.department.name }
        : null,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorById(req, res, next) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("department", "name slug description");

    if (!doctor) {
      res.status(404);
      throw new Error("Doctor not found.");
    }

    const data = doctor.toObject({ flattenMaps: true });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDoctor(req, res, next) {
  try {
    const { user, department, specialization, qualifications = "", experience = "", location = "", about = "", fee = 0, imageUrl = "" } = req.body;

    if (!user || !department || !specialization) {
      res.status(400);
      throw new Error("User, department, and specialization are required.");
    }

    const userData = await User.findById(user);
    if (!userData) {
      res.status(404);
      throw new Error("User not found.");
    }

    const doctor = await Doctor.create({
      user,
      department,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      specialization,
      qualifications,
      experience,
      location,
      about,
      fee,
      imageUrl,
    });

    await doctor.populate("department", "name slug");

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
}

export async function updateDoctor(req, res, next) {
  try {
    const { id } = req.params;
    const { specialization, qualifications, experience, location, about, fee, imageUrl, department, availability, rating, patients, success, schedule } = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404);
      throw new Error("Doctor not found.");
    }

    // Authorization: only the doctor themselves or admin can update
    if (req.user.role !== "admin" && req.user._id.toString() !== doctor.user.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this doctor profile.");
    }

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (location) doctor.location = location;
    if (about) doctor.about = about;
    if (fee !== undefined) doctor.fee = fee;
    if (imageUrl) doctor.imageUrl = imageUrl;
    if (department) doctor.department = department;
    if (availability) doctor.availability = availability;
    if (rating !== undefined) doctor.rating = rating;
    if (patients) doctor.patients = patients;
    if (success) doctor.success = success;
    if (schedule !== undefined) {
      doctor.schedule = schedule;
      doctor.markModified('schedule');
    }

    const updated = await doctor.save();
    const populated = await Doctor.findById(updated._id).populate("department", "name slug description");

    res.json({ success: true, data: populated.toObject({ flattenMaps: true }) });
  } catch (error) {
    next(error);
  }
}

export async function deleteDoctor(req, res, next) {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404);
      throw new Error("Doctor not found.");
    }

    // Delete associated user
    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(id);

    res.json({ success: true, message: "Doctor deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req, res, next) {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate("department", "name slug");

    if (!doctor) {
      res.status(404);
      throw new Error("Doctor profile not found.");
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorsByDepartment(req, res, next) {
  try {
    const { departmentId } = req.params;

    const doctors = await Doctor.find({ department: departmentId })
      .populate("department", "name slug")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
}
