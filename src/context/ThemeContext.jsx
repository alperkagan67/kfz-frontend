/**
 * Theme Context
 *
 * KFZ-21: Dark Mode Toggle
 *
 * Manages theme mode (light/dark) with localStorage persistence.
 * Uses system preference as default.
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'kfz_theme_mode'

// Base theme configuration
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051'
    },
    secondary: {
      main: '#ff3d00',
      light: '#ff7539',
      dark: '#c30000'
    },
    ...(mode === 'dark' && {
      background: {
        default: '#121212',
        paper: '#1e1e1e'
      }
    })
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...(mode === 'dark' && {
            backgroundImage: 'none'
          })
        }
      }
    }
  }
})

export function ThemeContextProvider({ children }) {
  // Check system preference
  const prefersDarkMode = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

  // Initialize from localStorage or system preference
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
    }
    return prefersDarkMode ? 'dark' : 'light'
  })

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Only update if user hasn't explicitly set a preference
      if (!stored) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Persist mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // Set specific mode
  const setThemeMode = useCallback((newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode)
    }
  }, [])

  // Create theme
  const theme = useMemo(() => getTheme(mode), [mode])

  const value = {
    mode,
    isDarkMode: mode === 'dark',
    toggleTheme,
    setThemeMode
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 */
export function useThemeMode() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider')
  }
  return context
}

export default ThemeContext
