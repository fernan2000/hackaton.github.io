import React from 'react';
import './RouteAnalysis.css';

function RouteAnalysis({ analysis }) {
  return (
    <div className="analysis-card">
      <div className="analysis-header">
        <h3>
          <i className="fas fa-brain"></i>
          Análisis del Agente IA
        </h3>
        <p className="analysis-subtitle">
          El agente de IA actúa como un ingeniero senior de planeación
        </p>
      </div>
      
      <div className="analysis-content">
        <div className="analysis-text">
          {analysis.analysis.split('\n').map((line, index) => (
            <p key={index} className="analysis-line">
              {line}
            </p>
          ))}
        </div>
        
        {analysis.warnings && analysis.warnings.length > 0 && (
          <div className="analysis-warnings">
            <div className="warning-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h4>Advertencias del Sistema</h4>
            </div>
            <ul className="warning-list">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="warning-item">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="analysis-recommendations">
            <div className="recommendation-header">
              <i className="fas fa-lightbulb"></i>
              <h4>Recomendaciones Operativas</h4>
            </div>
            <ul className="recommendation-list">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="recommendation-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="analysis-assumptions">
          <div className="assumption-header">
            <i className="fas fa-info-circle"></i>
            <h4>Supuestos Aplicados</h4>
          </div>
          <div className="assumption-tags">
            {analysis.assumptions.map((assumption, index) => (
              <span key={index} className="assumption-tag">
                {assumption}
              </span>
            ))}
          </div>
        </div>
        
        <div className="analysis-methodology">
          <p className="methodology-text">
            <strong>Metodología del Agente:</strong> Validación de peso → Cálculo de tiempos → 
            Aplicación de descansos → Verificación de ventana → Análisis de viabilidad
          </p>
        </div>
      </div>
    </div>
  );
}

export default RouteAnalysis;