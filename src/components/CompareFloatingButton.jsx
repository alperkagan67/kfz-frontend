/**
 * Compare Floating Button Component
 *
 * KFZ-20: Fahrzeugvergleich
 *
 * Shows a floating button with the number of vehicles selected for comparison.
 */

import { Link as RouterLink } from 'react-router-dom'
import { Fab, Badge, Zoom, Tooltip } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { useCompare } from '../context/CompareContext'

function CompareFloatingButton() {
  const { compareCount } = useCompare()

  if (compareCount === 0) {
    return null
  }

  return (
    <Zoom in={compareCount > 0}>
      <Tooltip title="Fahrzeuge vergleichen" placement="left">
        <Fab
          component={RouterLink}
          to="/compare"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
          data-testid="compare-fab"
          aria-label={`${compareCount} Fahrzeuge vergleichen`}
        >
          <Badge
            badgeContent={compareCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                top: -8,
                right: -8
              }
            }}
          >
            <CompareArrowsIcon />
          </Badge>
        </Fab>
      </Tooltip>
    </Zoom>
  )
}

export default CompareFloatingButton
