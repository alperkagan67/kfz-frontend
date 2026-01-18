/**
 * Login Page Component
 *
 * KAN-3: Frontend Login UI
 *
 * Features:
 * - Email and password form fields
 * - Form validation with error messages
 * - API integration with backend
 * - Loading state handling
 * - Error display for failed login
 * - Token storage in localStorage
 * - Redirect to dashboard on success
 */

import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Paper
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'

const API_URL = 'http://localhost:3000'

function LoginPage() {
  const navigate = useNavigate()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Validation errors
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    setEmailError('')
    setPasswordError('')

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
      // Make API request to login endpoint
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error responses
        if (response.status === 401) {
          setError('Email oder Passwort ist falsch')
        } else if (response.status === 429) {
          setError('Zu viele Versuche. Bitte warten Sie.')
        } else {
          setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später.')
        }
        return
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      navigate('/admin/dashboard')

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
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Anmelden
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Melden Sie sich an, um fortzufahren
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} data-testid="login-error">
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            disabled={isLoading}
            sx={{ mb: 3 }}
            inputProps={{ 'data-testid': 'password-input' }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            data-testid="login-button"
            sx={{ py: 1.5, mb: 2 }}
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </Button>

          {/* Registration Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Noch kein Konto?{' '}
              <Link component={RouterLink} to="/register" underline="hover">
                Registrieren
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
