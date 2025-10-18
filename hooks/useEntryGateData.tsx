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

  const fetchEntryGateData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getEntryGateData()

      if (data) {
        setGateData(data)
      } else {
        setGateData({
          id: 1,
          distance: 0,
          is_vehicle_detected: false,
          created_at: new Date().toISOString()
        })
      }

      setIsConnected(true)
    } catch (err) {
      console.error('Error fetching entry gate data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch entry gate data')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRealtimeUpdate = useCallback((updatedData: EntryGateData) => {
    setGateData(updatedData)
    setIsConnected(true)
    setError(null)
  }, [])

  useEffect(() => {
    fetchEntryGateData()

    const channel = subscribeToEntryGateChanges(handleRealtimeUpdate)

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

    return () => {
      channel.unsubscribe()
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
