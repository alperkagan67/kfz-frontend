import { Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import SpeedIcon from '@mui/icons-material/Speed'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

function VehicleCard({ vehicle }) {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

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
        borderRadius: 2
      }}
    >
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
