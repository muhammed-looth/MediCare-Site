import BannerImg from "../assets/BannerImg.png";
import D1 from "../assets/D1.png";
import D2 from "../assets/D2.png";
import D3 from "../assets/D3.png";
import D4 from "../assets/D4.png";
import HD1 from "../assets/HD1.png";
import HD2 from "../assets/HD2.png";
import HD3 from "../assets/HD3.png";
import HD4 from "../assets/HD4.png";
import S1 from "../assets/S1.png";
import S3 from "../assets/S3.png";
import S5 from "../assets/S5.png";
import S6 from "../assets/S6.png";

export const heroImage = BannerImg;

export const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
];

export const doctors = [
  {
    _id: "doc-1",
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    department: "Cardiology",
    experience: "12 years",
    qualifications: "MBBS, MD Cardiology",
    location: "Chennai",
    fee: 800,
    availability: "Available",
    about:
      "Focused on preventive cardiology, imaging, and long-term treatment plans for high-risk patients.",
    imageUrl: D1,
    rating: 4.9,
    patients: "2.4k+",
    success: "98%",
    schedule: {
      "2026-04-16": ["10:00 AM", "12:00 PM", "4:00 PM"],
      "2026-04-17": ["9:30 AM", "11:30 AM", "3:30 PM"],
    },
  },
  {
    _id: "doc-2",
    name: "Dr. Arjun Menon",
    specialization: "Neurologist",
    department: "Neurology",
    experience: "9 years",
    qualifications: "MBBS, DM Neurology",
    location: "Bengaluru",
    fee: 950,
    availability: "Available",
    about:
      "Treats headaches, epilepsy, movement disorders, and neuro-rehabilitation with patient-first care.",
    imageUrl: D2,
    rating: 4.8,
    patients: "1.9k+",
    success: "97%",
    schedule: {
      "2026-04-16": ["11:00 AM", "2:00 PM", "5:30 PM"],
      "2026-04-18": ["10:30 AM", "1:00 PM", "4:30 PM"],
    },
  },
  {
    _id: "doc-3",
    name: "Dr. Nisha Verma",
    specialization: "Pediatrician",
    department: "Pediatrics",
    experience: "7 years",
    qualifications: "MBBS, MD Pediatrics",
    location: "Hyderabad",
    fee: 650,
    availability: "Available",
    about:
      "Provides child wellness care, vaccination guidance, and developmental milestone monitoring.",
    imageUrl: D3,
    rating: 4.9,
    patients: "3.1k+",
    success: "99%",
    schedule: {
      "2026-04-16": ["9:00 AM", "1:30 PM", "6:00 PM"],
      "2026-04-19": ["10:00 AM", "12:30 PM", "4:00 PM"],
    },
  },
  {
    _id: "doc-4",
    name: "Dr. Rahul Iyer",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    experience: "14 years",
    qualifications: "MBBS, MS Orthopedics",
    location: "Coimbatore",
    fee: 1100,
    availability: "Unavailable",
    about:
      "Handles sports injuries, fracture recovery, joint pain, and mobility restoration plans.",
    imageUrl: D4,
    rating: 4.7,
    patients: "2.7k+",
    success: "96%",
    schedule: {
      "2026-04-20": ["11:00 AM", "3:00 PM"],
    },
  },
];

export const services = [
  {
    _id: "srv-1",
    name: "Comprehensive Cardiac Checkup",
    shortDescription: "ECG, blood pressure review, cholesterol consultation, and follow-up planning.",
    about:
      "A complete heart-risk screening package designed for early diagnosis and preventive care.",
    imageUrl: S1,
    price: 2200,
    availability: "Available",
  },
  {
    _id: "srv-2",
    name: "Brain and Nerve Assessment",
    shortDescription: "Neurology screening for headaches, dizziness, and nervous system symptoms.",
    about:
      "Structured assessment with specialist review to guide diagnostics and treatment planning.",
    imageUrl: S3,
    price: 2600,
    availability: "Available",
  },
  {
    _id: "srv-3",
    name: "Pediatric Growth Review",
    shortDescription: "Growth, nutrition, and immunity review for infants and children.",
    about:
      "A family-friendly visit covering development, feeding, vaccination guidance, and child wellness.",
    imageUrl: S5,
    price: 1400,
    availability: "Available",
  },
  {
    _id: "srv-4",
    name: "Orthopedic Mobility Clinic",
    shortDescription: "Pain assessment, posture review, and movement recovery planning.",
    about:
      "Built for patients dealing with injury, chronic joint pain, and rehabilitation needs.",
    imageUrl: S6,
    price: 1800,
    availability: "Available",
  },
];

export const highlights = [
  {
    title: "24/7 Appointment Access",
    description: "Patients can book from any device while staff and doctors manage live schedules.",
    image: HD1,
  },
  {
    title: "Specialist Discovery",
    description: "Doctors, departments, consultation fees, and experience are easy to compare.",
    image: HD2,
  },
  {
    title: "Role-Based Workspace",
    description: "Admin, doctor, staff, and patient flows are ready to be connected to secure auth.",
    image: HD3,
  },
  {
    title: "Healthcare-first Design",
    description: "Responsive UI built for trust, clarity, and smooth patient journeys.",
    image: HD4,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Asha Nair",
    role: "Patient",
    quote: "The booking flow is simple and the doctor information feels clear and trustworthy.",
  },
  {
    id: 2,
    name: "Karan Patel",
    role: "Hospital Staff",
    quote: "A strong foundation for managing appointments and keeping communication organized.",
  },
  {
    id: 3,
    name: "Dr. Meera Das",
    role: "Consultant",
    quote: "The interface already feels aligned with a modern clinic experience and scales well.",
  },
];
