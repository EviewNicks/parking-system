"use client";

import { useState, useCallback } from "react";
import ParkingGrid from "@/components/ParkingGrid";
import EntryGate from "@/components/EntryGate";
import ParkingRecommendation from "@/components/ParkingRecommendation";
import { useEntryGateData } from "@/hooks/useEntryGateData";

export default function Home() {
  const [autoRecommendation, setAutoRecommendation] = useState(false);

  const {
    gateData,
    isLoading: gateLoading,
    isConnected: gateConnected,
  } = useEntryGateData();

  // Handle auto-trigger from EntryGate
  const handleVehicleDetected = useCallback(() => {
    setAutoRecommendation(true);
    // Reset after a short delay to allow multiple triggers
    setTimeout(() => setAutoRecommendation(false), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Recommendation */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            🚗 Smart Parking System
          </h1>
          <p className="text-slate-300 text-lg">
            Real-time Monitoring • AI-Powered Recommendations
          </p>

          {/* Parking Recommendation Component */}
          <div className="mt-6">
            <ParkingRecommendation autoTrigger={autoRecommendation} />
          </div>
        </div>

        {/* Main Content Area */}
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
                onVehicleDetected={handleVehicleDetected}
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
