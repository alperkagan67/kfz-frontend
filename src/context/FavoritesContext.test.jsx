/**
 * FavoritesContext Tests
 *
 * KFZ-19: Tests fuer Favoriten-System
 */

import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FavoritesProvider, useFavorites } from './FavoritesContext'

// Test component that uses the favorites context
function TestComponent() {
  const {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  } = useFavorites()

  return (
    <div>
      <span data-testid="count">{favoritesCount}</span>
      <span data-testid="favorites">{JSON.stringify(favorites)}</span>
      <span data-testid="is-favorite-1">{isFavorite(1).toString()}</span>
      <span data-testid="is-favorite-2">{isFavorite(2).toString()}</span>
      <button onClick={() => addFavorite(1)} data-testid="add-1">Add 1</button>
      <button onClick={() => addFavorite(2)} data-testid="add-2">Add 2</button>
      <button onClick={() => removeFavorite(1)} data-testid="remove-1">Remove 1</button>
      <button onClick={() => toggleFavorite(1)} data-testid="toggle-1">Toggle 1</button>
      <button onClick={() => clearFavorites()} data-testid="clear">Clear</button>
    </div>
  )
}

describe('FavoritesContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('provides default empty favorites', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('favorites')).toHaveTextContent('[]')
  })

  it('adds a vehicle to favorites', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    await user.click(screen.getByTestId('add-1'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true')
  })

  it('removes a vehicle from favorites', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    await user.click(screen.getByTestId('add-1'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await user.click(screen.getByTestId('remove-1'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false')
  })

  it('toggles favorite status', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    // Toggle on
    await user.click(screen.getByTestId('toggle-1'))
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true')

    // Toggle off
    await user.click(screen.getByTestId('toggle-1'))
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false')
  })

  it('clears all favorites', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-2'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')

    await user.click(screen.getByTestId('clear'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('does not add duplicate favorites', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-1'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('persists favorites to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-2'))

    // Check localStorage
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('kfz_favorites'))
      expect(stored).toContain(1)
      expect(stored).toContain(2)
    })
  })

  it('restores favorites from localStorage', () => {
    // Pre-populate localStorage
    localStorage.setItem('kfz_favorites', JSON.stringify([1, 2, 3]))

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('3')
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true')
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true')
  })
})
