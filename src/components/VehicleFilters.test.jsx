/**
 * VehicleFilters Component Tests
 *
 * KFZ-18: Tests fuer Suchfilter Komponente
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VehicleFilters from './VehicleFilters'

// Wrapper component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('VehicleFilters', () => {
  const mockOnFiltersChange = vi.fn()

  beforeEach(() => {
    mockOnFiltersChange.mockClear()
  })

  it('renders filter panel with all elements', () => {
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    expect(screen.getByTestId('vehicle-filters')).toBeInTheDocument()
    expect(screen.getByText('Filter')).toBeInTheDocument()
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })

  it('displays vehicle count when provided', () => {
    renderWithRouter(
      <VehicleFilters
        onFiltersChange={mockOnFiltersChange}
        vehicleCount={42}
      />
    )

    expect(screen.getByTestId('vehicle-count')).toHaveTextContent('42 Fahrzeuge')
  })

  it('shows reset button when filters are active', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    // Initially no reset button
    expect(screen.queryByTestId('reset-filters')).not.toBeInTheDocument()

    // Type in search field
    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'BMW')

    // Reset button should appear
    await waitFor(() => {
      expect(screen.getByTestId('reset-filters')).toBeInTheDocument()
    })
  })

  it('resets all filters when reset button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    // Add some filter
    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Audi')

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByTestId('reset-filters')).toBeInTheDocument()
    })

    // Click reset
    const resetButton = screen.getByTestId('reset-filters')
    await user.click(resetButton)

    // Search should be cleared
    expect(searchInput).toHaveValue('')
  })

  it('calls onFiltersChange with debounced search term', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Mercedes')

    // Should not be called immediately
    expect(mockOnFiltersChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ q: 'Mercedes' })
    )

    // Advance timers past debounce delay
    vi.advanceTimersByTime(350)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'Mercedes' })
      )
    })

    vi.useRealTimers()
  })

  it('toggles fuel type checkboxes', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    const dieselCheckbox = screen.getByTestId('fuel-diesel')
    expect(dieselCheckbox).not.toBeChecked()

    await user.click(dieselCheckbox)
    expect(dieselCheckbox).toBeChecked()

    await user.click(dieselCheckbox)
    expect(dieselCheckbox).not.toBeChecked()
  })

  it('updates price slider values', async () => {
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    const priceSlider = screen.getByTestId('price-slider')
    expect(priceSlider).toBeInTheDocument()

    // Check that price range is displayed
    expect(screen.getByText(/Preis:/)).toBeInTheDocument()
  })

  it('updates year slider values', async () => {
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    const yearSlider = screen.getByTestId('year-slider')
    expect(yearSlider).toBeInTheDocument()

    // Check that year range is displayed
    expect(screen.getByText(/Baujahr:/)).toBeInTheDocument()
  })

  it('updates mileage slider values', async () => {
    renderWithRouter(
      <VehicleFilters onFiltersChange={mockOnFiltersChange} />
    )

    const mileageSlider = screen.getByTestId('mileage-slider')
    expect(mileageSlider).toBeInTheDocument()

    // Check that mileage range is displayed
    expect(screen.getByText(/Kilometerstand:/)).toBeInTheDocument()
  })
})
