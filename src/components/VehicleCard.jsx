/**
 * Vehicle Card Component
 *
 * KFZ-19: Added favorite button with heart icon
 * KFZ-20: Added compare checkbox
 */

import { Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Zoom,
  Checkbox
} from '@mui/material'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import SpeedIcon from '@mui/icons-material/Speed'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { useFavorites } from '../context/FavoritesContext'
import { useCompare } from '../context/CompareContext'

function VehicleCard({ vehicle }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isInCompare, toggleCompare, canAddMore } = useCompare()
  const isVehicleFavorite = isFavorite(vehicle.id)
  const isVehicleInCompare = isInCompare(vehicle.id)

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(vehicle.id)
  }

  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(vehicle.id)
  }

  const compareDisabled = !isVehicleInCompare && !canAddMore

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8
        },
        borderRadius: 2,
        position: 'relative',
        border: isVehicleInCompare ? '2px solid' : 'none',
        borderColor: isVehicleInCompare ? 'primary.main' : 'transparent'
      }}
    >
      {/* Action Buttons Container */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}
      >
        {/* Favorite Button */}
        <Tooltip
          title={isVehicleFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufuegen'}
          TransitionComponent={Zoom}
          placement="left"
        >
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
            data-testid="favorite-button"
            aria-label={isVehicleFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufuegen'}
          >
            {isVehicleFavorite ? (
              <FavoriteIcon sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: 'grey.600' }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Compare Checkbox */}
        <Tooltip
          title={
            compareDisabled
              ? 'Maximal 3 Fahrzeuge zum Vergleich'
              : isVehicleInCompare
              ? 'Aus Vergleich entfernen'
              : 'Zum Vergleich hinzufuegen'
          }
          TransitionComponent={Zoom}
          placement="left"
        >
          <span>
            <IconButton
              onClick={handleCompareClick}
              disabled={compareDisabled}
              sx={{
                bgcolor: isVehicleInCompare
                  ? 'primary.main'
                  : 'rgba(255, 255, 255, 0.9)',
                color: isVehicleInCompare ? 'white' : 'grey.600',
                '&:hover': {
                  bgcolor: isVehicleInCompare
                    ? 'primary.dark'
                    : 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(200, 200, 200, 0.5)'
                },
                transition: 'all 0.2s'
              }}
              data-testid="compare-button"
              aria-label={isVehicleInCompare ? 'Aus Vergleich entfernen' : 'Zum Vergleich hinzufuegen'}
            >
              <CompareArrowsIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <CardActionArea
        component={RouterLink}
        to={`/vehicles/${vehicle.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
      <CardMedia
        component="img"
        height="200"
        image={vehicle.image}
        alt={`${vehicle.brand} ${vehicle.model}`}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          {vehicle.brand} {vehicle.model}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          {formatter.format(vehicle.price)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<CalendarTodayIcon />}
            label={vehicle.year}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<SpeedIcon />}
            label={`${(vehicle.mileage/1000).toFixed(0)}tkm`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<LocalGasStationIcon />}
            label={vehicle.fuelType}
            size="small"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Leistung:</strong> {vehicle.power}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Getriebe:</strong> {vehicle.transmission}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Farbe:</strong> {vehicle.color}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {vehicle.features.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
          ))}
        </Box>
      </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default VehicleCard
