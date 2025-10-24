'use client'

import { useState, useEffect, useCallback } from 'react'
import { EntryGateData, getEntryGateData, subscribeToEntryGateChanges } from '@/lib/supabase'

export interface UseEntryGateDataReturn {
  gateData: EntryGateData | null
  isLoading: boolean
  isConnected: boolean
  error: string | null
  refetch: () => void
}

export const useEntryGateData = (): UseEntryGateDataReturn => {
  const [gateData, setGateData] = useState<EntryGateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntryGateData = useCallback(async (isPolling = false) => {
    try {
      // Only show loading state for initial fetch, not for polling
      if (!isPolling) {
        setIsLoading(true)
      }
      setError(null)
      const data = await getEntryGateData()

      if (data) {
        // Only update state if data actually changed (avoid unnecessary re-renders)
        setGateData((prevData) => {
          const hasChanged = JSON.stringify(prevData) !== JSON.stringify(data);
          return hasChanged ? data : prevData;
        })
      } else {
        const defaultData = {
          id: 1,
          distance: 0,
          is_vehicle_detected: false,
          created_at: new Date().toISOString()
        }
        setGateData((prevData) => {
          const hasChanged = JSON.stringify(prevData) !== JSON.stringify(defaultData);
          return hasChanged ? defaultData : prevData;
        })
      }

      setIsConnected(true)
    } catch (err) {
      console.error('Error fetching entry gate data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch entry gate data')
      setIsConnected(false)
    } finally {
      if (!isPolling) {
        setIsLoading(false)
      }
    }
  }, [])

  const handleRealtimeUpdate = useCallback((updatedData: EntryGateData) => {
    setGateData(updatedData)
    setIsConnected(true)
    setError(null)
  }, [])

  useEffect(() => {
    fetchEntryGateData(false)

    const channel = subscribeToEntryGateChanges(handleRealtimeUpdate)

    // Setup polling every 1 second (guaranteed updates like HTML version)
    const pollingInterval = setInterval(() => {
      fetchEntryGateData(true) // Mark as polling to avoid loading states
    }, 1000)

    channel.on('system', { event: '*' }, (status) => {
      if (status.event === 'CHANNEL_ERROR') {
        setIsConnected(false)
        setError('Connection lost. Using polling updates...')
      }

      if (status.event === 'CONNECTED') {
        setIsConnected(true)
        setError(null)
      }
    })

    return () => {
      channel.unsubscribe()
      clearInterval(pollingInterval)
    }
  }, [fetchEntryGateData, handleRealtimeUpdate])

  return {
    gateData,
    isLoading,
    isConnected,
    error,
    refetch: fetchEntryGateData
  }
}
