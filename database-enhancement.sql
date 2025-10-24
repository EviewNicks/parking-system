-- Database Enhancement Script for Distance-Based Parking Recommendation
-- Execute this script in Supabase SQL Editor

-- Step 1: Add coordinate columns to parkingg table
ALTER TABLE parkingg
ADD COLUMN IF NOT EXISTS coordinate_x FLOAT,
ADD COLUMN IF NOT EXISTS coordinate_y FLOAT;

-- Step 2: Update existing records with coordinates based on grid layout
-- Layout: 2 rows grid [1][2][3] on top, [4][5] on bottom
-- Entrance/EntryGate coordinate: (1, 4) - physical gate position on left side

-- Row 1 (y=2): Slots 1, 2, 3
UPDATE parkingg SET coordinate_x = 2, coordinate_y = 2 WHERE slot = 1;
UPDATE parkingg SET coordinate_x = 6, coordinate_y = 2 WHERE slot = 2;
UPDATE parkingg SET coordinate_x = 10, coordinate_y = 2 WHERE slot = 3;

-- Row 2 (y=6): Slots 4, 5
UPDATE parkingg SET coordinate_x = 2, coordinate_y = 6 WHERE slot = 4;
UPDATE parkingg SET coordinate_x = 6, coordinate_y = 6 WHERE slot = 5;

-- Step 3: Verify the updates
SELECT slot, coordinate_x, coordinate_y, status
FROM parkingg
ORDER BY slot ASC;

-- Step 4: Create index for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_parking_coordinates ON parkingg(coordinate_x, coordinate_y);

-- Step 5: Test query for available slots with coordinates
SELECT slot, coordinate_x, coordinate_y, status, created_at,
       SQRT(POWER(coordinate_x - 1, 2) + POWER(coordinate_y - 4, 2)) as distance_from_gate
FROM parkingg
WHERE status = 'kosong'
ORDER BY distance_from_gate ASC;