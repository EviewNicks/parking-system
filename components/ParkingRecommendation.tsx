'use client';

import { useState, useEffect } from 'react';
import { ParkingSlotWithDistance, RecommendationResponse } from '@/types/parking';

export default function ParkingRecommendation({ autoTrigger = false }: { autoTrigger?: boolean }) {
  const [recommendation, setRecommendation] = useState<ParkingSlotWithDistance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [triggerSource, setTriggerSource] = useState<'manual' | 'auto' | null>(null);

  // Handle auto-trigger from parent
  useEffect(() => {
    if (autoTrigger) {
      getRecommendation('auto');
    }
  }, [autoTrigger]);

  const getRecommendation = async (source: 'manual' | 'auto' = 'manual') => {
    // Manual override: allow manual trigger even during auto-trigger
    if (loading && source === 'manual') return;

    setLoading(true);
    setError(null);
    setRecommendation(null);
    setTriggerSource(source);

    try {
      const startTime = Date.now();

      const response = await fetch('/api/recommend', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

      const data: RecommendationResponse = await response.json();
      const responseTime = Date.now() - startTime;

      console.log(`API Response Time: ${responseTime}ms | Source: ${source}`);

      if (data.success && data.data?.slot) {
        setRecommendation(data.data.slot);
        setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      } else {
        setError(data.error || 'Tidak ada slot tersedia');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal mengambil rekomendasi. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return '🔄';
    if (error) return '⚠️';
    if (recommendation) return '✅';
    return '🅿️';
  };

  const getStatusColor = () => {
    if (loading) return triggerSource === 'auto' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600';
    if (error) return 'bg-red-500 hover:bg-red-600';
    return 'bg-green-600 hover:bg-green-700';
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Main Recommendation Card */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            🎯 Rekomendasi Parkir
          </h2>
          <p className="text-slate-300 text-sm">
            Temukan slot parkir terdekat dari pintu masuk
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => getRecommendation("manual")}
          disabled={loading}
          className={`
            w-full py-4 px-6 rounded-xl font-bold text-white
            transition-all duration-300 transform hover:scale-105
            disabled:scale-100 disabled:cursor-not-allowed
            shadow-lg hover:shadow-xl
            flex items-center justify-center gap-3
            ${getStatusColor()}
          `}
        >
          <span className="text-xl">{getStatusIcon()}</span>
          <span className="text-lg">
            {loading ? (triggerSource === 'auto' ? '🤖 Auto-Rekomendasi...' : 'Mencari Parkir...') : 'Cari Parkir Terdekat'}
          </span>
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-red-300 font-semibold">{error}</p>
                <p className="text-red-400 text-sm mt-1">
                  Coba lagi beberapa saat
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Result */}
        {recommendation && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-xl">
            {/* Success Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-500/30 px-4 py-2 rounded-full">
                <span className="text-2xl">🎉</span>
                <span className="text-green-300 font-bold text-sm">
                  REKOMENDASI DITEMUKAN!
                </span>
              </div>
            </div>

            {/* Slot Information */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    SLOT {recommendation.slot}
                  </h3>
                  <p className="text-green-400 text-lg font-mono">
                    📍 {recommendation.distance}m dari pintu masuk
                  </p>
                </div>
                <div className="text-5xl">
                  🅿️
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400">Status</p>
                <p className="text-green-400 font-bold">TERSEDIA</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400">Koordinat</p>
                <p className="text-blue-400 font-mono text-xs">
                  ({recommendation.coordinate_x}, {recommendation.coordinate_y})
                </p>
              </div>
            </div>

            {/* Trigger Source Indicator */}
            {triggerSource && (
              <div className="text-center mb-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  triggerSource === 'auto'
                    ? 'bg-yellow-500/30 text-yellow-300'
                    : 'bg-blue-500/30 text-blue-300'
                }`}>
                  <span>{triggerSource === 'auto' ? '🤖' : '👆'}</span>
                  <span>{triggerSource === 'auto' ? 'Auto-Detected' : 'Manual Request'}</span>
                </div>
              </div>
            )}

            {/* Last Updated */}
            {lastUpdated && (
              <div className="mt-4 text-center">
                <p className="text-slate-400 text-xs">
                  Diperbarui: {lastUpdated}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            💡 <span className="text-yellow-400">Tips:</span> Sistem menggunakan perhitungan jarak Euclidean
            untuk menemukan slot parkir terdekat dari pintu masuk
          </p>
        </div>
      </div>
    </div>
  );
}