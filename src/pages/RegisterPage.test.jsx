/**
 * RegisterPage Tests
 *
 * KFZ-11: Frontend User Registration Page
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import RegisterPage from './RegisterPage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock fetch
global.fetch = vi.fn()

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // AC-1: Route /register displays registration form
  test('renders registration form with all fields', () => {
    renderRegisterPage()

    expect(screen.getByTestId('name-input')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('register-button')).toBeInTheDocument()
  })

  // AC-3: Password strength indicator
  test('shows password strength indicator', () => {
    renderRegisterPage()

    const passwordInput = screen.getByTestId('password-input')
    fireEvent.change(passwordInput, { target: { value: 'weak' } })

    expect(screen.getByTestId('password-strength')).toBeInTheDocument()
    expect(screen.getByText(/Passwortstärke/)).toBeInTheDocument()
  })

  // AC-4: Form validation - required fields
  test('shows validation errors for empty fields', async () => {
    renderRegisterPage()

    const submitButton = screen.getByTestId('register-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name ist erforderlich')).toBeInTheDocument()
      expect(screen.getByText('Email ist erforderlich')).toBeInTheDocument()
      expect(screen.getByText('Passwort ist erforderlich')).toBeInTheDocument()
    })
  })

  // AC-4: Form validation - email format
  test('validates email format', async () => {
    renderRegisterPage()

    const emailInput = screen.getByTestId('email-input')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByTestId('register-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Ungültiges Email-Format')).toBeInTheDocument()
    })
  })

  // AC-4: Form validation - password length
  test('validates password minimum length', async () => {
    renderRegisterPage()

    const passwordInput = screen.getByTestId('password-input')
    fireEvent.change(passwordInput, { target: { value: 'short' } })

    const submitButton = screen.getByTestId('register-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwort muss mindestens 8 Zeichen lang sein')).toBeInTheDocument()
    })
  })

  // AC-4: Form validation - password match
  test('validates password confirmation matches', async () => {
    renderRegisterPage()

    const passwordInput = screen.getByTestId('password-input')
    const confirmInput = screen.getByTestId('confirm-password-input')

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'different123' } })

    const submitButton = screen.getByTestId('register-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwörter stimmen nicht überein')).toBeInTheDocument()
    })
  })

  // AC-5: Submit calls POST /api/auth/register
  test('calls register API on valid submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      })
    })

    renderRegisterPage()

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByTestId('register-button'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          })
        })
      )
    })
  })

  // AC-6: Success - store token and redirect
  test('stores token and redirects on successful registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      })
    })

    renderRegisterPage()

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByTestId('register-button'))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token')
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true })
    })
  })

  // AC-7: Error - display error message for duplicate email
  test('displays error for duplicate email', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: 'User exists' })
    })

    renderRegisterPage()

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'existing@example.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByTestId('register-button'))

    await waitFor(() => {
      expect(screen.getByTestId('register-error')).toHaveTextContent('Ein Benutzer mit dieser Email existiert bereits')
    })
  })

  // AC-8: Link to login page
  test('has link to login page', () => {
    renderRegisterPage()

    const loginLink = screen.getByRole('link', { name: /anmelden/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})
