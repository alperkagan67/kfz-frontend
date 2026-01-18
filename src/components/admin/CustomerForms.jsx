import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelIcon from '@mui/icons-material/Cancel'

const statusColors = {
  neu: 'success',
  in_bearbeitung: 'warning',
  abgeschlossen: 'info',
  abgelehnt: 'error'
}

const statusLabels = {
  neu: 'Neu',
  in_bearbeitung: 'In Bearbeitung',
  abgeschlossen: 'Abgeschlossen',
  abgelehnt: 'Abgelehnt'
}

function CustomerForms() {
  const [forms, setForms] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedForm, setSelectedForm] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const loadForms = () => {
      const storedForms = JSON.parse(localStorage.getItem('customerForms') || '[]')
      setForms(storedForms)
    }
    loadForms()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDetails = (form) => {
    setSelectedForm(form)
    setDetailsOpen(true)
  }

  const handleStatusChange = (formId, newStatus) => {
    const updatedForms = forms.map(form => 
      form.id === formId ? { ...form, status: newStatus } : form
    )
    localStorage.setItem('customerForms', JSON.stringify(updatedForms))
    setForms(updatedForms)
    setDetailsOpen(false)
  }

  return (
    <>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Kunde</TableCell>
                <TableCell>Fahrzeug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((form) => (
                  <TableRow key={form.id} hover>
                    <TableCell>{new Date(form.date).toLocaleDateString('de-DE')}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{form.customerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {form.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {form.vehicle.brand} {form.vehicle.model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {form.vehicle.year} • {form.vehicle.mileage.toLocaleString()} km
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={statusLabels[form.status]}
                        color={statusColors[form.status]}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(form)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={forms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Einträge pro Seite"
        />
      </Paper>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedForm && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Kundenformular Details
                <Chip
                  size="small"
                  label={statusLabels[selectedForm.status]}
                  color={statusColors[selectedForm.status]}
                  sx={{ ml: 2 }}
                />
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Kundendaten</Typography>
                  <Typography><strong>Name:</strong> {selectedForm.customerName}</Typography>
                  <Typography><strong>E-Mail:</strong> {selectedForm.email}</Typography>
                  <Typography><strong>Telefon:</strong> {selectedForm.phone}</Typography>
                  <Typography><strong>Datum:</strong> {new Date(selectedForm.date).toLocaleDateString('de-DE')}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Fahrzeugdaten</Typography>
                  <Typography><strong>Marke:</strong> {selectedForm.vehicle.brand}</Typography>
                  <Typography><strong>Modell:</strong> {selectedForm.vehicle.model}</Typography>
                  <Typography><strong>Baujahr:</strong> {selectedForm.vehicle.year}</Typography>
                  <Typography><strong>Kilometerstand:</strong> {selectedForm.vehicle.mileage.toLocaleString()} km</Typography>
                  <Typography><strong>Preis:</strong> {selectedForm.vehicle.price.toLocaleString()} €</Typography>
                  <Typography><strong>Kraftstoff:</strong> {selectedForm.vehicle.fuelType}</Typography>
                  <Typography><strong>Getriebe:</strong> {selectedForm.vehicle.transmission}</Typography>
                  <Typography><strong>Leistung:</strong> {selectedForm.vehicle.power}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Beschreibung</Typography>
                  <Typography>{selectedForm.vehicle.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Bilder</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedForm.images.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Fahrzeug ${index + 1}`}
                        sx={{
                          width: 200,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Schließen
              </Button>
              <Button
                startIcon={<PendingIcon />}
                variant="contained"
                color="warning"
                onClick={() => handleStatusChange(selectedForm.id, 'in_bearbeitung')}
              >
                In Bearbeitung
              </Button>
              <Button
                startIcon={<CheckCircleIcon />}
                variant="contained"
                color="success"
                onClick={() => handleStatusChange(selectedForm.id, 'abgeschlossen')}
              >
                Annehmen
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="contained"
                color="error"
                onClick={() => handleStatusChange(selectedForm.id, 'abgelehnt')}
              >
                Ablehnen
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}

export default CustomerForms
