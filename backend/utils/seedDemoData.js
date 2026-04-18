import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

const departmentSeeds = [
  { name: "Cardiology", slug: "cardiology", description: "Heart and circulation care." },
  { name: "Neurology", slug: "neurology", description: "Brain and nervous system care." },
  { name: "Pediatrics", slug: "pediatrics", description: "Infant and child healthcare." },
  { name: "Orthopedics", slug: "orthopedics", description: "Bones, joints, and mobility care." },
];

const serviceSeeds = [
  {
    name: "Comprehensive Cardiac Checkup",
    shortDescription: "ECG, blood pressure review, cholesterol consultation, and follow-up planning.",
    about: "A complete heart-risk screening package designed for early diagnosis and preventive care.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    price: 2200,
  },
  {
    name: "Pediatric Growth Review",
    shortDescription: "Growth, nutrition, and immunity review for infants and children.",
    about: "A family-friendly visit covering development, feeding, vaccination guidance, and child wellness.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    price: 1400,
  },
];

const doctorSeeds = [
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@medicare.local",
    phone: "9876543210",
    specialization: "Cardiologist",
    qualifications: "MBBS, MD Cardiology",
    experience: "12 years",
    location: "Chennai",
    about: "Focused on preventive cardiology, imaging, and long-term treatment plans for high-risk patients.",
    fee: 800,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    patients: "2.4k+",
    success: "98%",
    departmentSlug: "cardiology",
    schedule: {
      "2026-04-16": ["10:00 AM", "12:00 PM", "4:00 PM"],
      "2026-04-17": ["9:30 AM", "11:30 AM", "3:30 PM"],
    },
  },
  {
    name: "Dr. Arjun Menon",
    email: "arjun.menon@medicare.local",
    phone: "9988776655",
    specialization: "Neurologist",
    qualifications: "MBBS, DM Neurology",
    experience: "9 years",
    location: "Bengaluru",
    about: "Treats headaches, epilepsy, movement disorders, and neuro-rehabilitation with patient-first care.",
    fee: 950,
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    patients: "1.9k+",
    success: "97%",
    departmentSlug: "neurology",
    schedule: {
      "2026-04-16": ["11:00 AM", "2:00 PM", "5:30 PM"],
      "2026-04-18": ["10:30 AM", "1:00 PM", "4:30 PM"],
    },
  },
];

async function ensureUser({ name, email, password, phone, role }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  return User.create({ name, email, password, phone, role });
}

export async function seedDemoDataIfNeeded() {
  if (process.env.SEED_ON_START !== "true") {
    return;
  }

  const hasDepartments = await Department.exists({});
  if (!hasDepartments) {
    await Department.insertMany(departmentSeeds);
  }

  const departments = await Department.find();
  const departmentMap = new Map(departments.map((department) => [department.slug, department]));

  const hasServices = await Service.exists({});
  if (!hasServices) {
    await Service.insertMany(serviceSeeds);
  }

  const hasDoctors = await Doctor.exists({});
  if (!hasDoctors) {
    for (const seed of doctorSeeds) {
      const user = await ensureUser({
        name: seed.name,
        email: seed.email,
        password: "doctor123",
        phone: seed.phone,
        role: "doctor",
      });

      await Doctor.create({
        user: user._id,
        department: departmentMap.get(seed.departmentSlug)?._id,
        name: seed.name,
        email: seed.email,
        phone: seed.phone,
        specialization: seed.specialization,
        qualifications: seed.qualifications,
        experience: seed.experience,
        location: seed.location,
        about: seed.about,
        fee: seed.fee,
        imageUrl: seed.imageUrl,
        rating: seed.rating,
        patients: seed.patients,
        success: seed.success,
        schedule: seed.schedule,
      });
    }
  }

  const hasAdmin = await User.findOne({ email: "admin@medicare.com" });
  if (!hasAdmin) {
    await User.create({
      name: "Platform Admin",
      email: "admin@medicare.com",
      password: "admin123456",
      phone: "9000000000",
      role: "admin",
    });
  }

  const hasStaff = await User.findOne({ email: "staff@medicare.com" });
  if (!hasStaff) {
    await User.create({
      name: "Staff Member",
      email: "staff@medicare.com",
      password: "staff123456",
      phone: "9222222222",
      role: "staff",
    });
  }

  const hasDoctorTest = await User.findOne({ email: "doctor@medicare.com" });
  if (!hasDoctorTest) {
    const doctorUser = await User.create({
      name: "Test Doctor",
      email: "doctor@medicare.com",
      password: "doctor123456",
      phone: "9333333333",
      role: "doctor",
    });

    const cardiolDept = departmentMap.get("cardiology");
    await Doctor.create({
      user: doctorUser._id,
      department: cardiolDept?._id,
      name: "Test Doctor",
      email: "doctor@medicare.com",
      phone: "9333333333",
      specialization: "General Practitioner",
      qualifications: "MBBS",
      experience: "5 years",
      location: "City",
      about: "Test doctor for demo purposes",
      fee: 500,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
      rating: 4.5,
      patients: "100+",
      success: "95%",
      schedule: {
        "2026-04-16": ["10:00 AM", "2:00 PM", "4:00 PM"],
        "2026-04-17": ["9:00 AM", "11:00 AM", "3:00 PM"],
      },
    });
  }

  const hasPatient = await Patient.exists({});
  if (!hasPatient) {
    const patientUser = await ensureUser({
      name: "Demo Patient",
      email: "patient@medicare.com",
      password: "patient123456",
      phone: "9111111111",
      role: "patient",
    });

    await Patient.create({
      user: patientUser._id,
      name: patientUser.name,
      email: patientUser.email,
      phone: patientUser.phone,
      age: 29,
      gender: "Female",
      bloodGroup: "B+",
      address: "Chennai",
      medicalHistory: "No major history.",
    });
  }

  console.log("Demo seed check completed");
}
