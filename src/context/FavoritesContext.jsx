/**
 * Favorites Context
 *
 * KFZ-19: Favoriten-System
 *
 * Provides favorites state and methods to the entire app.
 * Favorites are stored in localStorage for persistence.
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const FavoritesContext = createContext(null)

const STORAGE_KEY = 'kfz_favorites'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Restore favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Persist favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  /**
   * Add a vehicle to favorites
   */
  const addFavorite = useCallback((vehicleId) => {
    setFavorites((prev) => {
      if (prev.includes(vehicleId)) {
        return prev
      }
      return [...prev, vehicleId]
    })
  }, [])

  /**
   * Remove a vehicle from favorites
   */
  const removeFavorite = useCallback((vehicleId) => {
    setFavorites((prev) => prev.filter((id) => id !== vehicleId))
  }, [])

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((vehicleId) => {
    setFavorites((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId)
      }
      return [...prev, vehicleId]
    })
  }, [])

  /**
   * Check if a vehicle is a favorite
   */
  const isFavorite = useCallback((vehicleId) => {
    return favorites.includes(vehicleId)
  }, [favorites])

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  /**
   * Get count of favorites
   */
  const favoritesCount = useMemo(() => {
    return favorites.length
  }, [favorites])

  const value = {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

/**
 * Hook to access favorites context
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export default FavoritesContext
