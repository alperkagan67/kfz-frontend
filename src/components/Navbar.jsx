/**
 * Navbar Component
 *
 * KFZ-19: Added favorites badge with count
 * KFZ-21: Added theme toggle button
 */

import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useFavorites } from '../context/FavoritesContext'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const { favoritesCount } = useFavorites()

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            KFZ ALKERKER
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              component={Link}
              to="/vehicles"
              sx={{ color: 'white' }}
            >
              Fahrzeuge
            </Button>

            {/* Favorites Button with Badge */}
            <Tooltip title="Meine Favoriten">
              <IconButton
                component={Link}
                to="/favorites"
                sx={{ color: 'white' }}
                data-testid="favorites-nav-button"
                aria-label={`Favoriten (${favoritesCount})`}
              >
                <Badge
                  badgeContent={favoritesCount}
                  color="error"
                  max={99}
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: favoritesCount > 0 ? 'pulse 2s infinite' : 'none'
                    }
                  }}
                >
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <ThemeToggle />

            <Button
              component={Link}
              to="/sell"
              sx={{ color: 'white' }}
            >
              Verkaufen
            </Button>
            <Button
              component={Link}
              to="/admin/login"
              sx={{ color: 'white' }}
            >
              Admin
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
