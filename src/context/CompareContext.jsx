/**
 * Compare Context
 *
 * KFZ-20: Fahrzeugvergleich
 *
 * Manages vehicle comparison state (max 3 vehicles).
 */

import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const CompareContext = createContext(null)

const MAX_COMPARE = 3

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([])

  /**
   * Add a vehicle to comparison
   */
  const addToCompare = useCallback((vehicleId) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) {
        return prev
      }
      if (prev.length >= MAX_COMPARE) {
        return prev
      }
      return [...prev, vehicleId]
    })
  }, [])

  /**
   * Remove a vehicle from comparison
   */
  const removeFromCompare = useCallback((vehicleId) => {
    setCompareList((prev) => prev.filter((id) => id !== vehicleId))
  }, [])

  /**
   * Toggle compare status
   */
  const toggleCompare = useCallback((vehicleId) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId)
      }
      if (prev.length >= MAX_COMPARE) {
        return prev
      }
      return [...prev, vehicleId]
    })
  }, [])

  /**
   * Check if a vehicle is in comparison
   */
  const isInCompare = useCallback((vehicleId) => {
    return compareList.includes(vehicleId)
  }, [compareList])

  /**
   * Clear all from comparison
   */
  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  /**
   * Check if can add more to compare
   */
  const canAddMore = useMemo(() => {
    return compareList.length < MAX_COMPARE
  }, [compareList])

  /**
   * Get count of vehicles in comparison
   */
  const compareCount = useMemo(() => {
    return compareList.length
  }, [compareList])

  const value = {
    compareList,
    compareCount,
    maxCompare: MAX_COMPARE,
    canAddMore,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    clearCompare
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

/**
 * Hook to access compare context
 */
export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}

export default CompareContext
