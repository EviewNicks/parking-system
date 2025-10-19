'use client'

import { useState, useCallback } from 'react'

interface EntryGateProps {
  distance: number
  isConnected: boolean
  lastUpdate: string
  onVehicleDetected?: () => void
}

export default function EntryGate({ distance, isConnected, lastUpdate, onVehicleDetected }: EntryGateProps) {
  const [autoTriggerActive, setAutoTriggerActive] = useState(false)
  const isVehicleDetected = distance > 0 && distance < 100

  // Auto-trigger logic when vehicle is detected
  useCallback(() => {
    if (isVehicleDetected && !autoTriggerActive && onVehicleDetected) {
      setAutoTriggerActive(true)

      // 2.5 second delay before triggering recommendation
      const timer = setTimeout(() => {
        onVehicleDetected()
        setAutoTriggerActive(false)
      }, 2500)

      return () => clearTimeout(timer)
    } else if (!isVehicleDetected) {
      setAutoTriggerActive(false)
    }
  }, [isVehicleDetected, autoTriggerActive, onVehicleDetected])

  const getStatusColor = () => {
    if (!isConnected) return 'bg-gray-500 border-gray-400'
    if (autoTriggerActive) return 'bg-yellow-500 border-yellow-400 animate-pulse'
    return isVehicleDetected ? 'bg-blue-500 border-blue-400' : 'bg-green-500 border-green-400'
  }

  const getStatusText = () => {
    if (!isConnected) return 'OFFLINE'
    if (autoTriggerActive) return 'MENYIAPKAN REKOMENDASI...'
    return isVehicleDetected ? 'MOBIL TERDETEKSI' : 'SIAP'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 shadow-lg ${getStatusColor()}`}>
      {/* Gate Label */}
      <div className="absolute -top-3 -left-3 bg-slate-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">
        ENTRY
      </div>

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Gate Icon Visual */}
      <div className="text-center mb-4">
        {isVehicleDetected ? (
          <div className="text-4xl animate-pulse">🚗</div>
        ) : (
          <div className="text-4xl">🚧</div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-white">
          PINTU MASUK
        </h3>
        <p className="text-sm font-semibold text-white">
          {getStatusText()}
        </p>
      </div>

      {/* Distance Display */}
      <div className="text-center mb-2">
        <p className="text-white text-sm">
          Jarak: <span className="font-mono font-bold">{distance}</span> cm
        </p>
      </div>

      {/* Sensor Status */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isVehicleDetected ? 'bg-yellow-300 animate-pulse' : 'bg-white opacity-50'}`}></div>
          <p className="text-white text-xs">
            Sensor Ultrasonic
          </p>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-center">
        <p className="text-white text-xs opacity-80">
          Update: {formatDate(lastUpdate)}
        </p>
      </div>

      {/* Gate Base Visual Effect */}
      <div className="absolute bottom-0 left-2 right-2 h-1 bg-white opacity-50 rounded-t-sm"></div>
    </div>
  )
}
