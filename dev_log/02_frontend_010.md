# 002_frontend_010: Claude Theme Input Styling & Theme Configuration

## Objective
Enhance the Claude theme with specific input box styling and implement a configuration system to control UI elements and set the default theme to Claude.

## Requirements Analysis

### Claude Theme Input Box Styling
Based on the provided screenshot (`tmp/panel.png`), the input box currently has a blue border and dark background. The requirements are:
- **Active border color**: `#5B5A56` (warm gray)
- **Input box background**: `#30302E` (darker charcoal)
- Apply these changes specifically to the `.claude-theme` CSS class

### Theme Configuration System
Create a configuration system to:
- **Default theme**: Set Claude as the default theme for the website
- **Theme selector visibility**: Control whether users can change themes via the sidebar selector

### Current State Analysis
- Theme selector is currently visible in bottom-right of sidebar
- Input styling uses CSS custom properties in `globals.css`
- Claude theme already defined with custom color variables
- Theme defaults to "default" theme, needs to be changed to "claude"

## Implementation Plan

### 1. CSS Updates for Claude Theme
**File**: `/src/app/globals.css`
- Update `.claude-theme` section
- Modify `--input` and `--ring` variables for Claude theme specifically
- Ensure changes only affect Claude theme, not default or dark themes

### 2. Configuration System
**File**: `/src/app/config.ts` (new)
- Create TypeScript configuration interface
- Define theme configuration and UI feature flags
- Set Claude as default theme

### 3. Theme Provider Updates
**File**: `/components/theme-provider.tsx`
- Import configuration
- Initialize with configured default theme instead of hardcoded "default"

### 4. Theme Selector Control
**File**: `/components/chat/topic-sidebar.tsx`
- Import configuration
- Conditionally render theme selector based on config
- Maintain existing functionality when enabled

## Technical Details

### CSS Variable Updates
```css
.claude-theme {
  /* Input styling - specific to Claude theme */
  --input: 0 0% 19%;     /* #30302E - Input background */
  --ring: 0 0% 36%;      /* #5B5A56 - Active border */
}
```

### Configuration Interface
```typescript
interface AppConfig {
  ui: {
    showThemeSelector: boolean;
  };
  theme: "default" | "dark" | "claude";
}
```

## Files to be Modified
- `/src/app/config.ts` - New configuration system
- `/src/app/globals.css` - Claude theme input colors
- `/components/theme-provider.tsx` - Use configured default theme
- `/components/chat/topic-sidebar.tsx` - Theme selector visibility
- `/components/chat/new-conversation-thread.tsx` - Input styling fix
- `/components/chat/topic-thread.tsx` - Input styling fix
- `/components/chat/assistant-thread.tsx` - Input styling fix

## Expected Outcome
- Claude theme input box matches specified colors (#5B5A56 border, #30302E background)
- Website defaults to Claude theme on first load
- Configuration system allows easy control of UI elements
- Theme selector visibility controlled via configuration
- Changes are isolated to Claude theme only
- System remains maintainable and extensible

## Testing Checklist
- [ ] Claude theme input box shows correct colors
- [ ] Active/focus states work properly with new colors
- [ ] Default and dark themes remain unchanged
- [ ] Website loads with Claude theme by default
- [ ] Theme selector shows/hides based on configuration
- [ ] All themes continue to function properly

## AI Interactions
This unit will require:
1. CSS color value conversion and variable updates
2. TypeScript configuration system design
3. React component conditional rendering implementation
4. Theme provider initialization updates

## Status: Complete

### Implementation Summary
Successfully implemented Claude theme input styling and theme configuration system:

1. **CSS Updates**: Updated `.claude-theme` in `globals.css` with specific colors:
   - Input background: `#30302E` (--input: 0 0% 19%)
   - Active border: `#5B5A56` (--ring: 0 0% 36%)

2. **Input Component Updates**: Fixed input styling to use semantic CSS classes:
   - Changed `bg-background` to `bg-input` in all ComposerPrimitive.Input components
   - Added `border border-border` for consistent border styling
   - Updated focus states to use `focus:border-ring` instead of focus rings
   - Ensures CSS variables take effect properly

3. **Configuration System**: Created `/src/app/config.ts` with:
   - TypeScript interface for UI feature flags and theme configuration
   - Default theme set to "claude"
   - Theme selector visibility control (currently enabled)

4. **Theme Provider Updates**: Updated `ThemeProvider` component:
   - Imported configuration system
   - Initialize with configured default theme instead of hardcoded "default"
   - Website now loads with Claude theme by default

5. **Theme Selector Control**: Updated `TopicSidebar` component:
   - Imported configuration system
   - Added conditional rendering for theme selector
   - Currently visible so users can change themes

### Files Modified
- `/src/app/config.ts` - New configuration system
- `/src/app/globals.css` - Claude theme input colors
- `/components/theme-provider.tsx` - Use configured default theme
- `/components/chat/topic-sidebar.tsx` - Conditional theme selector
- `/components/chat/new-conversation-thread.tsx` - Input styling fix
- `/components/chat/topic-thread.tsx` - Input styling fix
- `/components/chat/assistant-thread.tsx` - Input styling fix

### Testing Results
- ✅ TypeScript compilation successful
- ✅ Website loads with Claude theme by default
- ✅ Theme selector visible and functional
- ✅ Claude theme input colors applied correctly
- ✅ Input focus states use warm gray border (#5B5A56)
- ✅ Configuration system working as expected
- ✅ No breaking changes to existing functionality

### Configuration Usage
Current configuration in `/src/app/config.ts`:
```typescript
export const appConfig: AppConfig = {
  ui: {
    showThemeSelector: true,   // Theme selector visible
  },
  theme: "claude",  // Claude set as default theme
};
```

To hide theme selector: set `showThemeSelector: false`
To change default theme: modify `theme` value to "default", "dark", or "claude"
