'use client'

import { useState, useEffect, useCallback } from 'react'
import { ParkingSlot, getParkingSlots, subscribeToParkingChanges } from '@/lib/supabase'

export interface UseParkingDataReturn {
  slots: ParkingSlot[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
  refetch: () => void
}

export const useParkingData = (): UseParkingDataReturn => {
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  const fetchParkingSlots = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getParkingSlots()

      // Ensure we have exactly 6 slots (create empty ones if needed)
      const normalizedSlots: ParkingSlot[] = []
      for (let i = 1; i <= 6; i++) {
        const existingSlot = data.find(slot => slot.slot === i)
        if (existingSlot) {
          normalizedSlots.push(existingSlot)
        } else {
          // Create placeholder untuk slot yang belum ada di database
          normalizedSlots.push({
            id: i,
            slot: i,
            status: 'kosong',
            jarak: 0,
            created_at: new Date().toISOString()
          })
        }
      }

      setSlots(normalizedSlots)
      setIsConnected(true)
    } catch (err) {
      console.error('Error fetching parking data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch parking data')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((updatedSlot: ParkingSlot) => {
    setSlots(prevSlots => {
      return prevSlots.map(slot => {
        if (slot.slot === updatedSlot.slot) {
          return { ...updatedSlot }
        }
        return slot
      })
    })
    setIsConnected(true)
    setError(null)
  }, [])

  useEffect(() => {
    // Load initial data
    fetchParkingSlots()

    // Setup real-time subscription
    const channel = subscribeToParkingChanges(handleRealtimeUpdate)

    // Handle connection status
    channel.on('system', { event: '*' }, (status) => {
      if (status.event === 'CHANNEL_ERROR') {
        setIsConnected(false)
        setError('Connection lost. Attempting to reconnect...')
      }

      if (status.event === 'CONNECTED') {
        setIsConnected(true)
        setError(null)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [fetchParkingSlots, handleRealtimeUpdate])

  return {
    slots,
    isLoading,
    isConnected,
    error,
    refetch: fetchParkingSlots
  }
}