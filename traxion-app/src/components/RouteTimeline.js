import React from 'react';
import './RouteTimeline.css';

function RouteTimeline({ timeline }) {
  const getStepIcon = (activity) => {
    switch (activity) {
      case 'inicio':
        return 'fas fa-flag-checkered';
      case 'conduccion':
        return 'fas fa-car';
      case 'descanso':
        return 'fas fa-coffee';
      case 'llegada':
        return 'fas fa-warehouse';
      default:
        return 'fas fa-car';
    }
  };

  const getStepColor = (activity) => {
    switch (activity) {
      case 'inicio':
        return 'var(--success-color)';
      case 'conduccion':
        return 'var(--primary-color)';
      case 'descanso':
        return 'var(--warning-color)';
      case 'llegada':
        return 'var(--error-color)';
      default:
        return 'var(--gray-500)';
    }
  };

  const getActivityLabel = (activity) => {
    switch (activity) {
      case 'inicio':
        return 'Punto de inicio';
      case 'conduccion':
        return 'En movimiento';
      case 'descanso':
        return 'En descanso';
      case 'llegada':
        return 'Destino final';
      default:
        return 'Actividad';
    }
  };

  return (
    <div className="timeline-card">
      <div className="timeline-header">
        <h3>
          <i className="fas fa-route"></i>
          Línea de Tiempo de la Ruta
        </h3>
      </div>
      
      <div className="timeline-container">
        {timeline.map((step, index) => (
          <div key={index} className="timeline-step">
            <div className="timeline-marker">
              <div 
                className="marker-icon"
                style={{ backgroundColor: getStepColor(step.activity) }}
              >
                <i className={getStepIcon(step.activity)}></i>
              </div>
              {index < timeline.length - 1 && (
                <div className="timeline-connector"></div>
              )}
            </div>
            
            <div className="timeline-content">
              <div className="step-header">
                <h4 className="step-title">{step.description}</h4>
                <div className="step-metrics">
                  <span className="step-distance">{step.distance} km</span>
                  <span className="step-time">{step.estimatedTime}</span>
                </div>
              </div>
              
              <div className="step-details">
                <p className="step-description">{step.details}</p>
                
                <div className="step-tags">
                  <span 
                    className="activity-tag"
                    style={{ 
                      backgroundColor: getStepColor(step.activity) + '20',
                      color: getStepColor(step.activity),
                      borderColor: getStepColor(step.activity)
                    }}
                  >
                    {getActivityLabel(step.activity)}
                  </span>
                  
                  {step.activity === 'descanso' && (
                    <span className="mandatory-tag">
                      <i className="fas fa-exclamation-circle"></i>
                      30 min obligatorio
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="timeline-note">
        <i className="fas fa-info-circle"></i>
        <p>
          <strong>Nota:</strong> Los tiempos son estimados basados en velocidad promedio de 60 km/h 
          en carretera y considerando descansos obligatorios cada 4 horas.
        </p>
      </div>
    </div>
  );
}

export default RouteTimeline;