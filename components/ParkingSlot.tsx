'use client'

import { ParkingSlot as ParkingSlotType } from '@/lib/supabase'

interface ParkingSlotProps {
  slot: ParkingSlotType
  isConnected: boolean
}

export default function ParkingSlot({ slot, isConnected }: ParkingSlotProps) {
  const getStatusColor = () => {
    switch (slot.status.toLowerCase()) {
      case 'terisi':
        return 'bg-red-500 border-red-400'
      case 'kosong':
        return 'bg-green-500 border-green-400'
      case 'maintenance':
        return 'bg-yellow-500 border-yellow-400'
      default:
        return 'bg-gray-500 border-gray-400'
    }
  }

  const getStatusText = () => {
    switch (slot.status.toLowerCase()) {
      case 'terisi':
        return 'TERISI'
      case 'kosong':
        return 'KOSONG'
      case 'maintenance':
        return 'MAINTENANCE'
      default:
        return 'UNKNOWN'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 shadow-lg ${getStatusColor()}`}>
      {/* Slot Number */}
      <div className="absolute -top-3 -left-3 bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
        {slot.slot}
      </div>

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Car Icon Visual */}
      <div className="text-center mb-4">
        {slot.status.toLowerCase() === 'terisi' ? (
          <div className="text-4xl">🚗</div>
        ) : slot.status.toLowerCase() === 'maintenance' ? (
          <div className="text-4xl">🔧</div>
        ) : (
          <div className="text-4xl opacity-30">⬜</div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-white">
          SLOT {slot.slot}
        </h3>
        <p className="text-sm font-semibold text-white">
          {getStatusText()}
        </p>
      </div>

      {/* Distance Display */}
      <div className="text-center mb-2">
        <p className="text-white text-sm">
          Jarak: <span className="font-mono font-bold">{slot.jarak}</span> cm
        </p>
      </div>

      {/* Last Update */}
      <div className="text-center">
        <p className="text-white text-xs opacity-80">
          Update: {formatDate(slot.created_at)}
        </p>
      </div>

      {/* Parking Lines Visual Effect */}
      <div className="absolute bottom-0 left-2 right-2 h-1 bg-white opacity-50 rounded-t-sm"></div>
    </div>
  )
}