/**
 * Vehicle Filters Component
 *
 * KFZ-18: Suchfilter Komponente
 *
 * Features:
 * - Filter-Panel mit Marke, Preis-Range, Jahr-Range
 * - Slider fuer Preis und Kilometerstand
 * - Checkbox fuer Kraftstofftyp
 * - Filter in URL-Params gespeichert
 * - Reset-Button
 * - Mobile: Ausklappbares Panel
 * - Live-Anzeige der gefundenen Fahrzeuge
 * - Debounced API-Calls
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Collapse,
  IconButton,
  Divider,
  InputAdornment,
  Autocomplete,
  useMediaQuery,
  useTheme
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Available brands (could come from API)
const AVAILABLE_BRANDS = [
  'Audi', 'BMW', 'Ford', 'Honda', 'Mercedes', 'Opel', 'Toyota', 'VW'
]

// Fuel types
const FUEL_TYPES = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'elektro', label: 'Elektro' },
  { value: 'hybrid', label: 'Hybrid' }
]

// Price/mileage ranges
const PRICE_MIN = 0
const PRICE_MAX = 100000
const MILEAGE_MIN = 0
const MILEAGE_MAX = 300000
const YEAR_MIN = 2010
const YEAR_MAX = new Date().getFullYear()

function VehicleFilters({ onFiltersChange, vehicleCount, isLoading }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [searchParams, setSearchParams] = useSearchParams()

  // Panel open state
  const [isOpen, setIsOpen] = useState(!isMobile)

  // Filter states - initialize from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brands')?.split(',').filter(Boolean) || []
  )
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || PRICE_MIN,
    parseInt(searchParams.get('maxPrice')) || PRICE_MAX
  ])
  const [yearRange, setYearRange] = useState([
    parseInt(searchParams.get('minYear')) || YEAR_MIN,
    parseInt(searchParams.get('maxYear')) || YEAR_MAX
  ])
  const [mileageRange, setMileageRange] = useState([
    parseInt(searchParams.get('minMileage')) || MILEAGE_MIN,
    parseInt(searchParams.get('maxMileage')) || MILEAGE_MAX
  ])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState(
    searchParams.get('fuel')?.split(',').filter(Boolean) || []
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price_asc')

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Build filters object
  const filters = useMemo(() => ({
    q: debouncedSearchTerm || undefined,
    brands: selectedBrands.length > 0 ? selectedBrands : undefined,
    minPrice: priceRange[0] > PRICE_MIN ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < PRICE_MAX ? priceRange[1] : undefined,
    minYear: yearRange[0] > YEAR_MIN ? yearRange[0] : undefined,
    maxYear: yearRange[1] < YEAR_MAX ? yearRange[1] : undefined,
    minMileage: mileageRange[0] > MILEAGE_MIN ? mileageRange[0] : undefined,
    maxMileage: mileageRange[1] < MILEAGE_MAX ? mileageRange[1] : undefined,
    fuel: selectedFuelTypes.length > 0 ? selectedFuelTypes : undefined,
    sort: sortBy !== 'price_asc' ? sortBy : undefined
  }), [debouncedSearchTerm, selectedBrands, priceRange, yearRange, mileageRange, selectedFuelTypes, sortBy])

  // Update URL params and notify parent
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.q) params.set('q', filters.q)
    if (filters.brands) params.set('brands', filters.brands.join(','))
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.minYear) params.set('minYear', filters.minYear.toString())
    if (filters.maxYear) params.set('maxYear', filters.maxYear.toString())
    if (filters.minMileage) params.set('minMileage', filters.minMileage.toString())
    if (filters.maxMileage) params.set('maxMileage', filters.maxMileage.toString())
    if (filters.fuel) params.set('fuel', filters.fuel.join(','))
    if (filters.sort) params.set('sort', filters.sort)

    setSearchParams(params, { replace: true })
    onFiltersChange?.(filters)
  }, [filters, setSearchParams, onFiltersChange])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm ||
      selectedBrands.length > 0 ||
      priceRange[0] > PRICE_MIN ||
      priceRange[1] < PRICE_MAX ||
      yearRange[0] > YEAR_MIN ||
      yearRange[1] < YEAR_MAX ||
      mileageRange[0] > MILEAGE_MIN ||
      mileageRange[1] < MILEAGE_MAX ||
      selectedFuelTypes.length > 0
    )
  }, [searchTerm, selectedBrands, priceRange, yearRange, mileageRange, selectedFuelTypes])

  // Reset all filters
  const handleReset = useCallback(() => {
    setSearchTerm('')
    setSelectedBrands([])
    setPriceRange([PRICE_MIN, PRICE_MAX])
    setYearRange([YEAR_MIN, YEAR_MAX])
    setMileageRange([MILEAGE_MIN, MILEAGE_MAX])
    setSelectedFuelTypes([])
    setSortBy('price_asc')
  }, [])

  // Format price for display
  const formatPrice = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format mileage for display
  const formatMileage = (value) => {
    return `${(value / 1000).toFixed(0)} tkm`
  }

  // Handle fuel type toggle
  const handleFuelToggle = (fuelType) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuelType)
        ? prev.filter((f) => f !== fuelType)
        : [...prev, fuelType]
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }} data-testid="vehicle-filters">
      {/* Header with toggle button for mobile */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: isMobile ? 'pointer' : 'default'
        }}
        onClick={() => isMobile && setIsOpen(!isOpen)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6">Filter</Typography>
          {vehicleCount !== undefined && (
            <Chip
              label={`${vehicleCount} Fahrzeuge`}
              size="small"
              color={isLoading ? 'default' : 'primary'}
              variant="outlined"
              data-testid="vehicle-count"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={(e) => {
                e.stopPropagation()
                handleReset()
              }}
              data-testid="reset-filters"
            >
              Zuruecksetzen
            </Button>
          )}
          {isMobile && (
            <IconButton size="small">
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Collapsible filter content */}
      <Collapse in={isOpen}>
        <Box sx={{ mt: 2 }}>
          {/* Search field */}
          <TextField
            fullWidth
            placeholder="Marke oder Modell suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
            inputProps={{ 'data-testid': 'search-input' }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Brand filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Marke
            </Typography>
            <Autocomplete
              multiple
              options={AVAILABLE_BRANDS}
              value={selectedBrands}
              onChange={(e, newValue) => setSelectedBrands(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Marken waehlen..." size="small" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              data-testid="brand-filter"
            />
          </Box>

          {/* Price range slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preis: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              data-testid="price-slider"
            />
          </Box>

          {/* Year range slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Baujahr: {yearRange[0]} - {yearRange[1]}
            </Typography>
            <Slider
              value={yearRange}
              onChange={(e, newValue) => setYearRange(newValue)}
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              valueLabelDisplay="auto"
              data-testid="year-slider"
            />
          </Box>

          {/* Mileage range slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Kilometerstand: {formatMileage(mileageRange[0])} - {formatMileage(mileageRange[1])}
            </Typography>
            <Slider
              value={mileageRange}
              onChange={(e, newValue) => setMileageRange(newValue)}
              min={MILEAGE_MIN}
              max={MILEAGE_MAX}
              step={10000}
              valueLabelDisplay="auto"
              valueLabelFormat={formatMileage}
              data-testid="mileage-slider"
            />
          </Box>

          {/* Fuel type checkboxes */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">
              <Typography variant="subtitle2">Kraftstoff</Typography>
            </FormLabel>
            <FormGroup row>
              {FUEL_TYPES.map((fuel) => (
                <FormControlLabel
                  key={fuel.value}
                  control={
                    <Checkbox
                      checked={selectedFuelTypes.includes(fuel.value)}
                      onChange={() => handleFuelToggle(fuel.value)}
                      size="small"
                      data-testid={`fuel-${fuel.value}`}
                    />
                  }
                  label={fuel.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default VehicleFilters
