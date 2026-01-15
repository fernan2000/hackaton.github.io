class RoutePlanningAgent {
  constructor() {
    this.operationalRules = {
      maxDrivingHours: 10,
      mandatoryBreakAfterHours: 4,
      breakDurationMinutes: 30,
      averageSpeedHighway: 60,
      averageSpeedCity: 30,
      fuelConsumptionRates: {
        'trailer-53ft': 2.3,
        'truck-40ft': 2.8,
        'van-35tons': 3.5,
        'pickup-35tons': 6.0
      },
      maxCargoWeights: {
        'trailer-53ft': 20,
        'truck-40ft': 15,
        'van-35tons': 3.5,
        'pickup-35tons': 1.5
      }
    };
  }

  async analyzeRoute(routeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis = this.performDetailedAnalysis(routeData);
        resolve(analysis);
      }, 1500);
    });
  }

  performDetailedAnalysis(routeData) {
    const distance = this.calculateDistance(routeData.origin, routeData.destination);
    const maxWeight = this.operationalRules.maxCargoWeights[routeData.vehicleType];
    
    let warnings = [];
    let feasibility = "viable";
    
    if (routeData.cargoWeight > maxWeight) {
      warnings.push(`⚠️ ADVERTENCIA: La carga (${routeData.cargoWeight}t) excede la capacidad máxima de la unidad (${maxWeight}t)`);
      feasibility = "no viable";
    }
    
    const pureDrivingTime = distance / this.operationalRules.averageSpeedHighway;
    const requiredBreaks = Math.floor(pureDrivingTime / this.operationalRules.mandatoryBreakAfterHours);
    const restTime = requiredBreaks * (this.operationalRules.breakDurationMinutes / 60);
    const loadingTime = Math.ceil(routeData.cargoWeight / 5);
    
    const totalTime = pureDrivingTime + restTime + loadingTime;
    
    const fuelRate = this.operationalRules.fuelConsumptionRates[routeData.vehicleType];
    const fuelConsumption = distance / fuelRate;
    const fuelCost = fuelConsumption * 22.5;
    
    const timeline = this.generateTimeline(routeData, distance, pureDrivingTime, requiredBreaks);
    
    return {
      analysis: this.generateAnalysisText(routeData, distance, pureDrivingTime, restTime, loadingTime),
      routeSummary: {
        totalDistance: Math.round(distance),
        totalTime: Math.round(totalTime * 10) / 10,
        drivingTime: Math.round(pureDrivingTime * 10) / 10,
        restTime: Math.round(restTime * 10) / 10,
        loadingTime,
        fuelConsumption: Math.round(fuelConsumption),
        totalCost: Math.round(fuelCost + (totalTime * 500))
      },
      timeline,
      assumptions: [
        "Velocidad promedio en carretera: 60 km/h",
        "Velocidad en zona urbana: 30 km/h",
        "Tiempo de carga: 1 hora por cada 5 toneladas",
        "Descanso obligatorio: 30 minutos cada 4 horas de conducción",
        "Precio del diesel: $22.50 por litro",
        "Costo operativo del conductor: $500 por hora"
      ],
      warnings,
      recommendations: this.generateRecommendations(routeData, distance, totalTime),
      feasibility
    };
  }

  calculateDistance(origin, destination) {
    const routeDistances = {
      'CDMX-Monterrey': 900,
      'CDMX-Guadalajara': 540,
      'Guadalajara-Monterrey': 800,
      'CDMX-Puebla': 130,
      'Monterrey-Nuevo Laredo': 220
    };
    
    const key = `${origin}-${destination}`;
    return routeDistances[key] || 300;
  }

  generateTimeline(routeData, distance, drivingTime, breaks) {
    const timeline = [];
    let accumulatedDistance = 0;
    let accumulatedTime = 0;
    const segmentDistance = distance / (breaks + 1);
    
    timeline.push({
      step: 1,
      description: `Salida de ${routeData.origin}`,
      distance: 0,
      estimatedTime: routeData.startTime,
      activity: "inicio",
      details: "Inicio del viaje. Verificación de carga y documentos."
    });
    
    for (let i = 1; i <= breaks; i++) {
      accumulatedDistance += segmentDistance;
      accumulatedTime += segmentDistance / this.operationalRules.averageSpeedHighway;
      
      timeline.push({
        step: timeline.length + 1,
        description: `Segmento de conducción ${i}`,
        distance: Math.round(accumulatedDistance),
        estimatedTime: this.addHours(routeData.startTime, accumulatedTime),
        activity: "conduccion",
        details: `Conducción continua. Velocidad promedio: ${this.operationalRules.averageSpeedHighway} km/h`
      });
      
      timeline.push({
        step: timeline.length + 1,
        description: `Parada de descanso obligatorio ${i}`,
        distance: Math.round(accumulatedDistance),
        estimatedTime: this.addHours(routeData.startTime, accumulatedTime),
        activity: "descanso",
        details: "Descanso de 30 minutos. Revisión básica del vehículo."
      });
      
      accumulatedTime += 0.5;
    }
    
    timeline.push({
      step: timeline.length + 1,
      description: `Llegada a ${routeData.destination}`,
      distance: Math.round(distance),
      estimatedTime: this.addHours(routeData.startTime, drivingTime + (breaks * 0.5)),
      activity: "llegada",
      details: "Llegada al destino. Inicio de descarga."
    });
    
    return timeline;
  }

  generateAnalysisText(routeData, distance, drivingTime, restTime, loadingTime) {
    return `ANÁLISIS DETALLADO DE RUTA:

1. VALIDACIÓN INICIAL:
   - Unidad seleccionada: ${routeData.vehicleType}
   - Capacidad máxima: ${this.operationalRules.maxCargoWeights[routeData.vehicleType]} toneladas
   - Peso de carga: ${routeData.cargoWeight} toneladas
   - Estado: ${routeData.cargoWeight <= this.operationalRules.maxCargoWeights[routeData.vehicleType] ? "✅ APROBADO" : "❌ EXCEDIDO"}

2. CÁLCULO DE DISTANCIA:
   - Ruta: ${routeData.origin} → ${routeData.destination}
   - Distancia estimada: ${Math.round(distance)} km
   - Tipo de camino: 90% carretera, 10% zona urbana

3. CÁLCULO DE TIEMPOS:
   - Tiempo de conducción pura: ${Math.round(drivingTime * 10) / 10} horas
   - Descansos obligatorios: ${Math.round(restTime * 10) / 10} horas (${Math.floor(drivingTime / 4)} paradas)
   - Tiempo de carga/descarga: ${loadingTime} horas
   - TIEMPO TOTAL ESTIMADO: ${Math.round((drivingTime + restTime + loadingTime) * 10) / 10} horas

4. VIABILIDAD EN VENTANA DE TIEMPO:
   - Hora de salida: ${routeData.startTime}
   - Hora estimada de llegada: ${this.addHours(routeData.startTime, drivingTime + restTime + loadingTime)}
   - Límite de llegada: ${routeData.endTime}
   - Estado: ${this.checkTimeFeasibility(routeData, drivingTime + restTime + loadingTime)}

5. CONSIDERACIONES OPERATIVAS:
   - Consumo estimado de combustible: ${Math.round(distance / this.operationalRules.fuelConsumptionRates[routeData.vehicleType])} litros
   - Costo estimado de combustible: $${Math.round((distance / this.operationalRules.fuelConsumptionRates[routeData.vehicleType]) * 22.5)} MXN
   - Costo total estimado: $${Math.round((distance / this.operationalRules.fuelConsumptionRates[routeData.vehicleType]) * 22.5 + (drivingTime + restTime + loadingTime) * 500)} MXN`;
  }

  generateRecommendations(routeData, distance, totalTime) {
    const recommendations = [];
    
    if (totalTime > 8) {
      recommendations.push("Considerar conductor de relevo para viajes largos");
    }
    
    if (distance > 500) {
      recommendations.push("Programar inspección técnica antes del viaje");
    }
    
    if (routeData.cargoWeight > 10) {
      recommendations.push("Verificar permisos especiales de carga pesada");
    }
    
    recommendations.push("Llevar registro electrónico de horas de servicio");
    recommendations.push("Planificar paradas en gasolineras con servicio para trailers");
    
    return recommendations;
  }

  addHours(startTime, hours) {
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + Math.round(hours * 60);
    const newHour = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
  }

  checkTimeFeasibility(routeData, totalHours) {
    const [startHour, startMinute] = routeData.startTime.split(':').map(Number);
    const [endHour, endMinute] = routeData.endTime.split(':').map(Number);
    
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const arrivalTotal = startTotal + totalHours * 60;
    
    return arrivalTotal <= endTotal ? "✅ FACTIBLE" : "⚠️ AJUSTES REQUERIDOS";
  }
}

// Crear instancia y exportarla
const routePlanningAgent = new RoutePlanningAgent();
export default routePlanningAgent;