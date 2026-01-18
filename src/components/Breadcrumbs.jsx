/**
 * Breadcrumbs Component
 *
 * KFZ-22: Breadcrumb Navigation
 *
 * Dynamic breadcrumb navigation based on current route.
 */

import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

// Route name mappings
const ROUTE_NAMES = {
  'vehicles': 'Fahrzeuge',
  'favorites': 'Favoriten',
  'compare': 'Vergleich',
  'sell': 'Verkaufen',
  'login': 'Anmelden',
  'register': 'Registrieren',
  'admin': 'Admin',
  'dashboard': 'Dashboard'
}

// Routes that should not show breadcrumbs
const HIDDEN_ROUTES = ['/', '']

function Breadcrumbs() {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Parse pathname into segments
  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Don't show breadcrumbs on home page
  if (HIDDEN_ROUTES.includes(location.pathname) || pathSegments.length === 0) {
    return null
  }

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1

    // Get display name
    let displayName = ROUTE_NAMES[segment] || segment

    // Handle vehicle ID (numeric)
    if (/^\d+$/.test(segment)) {
      displayName = `Fahrzeug #${segment}`
    }

    // Truncate long names on mobile
    if (isMobile && displayName.length > 12) {
      displayName = displayName.substring(0, 10) + '...'
    }

    return {
      path,
      displayName,
      isLast
    }
  })

  // On mobile, only show last 2 items
  const displayItems = isMobile && breadcrumbItems.length > 2
    ? breadcrumbItems.slice(-2)
    : breadcrumbItems

  return (
    <Box sx={{ py: 1, px: { xs: 2, md: 3 } }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap'
          }
        }}
      >
        {/* Home link */}
        <Link
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main'
            }
          }}
          aria-label="Startseite"
        >
          <HomeIcon sx={{ fontSize: 20 }} />
        </Link>

        {/* Show ellipsis if items were truncated on mobile */}
        {isMobile && breadcrumbItems.length > 2 && (
          <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            ...
          </Typography>
        )}

        {/* Breadcrumb items */}
        {displayItems.map((item) => {
          if (item.isLast) {
            return (
              <Typography
                key={item.path}
                color="text.primary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
                aria-current="page"
              >
                {item.displayName}
              </Typography>
            )
          }

          return (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              {item.displayName}
            </Link>
          )
        })}
      </MuiBreadcrumbs>
    </Box>
  )
}

export default Breadcrumbs
