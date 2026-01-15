import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RouteForm from './components/RouteForm';
import RouteAnalysis from './components/RouteAnalysis';
import RouteTimeline from './components/RouteTimeline';
import RouteSummary from './components/RouteSummary';
import routePlanningAgent from './services/RoutePlanningAgent';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a3a8f', // Azul Traxión
    },
    secondary: {
      main: '#f0b429', // Amarillo Traxión
    },
  },
});

const steps = ['Datos de la Ruta', 'Análisis IA', 'Resultados'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [routeData, setRouteData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRouteSubmit = async (data) => {
    setRouteData(data);
    setLoading(true);
    setError(null);

    try {
      const analysisResult = await routePlanningAgent.analyzeRoute(data);
      setAnalysis(analysisResult);
      setActiveStep(1);
    } catch (err) {
      setError('Error al analizar la ruta. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setRouteData(null);
    setAnalysis(null);
    setError(null);
  };

  const handleExport = () => {
    const exportData = {
      routeData,
      analysis,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruta-traxion-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            🚚 Traxión Route Planner
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Agente de IA para Planeación de Rutas de Transporte Pesado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Diseña rutas operativas razonables y consistentes para PyMEs de transporte
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>El agente de IA está analizando la ruta...</Typography>
          </Box>
        )}

        {/* Content */}
        <Grid container spacing={3}>
          {/* Left Column - Form/Analysis */}
          <Grid item xs={12} md={6}>
            {activeStep === 0 && (
              <RouteForm onSubmit={handleRouteSubmit} loading={loading} />
            )}

            {activeStep >= 1 && analysis && (
              <RouteAnalysis analysis={analysis} />
            )}
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} md={6}>
            {activeStep >= 1 && analysis && (
              <>
                <RouteSummary summary={analysis.routeSummary} />
                <RouteTimeline timeline={analysis.timeline} />
                
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      🎯 Estado de Viabilidad
                    </Typography>
                    <Alert 
                      severity={
                        analysis.feasibility === 'viable' ? 'success' : 
                        analysis.feasibility === 'no viable' ? 'error' : 'warning'
                      }
                      sx={{ mb: 2 }}
                    >
                      {analysis.feasibility === 'viable' ? '✅ RUTA VIABLE' :
                       analysis.feasibility === 'no viable' ? '❌ RUTA NO VIABLE' :
                       '⚠️ RUTA REQUIERE AJUSTES'}
                    </Alert>
                    
                    <Typography variant="body2" color="text.secondary">
                      {analysis.feasibility === 'viable' 
                        ? 'Esta ruta cumple con todas las restricciones operativas y es viable para ejecución.'
                        : analysis.feasibility === 'no viable'
                        ? 'Esta ruta presenta problemas críticos que impiden su ejecución segura.'
                        : 'Esta ruta es viable con algunos ajustes en la planificación.'}
                    </Typography>
                  </CardContent>
                </Card>
              </>
            )}
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
          >
            Reiniciar
          </Button>
          
          {activeStep >= 1 && analysis && (
            <Box>
              <Button
                variant="contained"
                onClick={() => setActiveStep(0)}
                sx={{ mr: 2 }}
              >
                Nueva Ruta
              </Button>
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon="📋"
              >
                Exportar Análisis
              </Button>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Hackatón BÉCALOS TRAXIÓN TECH CHALLENGE 2025 | Eje 1 · Planeación básica de rutas operativas
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Agente de IA especializado en logística de transporte pesado
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;