import { doctors as demoDoctors, services as demoServices } from "./demoData";

// Get API URL from environment or construct from current host
const API_BASE = import.meta.env.VITE_API_URL || (() => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:4000`;
  }
  return "http://localhost:4000";
})();

async function request(path, fallback) {
  try {
    // Add timestamp to always bypass cache
    const separator = path.includes('?') ? '&' : '?';
    const cacheBustUrl = `${path}${separator}t=${Date.now()}`;
    
    const response = await fetch(`${API_BASE}${cacheBustUrl}`, {
      cache: 'no-store', // Disable browser caching
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(json?.message || `Request failed with ${response.status}`);
    }

    return json?.data || json?.doctors || json?.services || json?.appointments || json;
  } catch (error) {
    console.warn(`Using demo fallback for ${path}:`, error.message);
    return fallback;
  }
}

export function getDoctors() {
  return request("/api/doctors", demoDoctors);
}

export function getDoctorById(id) {
  return request(`/api/doctors/${id}`, demoDoctors.find((doctor) => doctor._id === id) || null);
}

export function getServices() {
  return request("/api/services", demoServices);
}

export function getServiceById(id) {
  return request(`/api/services/${id}`, demoServices.find((service) => service._id === id) || null);
}
