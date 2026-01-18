import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Grid, 
  Box,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VehicleCard from '../components/VehicleCard'
import { vehicles } from '../data/vehicles'

function VehicleList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price_asc')

  const filteredVehicles = vehicles
    .filter(vehicle => 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'year_desc':
          return b.year - a.year
        case 'mileage_asc':
          return a.mileage - b.mileage
        default:
          return 0
      }
    })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4
        }}
      >
        Unsere Fahrzeuge
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Suchen Sie nach Marke oder Modell..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="price_asc">Preis aufsteigend</MenuItem>
          <MenuItem value="price_desc">Preis absteigend</MenuItem>
          <MenuItem value="year_desc">Neuste zuerst</MenuItem>
          <MenuItem value="mileage_asc">Kilometerstand aufsteigend</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredVehicles.map(vehicle => (
          <Grid item key={vehicle.id} xs={12} sm={6} md={4} lg={3}>
            <VehicleCard vehicle={vehicle} />
          </Grid>
        ))}
      </Grid>

      {filteredVehicles.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6">
            Keine Fahrzeuge gefunden
          </Typography>
          <Typography>
            Bitte versuchen Sie es mit anderen Suchkriterien
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default VehicleList
