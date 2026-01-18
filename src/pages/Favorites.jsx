/**
 * Favorites Page
 *
 * KFZ-19: Favoriten-System
 *
 * Shows all vehicles marked as favorites by the user.
 */

import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import VehicleCard from '../components/VehicleCard'
import { useFavorites } from '../context/FavoritesContext'
import { vehicles as allVehicles } from '../data/vehicles'

function Favorites() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites()

  // Get full vehicle data for favorites
  const favoriteVehicles = useMemo(() => {
    return allVehicles.filter(vehicle => favorites.includes(vehicle.id))
  }, [favorites])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FavoriteIcon sx={{ fontSize: 40, color: 'error.main' }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold' }}
          >
            Meine Favoriten
          </Typography>
        </Box>

        {favoritesCount > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={clearFavorites}
            data-testid="clear-favorites"
          >
            Alle entfernen
          </Button>
        )}
      </Box>

      {favoriteVehicles.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <FavoriteIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            Keine Favoriten vorhanden
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Sie haben noch keine Fahrzeuge zu Ihren Favoriten hinzugefuegt.
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
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {favoritesCount} {favoritesCount === 1 ? 'Fahrzeug' : 'Fahrzeuge'} in Ihren Favoriten
          </Typography>

          <Grid container spacing={3}>
            {favoriteVehicles.map(vehicle => (
              <Grid item key={vehicle.id} xs={12} sm={6} md={4} lg={3}>
                <VehicleCard vehicle={vehicle} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  )
}

export default Favorites
