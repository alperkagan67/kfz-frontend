/**
 * Vehicle Details Page
 *
 * KFZ-14: Frontend Vehicle Details Page
 *
 * Features:
 * - Display all vehicle information
 * - Image gallery with thumbnail navigation
 * - "Anfrage senden" button opens inquiry modal
 * - "Zurueck zur Liste" button
 * - 404 handling for non-existent vehicles
 * - Mobile responsive with swipeable images
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  ImageList,
  ImageListItem
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SpeedIcon from '@mui/icons-material/Speed'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import SettingsIcon from '@mui/icons-material/Settings'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import BoltIcon from '@mui/icons-material/Bolt'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import InquiryModal from '../components/InquiryModal'

const API_URL = 'http://localhost:3000'

function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State
  const [vehicle, setVehicle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)

  // Currency formatter
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/api/vehicles/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Fahrzeug nicht gefunden')
          } else {
            setError('Ein Fehler ist aufgetreten')
          }
          return
        }

        const data = await response.json()
        setVehicle(data)
      } catch (err) {
        setError('Verbindungsfehler. Bitte versuchen Sie es später erneut.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicle()
  }, [id])

  // Image navigation
  const handlePrevImage = () => {
    if (vehicle?.images?.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      )
    }
  }

  const handleNextImage = () => {
    if (vehicle?.images?.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-vehicle.jpg'
    if (imagePath.startsWith('http')) return imagePath
    return `${API_URL}/uploads/vehicles/${imagePath}`
  }

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} data-testid="loading-spinner" />
        <Typography sx={{ mt: 2 }}>Fahrzeug wird geladen...</Typography>
      </Container>
    )
  }

  // Error state (404)
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }} data-testid="error-container">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/vehicles"
          data-testid="back-to-list-button"
        >
          Zurück zur Fahrzeugliste
        </Button>
      </Container>
    )
  }

  // Main content
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/vehicles')}
        sx={{ mb: 3 }}
        data-testid="back-button"
      >
        Zurück zur Liste
      </Button>

      <Grid container spacing={4}>
        {/* Image Gallery */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {/* Main Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, md: 400 },
                overflow: 'hidden',
                borderRadius: 1,
                bgcolor: 'grey.100'
              }}
            >
              <Box
                component="img"
                src={
                  vehicle?.images?.length > 0
                    ? getImageUrl(vehicle.images[selectedImageIndex])
                    : '/placeholder-vehicle.jpg'
                }
                alt={`${vehicle?.brand} ${vehicle?.model}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                data-testid="main-image"
              />

              {/* Navigation arrows */}
              {vehicle?.images?.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    data-testid="prev-image-button"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    data-testid="next-image-button"
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </>
              )}

              {/* Image counter */}
              {vehicle?.images?.length > 1 && (
                <Chip
                  label={`${selectedImageIndex + 1} / ${vehicle.images.length}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white'
                  }}
                />
              )}
            </Box>

            {/* Thumbnail Gallery */}
            {vehicle?.images?.length > 1 && (
              <ImageList
                cols={Math.min(vehicle.images.length, 5)}
                gap={8}
                sx={{ mt: 2, mb: 0 }}
              >
                {vehicle.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      cursor: 'pointer',
                      border:
                        index === selectedImageIndex
                          ? '3px solid'
                          : '3px solid transparent',
                      borderColor:
                        index === selectedImageIndex
                          ? 'primary.main'
                          : 'transparent',
                      borderRadius: 1,
                      overflow: 'hidden',
                      opacity: index === selectedImageIndex ? 1 : 0.6,
                      '&:hover': { opacity: 1 }
                    }}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${vehicle.brand} ${vehicle.model} - Bild ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 60,
                        objectFit: 'cover'
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>

        {/* Vehicle Info */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            {/* Title & Price */}
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              data-testid="vehicle-title"
            >
              {vehicle?.brand} {vehicle?.model}
            </Typography>

            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              gutterBottom
              data-testid="vehicle-price"
            >
              {vehicle?.price ? formatter.format(vehicle.price) : 'Preis auf Anfrage'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Key Specs */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {vehicle?.year && (
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`EZ ${vehicle.year}`}
                  variant="outlined"
                  data-testid="vehicle-year"
                />
              )}
              {vehicle?.mileage !== undefined && (
                <Chip
                  icon={<SpeedIcon />}
                  label={`${(vehicle.mileage / 1000).toFixed(0)} tkm`}
                  variant="outlined"
                  data-testid="vehicle-mileage"
                />
              )}
              {vehicle?.fuelType && (
                <Chip
                  icon={<LocalGasStationIcon />}
                  label={vehicle.fuelType}
                  variant="outlined"
                  data-testid="vehicle-fuel"
                />
              )}
            </Box>

            {/* Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fahrzeugdetails
              </Typography>

              <Grid container spacing={2}>
                {vehicle?.power && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BoltIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Leistung
                        </Typography>
                        <Typography variant="body1" data-testid="vehicle-power">
                          {vehicle.power}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {vehicle?.transmission && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SettingsIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Getriebe
                        </Typography>
                        <Typography variant="body1" data-testid="vehicle-transmission">
                          {vehicle.transmission}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {vehicle?.color && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ColorLensIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Farbe
                        </Typography>
                        <Typography variant="body1" data-testid="vehicle-color">
                          {vehicle.color}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Description */}
            {vehicle?.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Beschreibung
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  data-testid="vehicle-description"
                >
                  {vehicle.description}
                </Typography>
              </Box>
            )}

            {/* Features */}
            {vehicle?.features?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ausstattung
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {vehicle.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                      data-testid={`feature-${index}`}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                onClick={() => setInquiryModalOpen(true)}
                fullWidth
                data-testid="inquiry-button"
              >
                Anfrage senden
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        vehicleId={vehicle?.id}
        vehicleName={`${vehicle?.brand} ${vehicle?.model}`}
      />
    </Container>
  )
}

export default VehicleDetails
