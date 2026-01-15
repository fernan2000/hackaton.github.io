import React from 'react';
import './RouteSummary.css';

function RouteSummary({ summary }) {
  const calculateEfficiency = () => {
    const distanceScore = Math.min(100, summary.totalDistance / 10);
    const timeScore = Math.min(100, (24 - summary.totalTime) * 10);
    const costScore = Math.min(100, (50000 - summary.totalCost) / 500);
    return Math.round((distanceScore + timeScore + costScore) / 3);
  };

  const efficiencyScore = calculateEfficiency();
  
  const getEfficiencyClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const efficiencyClass = getEfficiencyClass(efficiencyScore);

  return (
    <div className="summary-card">
      <div className="summary-header">
        <h3>
          <i className="fas fa-chart-bar"></i>
          Resumen de la Ruta
        </h3>
      </div>
      
      <div className="efficiency-section">
        <div className="efficiency-header">
          <span className="efficiency-label">Eficiencia Operativa</span>
          <span className={`efficiency-score ${efficiencyClass}`}>
            {efficiencyScore}%
          </span>
        </div>
        <div className="efficiency-bar">
          <div 
            className={`efficiency-fill ${efficiencyClass}`}
            style={{ width: `${efficiencyScore}%` }}
          ></div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-icon distance">
            <i className="fas fa-route"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{summary.totalDistance} km</div>
            <div className="metric-label">Distancia Total</div>
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-icon time">
            <i className="fas fa-clock"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{summary.totalTime} h</div>
            <div className="metric-label">Tiempo Total</div>
            <div className="metric-sublabel">
              {summary.drivingTime}h manejo + {summary.restTime}h descanso
            </div>
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-icon fuel">
            <i className="fas fa-gas-pump"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{summary.fuelConsumption} L</div>
            <div className="metric-label">Combustible</div>
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-icon cost">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">${summary.totalCost.toLocaleString()}</div>
            <div className="metric-label">Costo Estimado</div>
          </div>
        </div>
      </div>
      
      <div className="breakdown-section">
        <h4 className="breakdown-title">
          <i className="fas fa-list-alt"></i>
          Desglose Detallado
        </h4>
        
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-label">Tiempo de Conducción:</span>
            <span className="breakdown-value">{summary.drivingTime} horas</span>
          </div>
          
          <div className="breakdown-item">
            <span className="breakdown-label">Tiempo de Descanso:</span>
            <span className="breakdown-value">{summary.restTime} horas</span>
          </div>
          
          <div className="breakdown-item">
            <span className="breakdown-label">Tiempo de Carga:</span>
            <span className="breakdown-value">{summary.loadingTime} horas</span>
          </div>
          
          <div className="breakdown-item">
            <span className="breakdown-label">Costo por Km:</span>
            <span className="breakdown-value">
              ${(summary.totalCost / summary.totalDistance).toFixed(2)} MXN
            </span>
          </div>
          
          <div className="breakdown-item">
            <span className="breakdown-label">Consumo por 100km:</span>
            <span className="breakdown-value">
              {((summary.fuelConsumption / summary.totalDistance) * 100).toFixed(1)} L
            </span>
          </div>
          
          <div className="breakdown-item">
            <span className="breakdown-label">Velocidad Promedio:</span>
            <span className="breakdown-value">
              {(summary.totalDistance / summary.drivingTime).toFixed(1)} km/h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteSummary;