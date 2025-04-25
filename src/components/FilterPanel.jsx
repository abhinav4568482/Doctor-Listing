import React from 'react';
import './FilterPanel.css';

function FilterPanel({ 
  selectedConsultType, 
  onConsultTypeChange,
  specialties,
  selectedSpecialties,
  onSpecialtyChange 
}) {
  return (
    <div className="filter-panel">
      {/* Consultation Type Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Consultation Type</h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="consultType"
              value="video"
              checked={selectedConsultType === 'video'}
              onChange={(e) => onConsultTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">
              <span className="icon">🎥</span>
              Video Consult
            </span>
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="consultType"
              value="clinic"
              checked={selectedConsultType === 'clinic'}
              onChange={(e) => onConsultTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">
              <span className="icon">🏥</span>
              In Clinic
            </span>
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="consultType"
              value="all"
              checked={selectedConsultType === 'all'}
              onChange={(e) => onConsultTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">
              <span className="icon">👥</span>
              All Consultations
            </span>
          </label>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Specialties</h3>
        <div className="checkbox-group">
          {specialties.map((specialty) => (
            <label key={specialty} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => onSpecialtyChange(specialty)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">{specialty}</span>
              <span className="specialty-count">
                {/* You can add count here if needed */}
              </span>
            </label>
          ))}
        </div>
        {selectedSpecialties.length > 0 && (
          <button 
            className="clear-filters"
            onClick={() => onSpecialtyChange('clear')}
          >
            Clear Specialties
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterPanel; 