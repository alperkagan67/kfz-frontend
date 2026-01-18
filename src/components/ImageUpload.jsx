import { Box, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

function ImageUpload({ images, onImageAdd, onImageDelete }) {
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    )
    if (files.length > 0) {
      onImageAdd(files)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
          mb: 2,
          backgroundColor: 'background.paper',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('image-upload').click()}
      >
        <input
          type="file"
          id="image-upload"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => onImageAdd(Array.from(e.target.files))}
        />
        <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Bilder hier ablegen oder klicken zum Auswählen
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unterstützte Formate: JPG, PNG, GIF (max. 5MB pro Bild)
        </Typography>
      </Box>

      {images.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Hochgeladene Bilder ({images.length})
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            {images.map((file, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 1,
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Vorschau ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={() => onImageDelete(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ImageUpload
