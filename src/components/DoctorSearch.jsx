import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { getMockDoctors } from '../services/doctorService';
import './DoctorSearch.css';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.trim() === '') {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      // In a real application, replace getMockDoctors with actual API call
      const results = await getMockDoctors(term);
      setSuggestions(results);
      setLoading(false);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSelectDoctor = (doctor) => {
    setSearchTerm(doctor.name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectDoctor(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search for doctors by name or specialty..."
        aria-label="Search doctors"
      />

      {showSuggestions && (
        <div className="suggestions-container">
          {loading ? (
            <div className="loading-spinner">
              Loading...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((doctor, index) => (
              <div
                key={doctor.id}
                className={`suggestion-item ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => handleSelectDoctor(doctor)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-details">
                  <span>{doctor.speciality}</span>
                  <span className="rating" title={`Rating: ${doctor.rating}/5`}>
                    {renderStars(doctor.rating)}
                  </span>
                  <span className="availability">{doctor.availability}</span>
                </div>
              </div>
            ))
          ) : searchTerm ? (
            <div className="no-results">
              No doctors found matching "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;