/**
 * Vehicle List Page
 *
 * KFZ-18: Integration mit VehicleFilters Komponente
 *
 * Features:
 * - Erweiterte Filter ueber VehicleFilters Komponente
 * - API-Integration fuer Fahrzeuge
 * - Pagination
 * - Sort-Dropdown
 * - Loading & Error States
 */

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material'
import VehicleCard from '../components/VehicleCard'
import VehicleFilters from '../components/VehicleFilters'
import { vehicles as mockVehicles } from '../data/vehicles'

// Simulated API call (replace with actual API when backend is ready)
async function fetchVehicles(filters) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  let result = [...mockVehicles]

  // Apply filters
  if (filters.q) {
    const searchLower = filters.q.toLowerCase()
    result = result.filter(v =>
      v.brand.toLowerCase().includes(searchLower) ||
      v.model.toLowerCase().includes(searchLower)
    )
  }

  if (filters.brands && filters.brands.length > 0) {
    result = result.filter(v => filters.brands.includes(v.brand))
  }

  if (filters.minPrice) {
    result = result.filter(v => v.price >= filters.minPrice)
  }

  if (filters.maxPrice) {
    result = result.filter(v => v.price <= filters.maxPrice)
  }

  if (filters.minYear) {
    result = result.filter(v => v.year >= filters.minYear)
  }

  if (filters.maxYear) {
    result = result.filter(v => v.year <= filters.maxYear)
  }

  if (filters.minMileage) {
    result = result.filter(v => v.mileage >= filters.minMileage)
  }

  if (filters.maxMileage) {
    result = result.filter(v => v.mileage <= filters.maxMileage)
  }

  if (filters.fuel && filters.fuel.length > 0) {
    result = result.filter(v => filters.fuel.includes(v.fuelType?.toLowerCase()))
  }

  // Sort
  const sortBy = filters.sort || 'price_asc'
  result.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'year_desc':
        return b.year - a.year
      case 'year_asc':
        return a.year - b.year
      case 'mileage_asc':
        return a.mileage - b.mileage
      case 'mileage_desc':
        return b.mileage - a.mileage
      default:
        return 0
    }
  })

  return {
    vehicles: result,
    total: result.length
  }
}

function VehicleList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price_asc')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)

  const itemsPerPage = 12

  // Handle filter changes from VehicleFilters component
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }, [])

  // Handle sort change
  const handleSortChange = (event) => {
    const newSort = event.target.value
    setSortBy(newSort)

    // Update URL params
    const params = new URLSearchParams(searchParams)
    if (newSort !== 'price_asc') {
      params.set('sort', newSort)
    } else {
      params.delete('sort')
    }
    setSearchParams(params, { replace: true })
  }

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)

    // Update URL params
    const params = new URLSearchParams(searchParams)
    if (newPage > 1) {
      params.set('page', newPage.toString())
    } else {
      params.delete('page')
    }
    setSearchParams(params, { replace: true })

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Fetch vehicles when filters change
  useEffect(() => {
    let isCancelled = false

    async function loadVehicles() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchVehicles({
          ...filters,
          sort: sortBy
        })

        if (!isCancelled) {
          setVehicles(result.vehicles)
          setTotalCount(result.total)
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Fehler beim Laden der Fahrzeuge. Bitte versuchen Sie es erneut.')
          console.error('Error loading vehicles:', err)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadVehicles()

    return () => {
      isCancelled = true
    }
  }, [filters, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(vehicles.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + itemsPerPage)

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

      {/* Filter Component */}
      <VehicleFilters
        onFiltersChange={handleFiltersChange}
        vehicleCount={totalCount}
        isLoading={isLoading}
      />

      {/* Sort Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <TextField
          select
          value={sortBy}
          onChange={handleSortChange}
          size="small"
          sx={{ minWidth: 200 }}
          label="Sortieren nach"
          data-testid="sort-select"
        >
          <MenuItem value="price_asc">Preis aufsteigend</MenuItem>
          <MenuItem value="price_desc">Preis absteigend</MenuItem>
          <MenuItem value="year_desc">Neuste zuerst</MenuItem>
          <MenuItem value="year_asc">Aelteste zuerst</MenuItem>
          <MenuItem value="mileage_asc">Kilometerstand aufsteigend</MenuItem>
          <MenuItem value="mileage_desc">Kilometerstand absteigend</MenuItem>
        </TextField>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Vehicle Grid */}
      {!isLoading && !error && (
        <>
          <Grid container spacing={3}>
            {paginatedVehicles.map(vehicle => (
              <Grid item key={vehicle.id} xs={12} sm={6} md={4} lg={3}>
                <VehicleCard vehicle={vehicle} />
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {paginatedVehicles.length === 0 && (
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
                Bitte versuchen Sie es mit anderen Filterkriterien
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                data-testid="pagination"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default VehicleList
