/**
 * Vehicle Comparison Page
 *
 * KFZ-20: Fahrzeugvergleich
 *
 * Shows up to 3 vehicles side by side for comparison.
 */

import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import RemoveIcon from '@mui/icons-material/Remove'
import { useCompare } from '../context/CompareContext'
import { vehicles as allVehicles } from '../data/vehicles'

// Comparison attributes
const COMPARE_ATTRIBUTES = [
  { key: 'price', label: 'Preis', format: (v) => formatPrice(v) },
  { key: 'year', label: 'Baujahr', format: (v) => v },
  { key: 'mileage', label: 'Kilometerstand', format: (v) => `${(v/1000).toFixed(0)} tkm` },
  { key: 'fuelType', label: 'Kraftstoff', format: (v) => v },
  { key: 'power', label: 'Leistung', format: (v) => v },
  { key: 'transmission', label: 'Getriebe', format: (v) => v },
  { key: 'color', label: 'Farbe', format: (v) => v }
]

function formatPrice(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)
}

function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  // Get full vehicle data for comparison
  const compareVehicles = useMemo(() => {
    return compareList
      .map(id => allVehicles.find(v => v.id === id))
      .filter(Boolean)
  }, [compareList])

  // Find best values for highlighting
  const bestValues = useMemo(() => {
    const best = {}
    if (compareVehicles.length >= 2) {
      // Lowest price is best
      const prices = compareVehicles.map(v => v.price)
      best.price = Math.min(...prices)

      // Newest year is best
      const years = compareVehicles.map(v => v.year)
      best.year = Math.max(...years)

      // Lowest mileage is best
      const mileages = compareVehicles.map(v => v.mileage)
      best.mileage = Math.min(...mileages)
    }
    return best
  }, [compareVehicles])

  // Check if value is the best
  const isBestValue = (key, value) => {
    if (key === 'price') return value === bestValues.price
    if (key === 'year') return value === bestValues.year
    if (key === 'mileage') return value === bestValues.mileage
    return false
  }

  // Get all unique features from all vehicles
  const allFeatures = useMemo(() => {
    const features = new Set()
    compareVehicles.forEach(v => {
      v.features?.forEach(f => features.add(f))
    })
    return Array.from(features).sort()
  }, [compareVehicles])

  if (compareVehicles.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Fahrzeugvergleich
          </Typography>
        </Box>

        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <CompareArrowsIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            Keine Fahrzeuge zum Vergleichen
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Waehlen Sie bis zu 3 Fahrzeuge aus der Liste zum Vergleichen.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/vehicles"
            startIcon={<DirectionsCarIcon />}
            size="large"
            sx={{ mt: 2 }}
          >
            Fahrzeuge durchstoebern
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Fahrzeugvergleich
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          onClick={clearCompare}
          data-testid="clear-compare"
        >
          Vergleich leeren
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            minWidth: 150
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                Eigenschaft
              </TableCell>
              {compareVehicles.map(vehicle => (
                <TableCell
                  key={vehicle.id}
                  sx={{ fontWeight: 'bold', bgcolor: 'grey.100', position: 'relative' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {vehicle.brand}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.model}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCompare(vehicle.id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4
                      }}
                      aria-label={`${vehicle.brand} ${vehicle.model} entfernen`}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Main attributes */}
            {COMPARE_ATTRIBUTES.map(attr => (
              <TableRow key={attr.key} hover>
                <TableCell sx={{ fontWeight: 'medium', bgcolor: 'grey.50' }}>
                  {attr.label}
                </TableCell>
                {compareVehicles.map(vehicle => {
                  const value = vehicle[attr.key]
                  const isBest = isBestValue(attr.key, value)
                  return (
                    <TableCell
                      key={vehicle.id}
                      sx={{
                        bgcolor: isBest ? 'success.50' : 'inherit',
                        fontWeight: isBest ? 'bold' : 'normal',
                        color: isBest ? 'success.dark' : 'inherit'
                      }}
                    >
                      {attr.format(value)}
                      {isBest && (
                        <CheckIcon
                          sx={{ ml: 1, fontSize: 16, color: 'success.main' }}
                        />
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}

            {/* Features comparison */}
            {allFeatures.length > 0 && (
              <>
                <TableRow>
                  <TableCell
                    colSpan={compareVehicles.length + 1}
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}
                  >
                    Ausstattung
                  </TableCell>
                </TableRow>
                {allFeatures.map(feature => (
                  <TableRow key={feature} hover>
                    <TableCell sx={{ bgcolor: 'grey.50' }}>{feature}</TableCell>
                    {compareVehicles.map(vehicle => {
                      const hasFeature = vehicle.features?.includes(feature)
                      return (
                        <TableCell
                          key={vehicle.id}
                          align="center"
                          sx={{
                            bgcolor: hasFeature ? 'success.50' : 'inherit'
                          }}
                        >
                          {hasFeature ? (
                            <CheckIcon sx={{ color: 'success.main' }} />
                          ) : (
                            <RemoveIcon sx={{ color: 'grey.400' }} />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {compareVehicles.length < 3 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sie koennen noch {3 - compareVehicles.length} weitere{' '}
            {3 - compareVehicles.length === 1 ? 'Fahrzeug' : 'Fahrzeuge'} hinzufuegen
          </Typography>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/vehicles"
            startIcon={<DirectionsCarIcon />}
            sx={{ mt: 1 }}
          >
            Weitere Fahrzeuge waehlen
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default Compare
