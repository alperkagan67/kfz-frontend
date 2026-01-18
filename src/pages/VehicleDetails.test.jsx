/**
 * Vehicle Details Page Tests
 *
 * KFZ-14: Frontend Vehicle Details Page
 *
 * Tests all Acceptance Criteria:
 * - AC-1: Route /vehicles/:id shows vehicle details
 * - AC-2: All fields displayed (brand, model, year, price, km, description)
 * - AC-3: Image gallery with thumbnail navigation
 * - AC-4: "Anfrage senden" button opens inquiry modal
 * - AC-5: "Zurueck zur Liste" button
 * - AC-6: 404 handling when vehicle not found
 * - AC-7: Mobile responsive
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import VehicleDetails from './VehicleDetails'

// Mock vehicle data
const mockVehicle = {
  id: 'v1',
  brand: 'BMW',
  model: '320i',
  year: 2020,
  price: 25000,
  mileage: 50000,
  fuelType: 'Benzin',
  power: '184 PS',
  transmission: 'Automatik',
  color: 'Schwarz',
  description: 'Top gepflegtes Fahrzeug mit Vollausstattung',
  features: ['Navigation', 'Leder', 'Klimaautomatik'],
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
}

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Helper to render with router
const renderWithRoute = (vehicleId = 'v1') => {
  return render(
    <MemoryRouter initialEntries={[`/vehicles/${vehicleId}`]}>
      <Routes>
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('KFZ-14: Vehicle Details Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  // ============================================
  // AC-1 & AC-2: Vehicle details display
  // ============================================
  describe('AC-1 & AC-2: Vehicle Details Display', () => {
    test('AC-1.1: Displays vehicle title (brand and model)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-title')).toHaveTextContent('BMW 320i')
      })
    })

    test('AC-2.1: Displays price formatted in EUR', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-price')).toHaveTextContent('25.000')
      })
    })

    test('AC-2.2: Displays year, mileage and fuel type', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-year')).toHaveTextContent('2020')
        expect(screen.getByTestId('vehicle-mileage')).toHaveTextContent('50 tkm')
        expect(screen.getByTestId('vehicle-fuel')).toHaveTextContent('Benzin')
      })
    })

    test('AC-2.3: Displays description', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-description')).toHaveTextContent(
          'Top gepflegtes Fahrzeug'
        )
      })
    })
  })

  // ============================================
  // AC-3: Image Gallery
  // ============================================
  describe('AC-3: Image Gallery', () => {
    test('AC-3.1: Displays main image', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('main-image')).toBeInTheDocument()
      })
    })

    test('AC-3.2: Displays thumbnail navigation when multiple images', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('thumbnail-0')).toBeInTheDocument()
        expect(screen.getByTestId('thumbnail-1')).toBeInTheDocument()
        expect(screen.getByTestId('thumbnail-2')).toBeInTheDocument()
      })
    })

    test('AC-3.3: Navigation arrows work', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('next-image-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('next-image-button'))

      // Image should have changed (counter shows 2/3)
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })
  })

  // ============================================
  // AC-4: Inquiry Modal
  // ============================================
  describe('AC-4: Anfrage senden Button', () => {
    test('AC-4.1: Anfrage senden button is visible', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('inquiry-button')).toBeInTheDocument()
        expect(screen.getByTestId('inquiry-button')).toHaveTextContent('Anfrage senden')
      })
    })

    test('AC-4.2: Clicking button opens inquiry modal', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('inquiry-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('inquiry-button'))

      await waitFor(() => {
        expect(screen.getByTestId('inquiry-modal')).toBeInTheDocument()
      })
    })
  })

  // ============================================
  // AC-5: Back to List Button
  // ============================================
  describe('AC-5: Zurueck zur Liste Button', () => {
    test('AC-5.1: Back button is visible', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument()
      })
    })

    test('AC-5.2: Back button navigates to vehicle list', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicle)
      })

      renderWithRoute('v1')

      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('back-button'))

      expect(mockNavigate).toHaveBeenCalledWith('/vehicles')
    })
  })

  // ============================================
  // AC-6: 404 Handling
  // ============================================
  describe('AC-6: 404 Handling', () => {
    test('AC-6.1: Shows error when vehicle not found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })

      renderWithRoute('nonexistent')

      await waitFor(() => {
        expect(screen.getByTestId('error-container')).toBeInTheDocument()
        expect(screen.getByText('Fahrzeug nicht gefunden')).toBeInTheDocument()
      })
    })

    test('AC-6.2: Shows back to list button on error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })

      renderWithRoute('nonexistent')

      await waitFor(() => {
        expect(screen.getByTestId('back-to-list-button')).toBeInTheDocument()
      })
    })
  })

  // ============================================
  // Loading State
  // ============================================
  describe('Loading State', () => {
    test('Shows loading spinner while fetching', () => {
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockVehicle)
                }),
              100
            )
          )
      )

      renderWithRoute('v1')

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })
})
