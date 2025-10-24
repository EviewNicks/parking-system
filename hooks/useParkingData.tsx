"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ParkingSlot,
  getParkingSlots,
  subscribeToParkingChanges,
} from "@/lib/supabase";

export interface UseParkingDataReturn {
  slots: ParkingSlot[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  refetch: () => void;
}

export const useParkingData = (): UseParkingDataReturn => {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  const fetchParkingSlots = useCallback(async (isPolling = false) => {
    try {
      // Only show loading state for initial fetch, not for polling
      if (!isPolling) {
        setIsLoading(true);
      }
      setError(null);
      const data = await getParkingSlots();

      // Ensure we have exactly 5 slots (create empty ones if needed)
      const normalizedSlots: ParkingSlot[] = [];
      for (let i = 1; i <= 5; i++) {
        const existingSlot = data.find((slot) => slot.slot === i);
        if (existingSlot) {
          normalizedSlots.push(existingSlot);
        } else {
          // Create placeholder untuk slot yang belum ada di database
          normalizedSlots.push({
            id: i,
            slot: i,
            status: "kosong",
            jarak: 0,
            created_at: new Date().toISOString(),
          });
        }
      }

      // Only update state if data actually changed (avoid unnecessary re-renders)
      setSlots((prevSlots) => {
        const hasChanged = JSON.stringify(prevSlots) !== JSON.stringify(normalizedSlots);
        return hasChanged ? normalizedSlots : prevSlots;
      });
      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching parking data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch parking data"
      );
      setIsConnected(false);
    } finally {
      if (!isPolling) {
        setIsLoading(false);
      }
    }
  }, []);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((updatedSlot: ParkingSlot) => {
    setSlots((prevSlots) => {
      return prevSlots.map((slot) => {
        if (slot.slot === updatedSlot.slot) {
          return { ...updatedSlot };
        }
        return slot;
      });
    });
    setIsConnected(true);
    setError(null);
  }, []);

  useEffect(() => {
    // Load initial data
    fetchParkingSlots(false);

    // Setup real-time subscription
    const channel = subscribeToParkingChanges(handleRealtimeUpdate);

    // Setup polling every 1 second (guaranteed updates like HTML version)
    const pollingInterval = setInterval(() => {
      fetchParkingSlots(true); // Mark as polling to avoid loading states
    }, 1000);

    // Handle connection status
    channel.on("system", { event: "*" }, (status) => {
      if (status.event === "CHANNEL_ERROR") {
        setIsConnected(false);
        setError("Connection lost. Using polling updates...");
      }

      if (status.event === "CONNECTED") {
        setIsConnected(true);
        setError(null);
      }
    });

    // Cleanup subscription and polling on unmount
    return () => {
      channel.unsubscribe();
      clearInterval(pollingInterval);
    };
  }, [fetchParkingSlots, handleRealtimeUpdate]);

  return {
    slots,
    isLoading,
    isConnected,
    error,
    refetch: fetchParkingSlots,
  };
};
