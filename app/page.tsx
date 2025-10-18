"use client";

import ParkingGrid from "@/components/ParkingGrid";
import EntryGate from "@/components/EntryGate";
import { useEntryGateData } from "@/hooks/useEntryGateData";

export default function Home() {
  const {
    gateData,
    isLoading: gateLoading,
    isConnected: gateConnected,
  } = useEntryGateData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Entry Gate - Left Side */}
          <div className="w-full lg:w-auto flex-shrink-0">
            {gateLoading ? (
              <div className="w-64 h-64 bg-slate-800 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : gateData ? (
              <EntryGate
                distance={gateData.distance}
                isConnected={gateConnected}
                lastUpdate={gateData.created_at}
              />
            ) : null}
          </div>

          {/* Parking Grid - Right Side */}
          <div className="flex-1 w-full">
            <ParkingGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
