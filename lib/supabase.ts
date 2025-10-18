import { createClient } from '@supabase/supabase-js'

// TypeScript interfaces untuk parking data
export interface ParkingSlot {
  id: number
  slot: number
  status: 'terisi' | 'kosong' | 'maintenance'
  jarak: number
  created_at: string
}

export interface EntryGateData {
  id: number
  distance: number
  is_vehicle_detected: boolean
  created_at: string
}

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Table name dari environment variable
export const TABLE_NAME = process.env.TABLE_NAME || 'parkingg'
export const ENTRY_GATE_TABLE = 'entry_gate'

// Helper functions untuk database operations
export const getParkingSlots = async (): Promise<ParkingSlot[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('slot', { ascending: true })

  if (error) {
    console.error('Error fetching parking slots:', error)
    throw error
  }

  return data || []
}

export const subscribeToParkingChanges = (callback: (slot: ParkingSlot) => void) => {
  return supabase
    .channel('parking-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE_NAME
      },
      (payload) => {
        console.log('Real-time perubahan:', payload.new)
        if (payload.new) {
          callback(payload.new as ParkingSlot)
        }
      }
    )
    .subscribe()
}

export const getEntryGateData = async (): Promise<EntryGateData | null> => {
  const { data, error } = await supabase
    .from(ENTRY_GATE_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching entry gate data:', error)
    return null
  }

  return data
}

export const subscribeToEntryGateChanges = (callback: (data: EntryGateData) => void) => {
  return supabase
    .channel('entry-gate-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: ENTRY_GATE_TABLE
      },
      (payload) => {
        console.log('Real-time entry gate update:', payload.new)
        if (payload.new) {
          callback(payload.new as EntryGateData)
        }
      }
    )
    .subscribe()
}