import React, { useState } from 'react';
import {
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const vehicleTypes = [
  { value: 'trailer-53ft', label: 'Tráiler 53 Pies', capacity: '20 ton' },
  { value: 'truck-40ft', label: 'Camión 40 Pies', capacity: '15 ton' },
  { value: 'van-35tons', label: 'Camioneta 3.5 Tons', capacity: '3.5 ton' },
  { value: 'pickup-35tons', label: 'Pickup 3.5 Tons', capacity: '1.5 ton' }
];

const priorities = [
  { value: 'cost', label: 'Menor Costo' },
  { value: 'time', label: 'Menor Tiempo' },
  { value: 'distance', label: 'Menor Kilometraje' },
  { value: 'safety', label: 'Mayor Seguridad' }
];

function RouteForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicleType: 'truck-40ft',
    cargoWeight: 5,
    cargoVolume: 10,
    startTime: '08:00',
    endTime: '20:00',
    priority: 'cost'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.origin.trim()) {
      newErrors.origin = 'El origen es requerido';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'El destino es requerido';
    }
    
    if (formData.cargoWeight <= 0) {
      newErrors.cargoWeight = 'El peso debe ser mayor a 0';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const selectedVehicle = vehicleTypes.find(v => v.value === formData.vehicleType);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        📋 Datos de la Ruta
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Complete todos los campos para que el agente de IA pueda analizar la ruta considerando restricciones de transporte pesado.
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Origen y Destino */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="primary" /> Puntos de Ruta
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Origen (Ej: CDMX)"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              error={!!errors.origin}
              helperText={errors.origin}
              required
              placeholder="Ciudad, estado o dirección"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Destino (Ej: Monterrey)"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              error={!!errors.destination}
              helperText={errors.destination}
              required
              placeholder="Ciudad, estado o dirección"
            />
          </Grid>

          {/* Tipo de Unidad y Carga */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon color="primary" /> Unidad y Carga
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Unidad</InputLabel>
              <Select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                label="Tipo de Unidad"
              >
                {vehicleTypes.map((vehicle) => (
                  <MenuItem key={vehicle.value} value={vehicle.value}>
                    {vehicle.label} ({vehicle.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedVehicle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Capacidad máxima: {selectedVehicle.capacity}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Typography gutterBottom>
              Peso: {formData.cargoWeight} toneladas
            </Typography>
            <Slider
              value={formData.cargoWeight}
              onChange={handleSliderChange('cargoWeight')}
              aria-labelledby="cargo-weight-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0.5}
              max={selectedVehicle?.capacity?.split(' ')[0] || 20}
            />
            {errors.cargoWeight && (
              <Typography color="error" variant="caption">{errors.cargoWeight}</Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Volumen (m³)"
              name="cargoVolume"
              type="number"
              value={formData.cargoVolume}
              onChange={handleChange}
              inputProps={{ min: 1, step: 0.1 }}
            />
          </Grid>

          {/* Ventana de Tiempo */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="primary" /> Ventana de Tiempo
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hora de Salida"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 minutos
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hora Límite de Llegada"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>

          {/* Prioridad */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" /> Prioridad del Viaje
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Prioridad"
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ px: 4 }}
              >
                {loading ? 'Analizando...' : '📊 Analizar Ruta con IA'}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
              El agente de IA validará restricciones de peso, tiempo y seguridad
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default RouteForm;