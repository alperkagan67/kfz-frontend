/**
 * Login Page Tests
 *
 * KAN-3: Frontend Login UI
 *
 * Tests all Acceptance Criteria:
 * - AC-1: Login Form UI (3 tests)
 * - AC-2: Form Validation (3 tests)
 * - AC-3: Login API Integration (3 tests)
 * - AC-4: Error Handling (2 tests)
 * - AC-5: Loading State (2 tests)
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Helper to render with Router
const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  )
}

describe('KAN-3: Frontend Login UI', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  // ============================================
  // AC-1: Login Form UI
  // ============================================
  describe('AC-1: Login Form UI', () => {

    test('AC-1.1: Login form displays email and password fields', () => {
      renderLoginPage()

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument()
    })

    test('AC-1.2: Submit button is visible and labeled Anmelden', () => {
      renderLoginPage()

      const submitButton = screen.getByTestId('login-button')
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveTextContent(/anmelden/i)
    })

    test('AC-1.3: Link to registration page is visible', () => {
      renderLoginPage()

      const registerLink = screen.getByRole('link', { name: /registrieren/i })
      expect(registerLink).toBeInTheDocument()
      expect(registerLink).toHaveAttribute('href', '/register')
    })
  })

  // ============================================
  // AC-2: Form Validation
  // ============================================
  describe('AC-2: Form Validation', () => {

    test('AC-2.1: Empty email shows error message', async () => {
      renderLoginPage()

      const submitButton = screen.getByTestId('login-button')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email.*erforderlich/i)).toBeInTheDocument()
      })
    })

    test('AC-2.2: Invalid email format shows error message', async () => {
      renderLoginPage()

      const emailInput = screen.getByTestId('email-input')
      await userEvent.type(emailInput, 'invalid-email')

      const submitButton = screen.getByTestId('login-button')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/ungültiges email/i)).toBeInTheDocument()
      })
    })

    test('AC-2.3: Empty password shows error message', async () => {
      renderLoginPage()

      const emailInput = screen.getByTestId('email-input')
      await userEvent.type(emailInput, 'test@example.com')

      const submitButton = screen.getByTestId('login-button')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwort.*erforderlich/i)).toBeInTheDocument()
      })
    })
  })

  // ============================================
  // AC-3: Login API Integration
  // ============================================
  describe('AC-3: Login API Integration', () => {

    test('AC-3.1: Valid credentials makes POST request to /api/auth/login', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          token: 'test-jwt-token',
          user: { id: '1', email: 'test@example.com' }
        })
      })

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/login'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
          })
        )
      })
    })

    test('AC-3.2: Login successful stores JWT token in localStorage', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          token: 'test-jwt-token',
          user: { id: '1', email: 'test@example.com' }
        })
      })

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-jwt-token')
      })
    })

    test('AC-3.3: Login successful redirects to dashboard', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          token: 'test-jwt-token',
          user: { id: '1', email: 'test@example.com' }
        })
      })

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
      })
    })
  })

  // ============================================
  // AC-4: Error Handling
  // ============================================
  describe('AC-4: Error Handling', () => {

    test('AC-4.1: Invalid credentials (401) shows error message', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      })

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'wrongpassword')

      fireEvent.click(screen.getByTestId('login-button'))

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument()
      })
    })

    test('AC-4.2: Server error (500) shows generic error message', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' })
      })

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toHaveTextContent(/fehler/i)
      })
    })
  })

  // ============================================
  // AC-5: Loading State
  // ============================================
  describe('AC-5: Loading State', () => {

    test('AC-5.1: Form submission shows loading indicator', async () => {
      // Delay the fetch to observe loading state
      global.fetch = vi.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'token', user: {} })
          }), 100)
        )
      )

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      // Button should show loading text
      expect(screen.getByTestId('login-button')).toHaveTextContent(/anmelden\.\.\./i)
    })

    test('AC-5.2: Loading state disables submit button', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'token', user: {} })
          }), 100)
        )
      )

      renderLoginPage()

      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com')
      await userEvent.type(screen.getByTestId('password-input'), 'password123')

      fireEvent.click(screen.getByTestId('login-button'))

      expect(screen.getByTestId('login-button')).toBeDisabled()
    })
  })
})
