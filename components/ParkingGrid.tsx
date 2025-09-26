"use client";

import { useParkingData } from "@/hooks/useParkingData";
import ParkingSlot from "./ParkingSlot";
import ParkingGate from "./ParkingGate";

export default function ParkingGrid() {
  const { slots, isLoading, isConnected, error, refetch } = useParkingData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading parking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-white text-lg mb-4">Connection Error</p>
          <p className="text-red-300 text-sm mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🚗 Smart Parking System
        </h1>
        <p className="text-slate-300 text-lg">
          Real-time Monitoring • 6 Parking Slots
        </p>

        {/* Connection Status */}
        <div className="flex items-center justify-center mt-4">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          ></div>
          <span
            className={`text-sm ${
              isConnected ? "text-green-300" : "text-red-300"
            }`}
          >
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>
      </div>

      <ParkingGate />

      {/* Parking Lot Layout */}
      <div className="max-w-6xl mx-auto">
        {/* Entry Arrow */}
        <div className="text-center mb-6">
          <div className="text-yellow-400 text-2xl">⬇️ ENTRY</div>
        </div>

        {/* Parking Grid - Realistic Layout */}
        <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl">
          {/* Road Markings */}
          <div className="absolute inset-4 border-2 border-dashed border-yellow-400 rounded-xl opacity-30"></div>

          {/* Grid Container - 2x3 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Row 1: Slots 1-3 */}
            {slots.slice(0, 3).map((slot) => (
              <div key={slot.id} className="relative">
                <ParkingSlot slot={slot} isConnected={isConnected} />
              </div>
            ))}
          </div>

          {/* Middle Road */}
          <div className="my-8 flex items-center justify-center">
            <div className="flex-1 h-1 bg-yellow-400 opacity-50"></div>
            <div className="px-4 text-yellow-400 text-sm font-mono">
              DRIVE WAY
            </div>
            <div className="flex-1 h-1 bg-yellow-400 opacity-50"></div>
          </div>

          {/* Second Grid - Slots 4-6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {slots.slice(3, 6).map((slot) => (
              <div key={slot.id} className="relative">
                <ParkingSlot slot={slot} isConnected={isConnected} />
              </div>
            ))}
          </div>
        </div>

        {/* Exit Arrow */}
        <div className="text-center mt-6">
          <div className="text-yellow-400 text-2xl">⬆️ EXIT</div>
        </div>

        {/* Statistics Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {slots.filter((s) => s.status.toLowerCase() === "kosong").length}
            </div>
            <div className="text-sm">Available</div>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {slots.filter((s) => s.status.toLowerCase() === "terisi").length}
            </div>
            <div className="text-sm">Occupied</div>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {
                slots.filter((s) => s.status.toLowerCase() === "maintenance")
                  .length
              }
            </div>
            <div className="text-sm">Maintenance</div>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm">Total Slots</div>
          </div>
        </div>
      </div>
    </div>
  );
}
