# Library Utilities

Folder ini berisi utility functions dan helper modules untuk Smart Parking System.

## Files

### theme-utils.ts
Utility functions untuk dark mode theme management.

**Functions:**
- `getSystemTheme()` - Detect system color scheme preference
- `getStoredTheme()` - Retrieve theme dari localStorage
- `setStoredTheme(theme)` - Save theme ke localStorage
- `getEffectiveTheme(theme)` - Convert 'system' theme ke actual 'light' atau 'dark'
- `applyTheme(theme)` - Apply dark class ke HTML element

**Types:**
- `Theme` - 'light' | 'dark' | 'system'

**Storage Key:** `parking-system-theme`
