import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [consultationType, setConsultationType] = useState('all')
  const [sortBy, setSortBy] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors data');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('search')) setSearchTerm(params.get('search'))
    if (params.has('consultation')) setConsultationType(params.get('consultation'))
    if (params.has('sort')) setSortBy(params.get('sort'))
    if (params.has('specialties')) {
      setSelectedSpecialties(params.get('specialties').split(','))
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (consultationType !== 'all') params.set('consultation', consultationType)
    if (sortBy) params.set('sort', sortBy)
    if (selectedSpecialties.length > 0) {
      params.set('specialties', selectedSpecialties.join(','))
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' : ''}${params.toString()}`
    window.history.pushState({}, '', newUrl)
  }, [searchTerm, consultationType, sortBy, selectedSpecialties])

  useEffect(() => {
    if (searchTerm.trim()) {
      const matches = doctors
        .filter(doctor => 
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3); // Limit to top 3 matches
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getFilteredAndSortedDoctors = () => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = !searchTerm || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialities.some(spec => 
          spec.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesConsultationType = 
        consultationType === 'all' || 
        (consultationType === 'video' && doctor.video_consult) ||
        (consultationType === 'clinic' && doctor.in_clinic)

      const matchesSpecialties = 
        selectedSpecialties.length === 0 ||
        doctor.specialities.some(spec => selectedSpecialties.includes(spec.name))

      return matchesSearch && matchesConsultationType && matchesSpecialties
    })

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const feeA = parseInt(a.fees?.replace(/[^\d]/g, '') || '0')
        const feeB = parseInt(b.fees?.replace(/[^\d]/g, '') || '0')
        return feeA - feeB
      })
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience?.replace(/[^\d]/g, '') || '0')
        const expB = parseInt(b.experience?.replace(/[^\d]/g, '') || '0')
        return expB - expA
      })
    }

    return filtered
  }

  const handleSearchSubmit = (selectedName = searchTerm) => {
    setSearchTerm(selectedName);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleConsultationTypeChange = (type) => {
    setConsultationType(type);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading doctors...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
      </div>
    )
  }

  const filteredAndSortedDoctors = getFilteredAndSortedDoctors()

  return (
    <div className="app">
      <header className="header">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search doctors, specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            data-testid="autocomplete-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((doctor) => (
                <div
                  key={doctor.id}
                  className="suggestion-item"
                  onClick={() => handleSearchSubmit(doctor.name)}
                  data-testid="suggestion-item"
                >
                  <div className="suggestion-name">{doctor.name}</div>
                  <div className="suggestion-specialty">
                    {doctor.specialities[0]?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        <aside className="filters-panel">
          <div className="filter-section">
            <h3 className="filter-header" data-testid="filter-header-sort">
              Sort by
            </h3>
            <div className="sort-options">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="sort" 
                  value="price-low"
                  checked={sortBy === 'price-low'}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <span>Price: Low-High</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="sort" 
                  value="experience"
                  checked={sortBy === 'experience'}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <span>Experience: Most Experience first</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-header" data-testid="filter-header-moc">
              Mode of Consultation
            </h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="consultationType"
                  checked={consultationType === 'all'}
                  onChange={() => handleConsultationTypeChange('all')}
                  className="radio-input"
                />
                <span className="radio-text">All</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="consultationType"
                  checked={consultationType === 'video'}
                  onChange={() => handleConsultationTypeChange('video')}
                  className="radio-input"
                  data-testid="filter-video-consult"
                />
                <span className="radio-text">Video Consult</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="consultationType"
                  checked={consultationType === 'clinic'}
                  onChange={() => handleConsultationTypeChange('clinic')}
                  className="radio-input"
                  data-testid="filter-in-clinic"
                />
                <span className="radio-text">In Clinic</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-header" data-testid="filter-header-speciality">
              Specialties
            </h3>
            <div className="checkbox-group">
              {Array.from(new Set(doctors.flatMap(d => 
                d.specialities.map(s => s.name)
              ))).sort().map(specialty => (
                <label key={specialty} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => {
                      setSelectedSpecialties(prev => 
                        prev.includes(specialty)
                          ? prev.filter(s => s !== specialty)
                          : [...prev, specialty]
                      );
                    }}
                  />
                  <span>{specialty}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        <section className="doctors-grid">
          {filteredAndSortedDoctors.map(doctor => (
            <article key={doctor.id} className="doctor-card" data-testid="doctor-card">
              <div className="doctor-left">
                <img
                  src={doctor.photo || 'placeholder.png'}
                  alt={doctor.name}
                  className="doctor-image"
                  onError={(e) => {
                    e.target.src = 'placeholder.png';
                    e.target.onerror = null;
                  }}
                />
                
                <div className="doctor-info">
                  <h2 className="doctor-name" data-testid="doctor-name">
                    {doctor.name}
                  </h2>
                  <p className="doctor-specialties" data-testid="doctor-specialty">
                    {doctor.specialities?.map(s => s.name).join(', ')}
                  </p>
                  <p className="doctor-experience" data-testid="doctor-experience">
                    <span>🎓</span> {doctor.experience} years experience
                  </p>
                  <p className="doctor-location">
                    <span>📍</span> {doctor.clinic_name}
                  </p>
                  <div className="consultation-badges">
                    {doctor.video_consult && (
                      <span className="badge">
                        <span>🎥</span> Video Consult
                      </span>
                    )}
                    {doctor.in_clinic && (
                      <span className="badge">
                        <span>🏥</span> In Clinic
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="doctor-actions">
                <div className="fee-container">
                  <p className="consultation-fee-label">Consultation Fee</p>
                  <p className="consultation-fee" data-testid="doctor-fee">
                    {doctor.fees}
                  </p>
                </div>
                <button className="book-button">
                  Book Appointment
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App