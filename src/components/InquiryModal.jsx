/**
 * Inquiry Modal Component
 *
 * KFZ-14/KFZ-15: Vehicle Inquiry Modal
 *
 * Features:
 * - Modal for sending vehicle inquiries
 * - Form fields: email, phone, message
 * - Form validation
 * - API integration
 * - Success/Error feedback
 */

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const API_URL = 'http://localhost:3000'

function InquiryModal({ open, onClose, vehicleId, vehicleName }) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Validation errors
  const [errors, setErrors] = useState({})

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungueltige Email-Adresse'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nachricht ist erforderlich'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicleId,
          ...formData
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Ein Fehler ist aufgetreten')
      }

      setIsSuccess(true)

      // Auto-close after success
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setSubmitError(err.message || 'Verbindungsfehler. Bitte versuchen Sie es spaeter.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    // Reset state
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
    setErrors({})
    setSubmitError('')
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-testid="inquiry-modal"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Anfrage senden</Typography>
          {vehicleName && (
            <Typography variant="body2" color="text.secondary">
              {vehicleName}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose} size="small" data-testid="close-modal-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {isSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }} data-testid="success-message">
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Vielen Dank!
            </Typography>
            <Typography color="text.secondary">
              Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kuerze bei Ihnen.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }} data-testid="submit-error">
                {submitError}
              </Alert>
            )}

            <TextField
              fullWidth
              name="name"
              label="Ihr Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'name-input' }}
            />

            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'email-input' }}
            />

            <TextField
              fullWidth
              name="phone"
              label="Telefon (optional)"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'phone-input' }}
            />

            <TextField
              fullWidth
              name="message"
              label="Ihre Nachricht"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              disabled={isLoading}
              placeholder={`Ich interessiere mich fuer dieses Fahrzeug und haette gerne weitere Informationen...`}
              inputProps={{ 'data-testid': 'message-input' }}
            />
          </Box>
        )}
      </DialogContent>

      {!isSuccess && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            data-testid="send-inquiry-button"
          >
            {isLoading ? 'Senden...' : 'Anfrage senden'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default InquiryModal
