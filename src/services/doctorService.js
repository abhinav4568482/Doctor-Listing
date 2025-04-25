import axios from 'axios';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

// Fetch doctors from API
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

// Filter doctors based on search term and filters
export const filterDoctors = (doctors, searchTerm, filters) => {
  let filteredDoctors = [...doctors];

  // Filter by search term
  if (searchTerm) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Filter by consultation type
  if (filters.consultType !== 'all') {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.consultationType === filters.consultType
    );
  }

  // Filter by specialties
  if (filters.specialties.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      doctor.specialties.some(specialty => 
        filters.specialties.includes(specialty)
      )
    );
  }

  return filteredDoctors;
};

// Get unique specialties from doctors array
export const getAllSpecialties = (doctors) => {
  const specialtiesSet = new Set(
    doctors.flatMap(doctor => doctor.specialties)
  );
  return Array.from(specialtiesSet).sort();
};

// Mock data for demonstration
export const getMockDoctors = (searchTerm, filters) => {
  const mockDoctors = [
    { 
      id: 1, 
      name: 'Dr. John Smith', 
      specialties: ['Cardiology', 'Internal Medicine'],
      rating: 4.8, 
      availability: 'Available Today',
      consultationType: 'video'
    },
    { 
      id: 2, 
      name: 'Dr. Sarah Johnson', 
      specialties: ['Pediatrics', 'Family Medicine'],
      rating: 4.9, 
      availability: 'Next Available: Tomorrow',
      consultationType: 'clinic'
    },
    { 
      id: 3, 
      name: 'Dr. Michael Brown', 
      specialties: ['Neurology', 'Psychiatry'],
      rating: 4.7, 
      availability: 'Available Today',
      consultationType: 'video'
    },
    { 
      id: 4, 
      name: 'Dr. Emily Davis', 
      specialties: ['Dermatology', 'Cosmetic Surgery'],
      rating: 4.6, 
      availability: 'Next Available: Monday',
      consultationType: 'clinic'
    },
    { 
      id: 5, 
      name: 'Dr. Robert Wilson', 
      specialties: ['Orthopedics', 'Sports Medicine'],
      rating: 4.9, 
      availability: 'Available Today',
      consultationType: 'video'
    },
  ];

  let filteredDoctors = mockDoctors;

  // Filter by search term
  if (searchTerm) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Filter by consultation type
  if (filters.consultType !== 'all') {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.consultationType === filters.consultType
    );
  }

  // Filter by specialties
  if (filters.specialties.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      doctor.specialties.some(specialty => 
        filters.specialties.includes(specialty)
      )
    );
  }

  return filteredDoctors;
}; 