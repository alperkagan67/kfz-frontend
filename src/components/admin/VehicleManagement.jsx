/**
 * Vehicle Management Component
 *
 * KFZ-16: Admin Vehicle Management UI
 *
 * Features:
 * - Table displaying all vehicles
 * - Columns: Brand, Model, Year, Price, Mileage, Created
 * - Edit button opens form modal
 * - Delete button with confirmation
 * - Add vehicle button
 * - Image upload in forms
 * - Loading state while saving
 * - Pagination for large lists
 */

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAuth } from '../../context/AuthContext'

const API_URL = 'http://localhost:3000'

function VehicleManagement() {
  const { token } = useAuth()

  // Data state
  const [vehicles, setVehicles] = useState([])
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    description: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [selectedImages, setSelectedImages] = useState([])

  // Currency formatter
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  /**
   * Fetch vehicles from API
   */
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles?page=${page + 1}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Fehler beim Laden der Fahrzeuge')
      }

      const data = await response.json()

      // Handle both paginated and array response
      if (Array.isArray(data)) {
        setVehicles(data)
        setTotalVehicles(data.length)
      } else {
        setVehicles(data.vehicles || [])
        setTotalVehicles(data.total || 0)
      }
    } catch (err) {
      setError(err.message || 'Verbindungsfehler')
    } finally {
      setIsLoading(false)
    }
  }, [token, page, rowsPerPage])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  /**
   * Handle page change
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  /**
   * Handle rows per page change
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  /**
   * Open add vehicle modal
   */
  const handleAddClick = () => {
    setSelectedVehicle(null)
    setFormData({
      brand: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      description: ''
    })
    setFormErrors({})
    setSelectedImages([])
    setFormOpen(true)
  }

  /**
   * Open edit vehicle modal
   */
  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      price: vehicle.price?.toString() || '',
      mileage: vehicle.mileage?.toString() || '',
      description: vehicle.description || ''
    })
    setFormErrors({})
    setSelectedImages([])
    setFormOpen(true)
  }

  /**
   * Open delete confirmation
   */
  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setDeleteDialogOpen(true)
  }

  /**
   * Handle form input changes
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Handle image selection
   */
  const handleImageSelect = (e) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {}

    if (!formData.brand.trim()) {
      errors.brand = 'Marke ist erforderlich'
    }

    if (!formData.model.trim()) {
      errors.model = 'Modell ist erforderlich'
    }

    if (formData.year && (isNaN(formData.year) || formData.year < 1900 || formData.year > 2030)) {
      errors.year = 'Ungueltiges Jahr'
    }

    if (formData.price && (isNaN(formData.price) || formData.price < 0)) {
      errors.price = 'Ungueltiger Preis'
    }

    if (formData.mileage && (isNaN(formData.mileage) || formData.mileage < 0)) {
      errors.mileage = 'Ungueltiger Kilometerstand'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Submit form (create or update)
   */
  const handleFormSubmit = async () => {
    if (!validateForm()) return

    setIsSaving(true)

    try {
      const form = new FormData()
      form.append('brand', formData.brand)
      form.append('model', formData.model)
      if (formData.year) form.append('year', formData.year)
      if (formData.price) form.append('price', formData.price)
      if (formData.mileage) form.append('mileage', formData.mileage)
      if (formData.description) form.append('description', formData.description)

      selectedImages.forEach((image) => {
        form.append('images', image)
      })

      const url = selectedVehicle
        ? `${API_URL}/api/vehicles/${selectedVehicle.id}`
        : `${API_URL}/api/vehicles`

      const method = selectedVehicle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Fehler beim Speichern')
      }

      setFormOpen(false)
      fetchVehicles()
    } catch (err) {
      setFormErrors({ submit: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Confirm delete
   */
  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return

    setIsSaving(true)

    try {
      const response = await fetch(`${API_URL}/api/vehicles/${selectedVehicle.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Fehler beim Loeschen')
      }

      setDeleteDialogOpen(false)
      setSelectedVehicle(null)
      fetchVehicles()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  // Loading state
  if (isLoading && vehicles.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" data-testid="vehicle-management-title">
          Fahrzeugverwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          data-testid="add-vehicle-button"
        >
          Fahrzeug hinzufuegen
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Vehicle Table */}
      <TableContainer component={Paper}>
        <Table data-testid="vehicles-table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>
                <strong>Marke</strong>
              </TableCell>
              <TableCell>
                <strong>Modell</strong>
              </TableCell>
              <TableCell>
                <strong>Jahr</strong>
              </TableCell>
              <TableCell>
                <strong>Preis</strong>
              </TableCell>
              <TableCell>
                <strong>Km</strong>
              </TableCell>
              <TableCell>
                <strong>Erstellt</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Aktionen</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Keine Fahrzeuge vorhanden</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} hover data-testid={`vehicle-row-${vehicle.id}`}>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year || '-'}</TableCell>
                  <TableCell>{vehicle.price ? formatter.format(vehicle.price) : '-'}</TableCell>
                  <TableCell>
                    {vehicle.mileage ? `${(vehicle.mileage / 1000).toFixed(0)} tkm` : '-'}
                  </TableCell>
                  <TableCell>{formatDate(vehicle.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(vehicle)}
                      data-testid={`edit-button-${vehicle.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(vehicle)}
                      data-testid={`delete-button-${vehicle.id}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalVehicles}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Zeilen pro Seite:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} von ${count !== -1 ? count : `mehr als ${to}`}`
          }
          data-testid="table-pagination"
        />
      </TableContainer>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedVehicle ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {formErrors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.submit}
              </Alert>
            )}

            <TextField
              fullWidth
              name="brand"
              label="Marke"
              value={formData.brand}
              onChange={handleFormChange}
              error={!!formErrors.brand}
              helperText={formErrors.brand}
              disabled={isSaving}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'form-brand' }}
            />

            <TextField
              fullWidth
              name="model"
              label="Modell"
              value={formData.model}
              onChange={handleFormChange}
              error={!!formErrors.model}
              helperText={formErrors.model}
              disabled={isSaving}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'form-model' }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="year"
                label="Jahr"
                type="number"
                value={formData.year}
                onChange={handleFormChange}
                error={!!formErrors.year}
                helperText={formErrors.year}
                disabled={isSaving}
                sx={{ flex: 1 }}
                inputProps={{ 'data-testid': 'form-year' }}
              />

              <TextField
                name="price"
                label="Preis (EUR)"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                disabled={isSaving}
                sx={{ flex: 1 }}
                inputProps={{ 'data-testid': 'form-price' }}
              />

              <TextField
                name="mileage"
                label="Km-Stand"
                type="number"
                value={formData.mileage}
                onChange={handleFormChange}
                error={!!formErrors.mileage}
                helperText={formErrors.mileage}
                disabled={isSaving}
                sx={{ flex: 1 }}
                inputProps={{ 'data-testid': 'form-mileage' }}
              />
            </Box>

            <TextField
              fullWidth
              name="description"
              label="Beschreibung"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              disabled={isSaving}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'form-description' }}
            />

            {/* Image Upload */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={isSaving}
              >
                Bilder hochladen
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  data-testid="image-upload"
                />
              </Button>

              {selectedImages.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedImages.map((file, index) => (
                    <Chip key={index} label={file.name} size="small" />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)} disabled={isSaving}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={isSaving}
            data-testid="form-submit"
          >
            {isSaving ? <CircularProgress size={20} /> : 'Speichern'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Fahrzeug loeschen?</DialogTitle>
        <DialogContent>
          <Typography>
            Moechten Sie das Fahrzeug{' '}
            <strong>
              {selectedVehicle?.brand} {selectedVehicle?.model}
            </strong>{' '}
            wirklich loeschen?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Diese Aktion kann nicht rueckgaengig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isSaving}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={isSaving}
            data-testid="confirm-delete"
          >
            {isSaving ? <CircularProgress size={20} /> : 'Loeschen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default VehicleManagement
