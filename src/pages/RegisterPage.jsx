/**
 * Register Page Component
 *
 * KFZ-11: Frontend User Registration Page
 *
 * Features:
 * - Email, password, confirm password, and name fields
 * - Password strength indicator
 * - Form validation with error messages
 * - API integration with backend
 * - Loading state handling
 * - Token storage and redirect on success
 */

import { useState, useMemo } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Paper,
  LinearProgress
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const API_URL = 'http://localhost:3000'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation errors
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Calculate password strength (0-100)
   */
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let strength = 0

    // Length checks
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 15

    // Character variety
    if (/[a-z]/.test(password)) strength += 15
    if (/[A-Z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15

    return Math.min(100, strength)
  }, [password])

  /**
   * Get password strength color
   */
  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'error'
    if (passwordStrength < 60) return 'warning'
    return 'success'
  }

  /**
   * Get password strength label
   */
  const getStrengthLabel = () => {
    if (passwordStrength < 30) return 'Schwach'
    if (passwordStrength < 60) return 'Mittel'
    return 'Stark'
  }

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    let isValid = true

    // Reset errors
    setNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')

    // Validate name
    if (!name.trim()) {
      setNameError('Name ist erforderlich')
      isValid = false
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email ist erforderlich')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Ungültiges Email-Format')
      isValid = false
    }

    // Validate password
    if (!password) {
      setPasswordError('Passwort ist erforderlich')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Passwort muss mindestens 8 Zeichen lang sein')
      isValid = false
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Passwort-Bestätigung ist erforderlich')
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwörter stimmen nicht überein')
      isValid = false
    }

    return isValid
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous error
    setError('')

    // Validate form
    if (!validateForm()) {
      return
    }

    // Start loading
    setIsLoading(true)

    try {
      // Make API request to register endpoint
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error responses
        if (response.status === 409) {
          setError('Ein Benutzer mit dieser Email existiert bereits')
        } else if (response.status === 400) {
          setError(data.message || 'Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.')
        } else {
          setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später.')
        }
        return
      }

      // Use AuthContext to login
      login(data.user, data.token)

      // Redirect to dashboard
      navigate('/admin/dashboard', { replace: true })

    } catch (err) {
      // Handle network errors
      setError('Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Registrieren
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Erstellen Sie ein neues Konto
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} data-testid="register-error">
            {error}
          </Alert>
        )}

        {/* Registration Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            type="text"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            disabled={isLoading}
            sx={{ mb: 2 }}
            inputProps={{ 'data-testid': 'name-input' }}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={isLoading}
            sx={{ mb: 2 }}
            inputProps={{ 'data-testid': 'email-input' }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Passwort"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError || 'Mindestens 8 Zeichen'}
            disabled={isLoading}
            sx={{ mb: 1 }}
            inputProps={{ 'data-testid': 'password-input' }}
          />

          {/* Password Strength Indicator */}
          {password && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={getStrengthColor()}
                sx={{ height: 8, borderRadius: 4 }}
                data-testid="password-strength"
              />
              <Typography variant="caption" color={`${getStrengthColor()}.main`}>
                Passwortstärke: {getStrengthLabel()}
              </Typography>
            </Box>
          )}

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Passwort bestätigen"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            disabled={isLoading}
            sx={{ mb: 3 }}
            inputProps={{ 'data-testid': 'confirm-password-input' }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            data-testid="register-button"
            sx={{ py: 1.5, mb: 2 }}
          >
            {isLoading ? 'Registrieren...' : 'Registrieren'}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Bereits ein Konto?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Anmelden
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default RegisterPage
