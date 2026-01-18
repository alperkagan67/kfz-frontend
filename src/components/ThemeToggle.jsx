/**
 * Theme Toggle Component
 *
 * KFZ-21: Dark Mode Toggle
 *
 * A button that toggles between light and dark mode with smooth animation.
 */

import { IconButton, Tooltip, Zoom } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeMode } from '../context/ThemeContext'

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeMode()

  return (
    <Tooltip
      title={isDarkMode ? 'Helles Design' : 'Dunkles Design'}
      TransitionComponent={Zoom}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'inherit',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg)'
          }
        }}
        data-testid="theme-toggle"
        aria-label={isDarkMode ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
      >
        {isDarkMode ? (
          <LightModeIcon sx={{ color: 'warning.main' }} />
        ) : (
          <DarkModeIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
