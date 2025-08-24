# 002_frontend_009: New Conversation Button Styling

## Objective
Style the "New Conversation" button in the left sidebar to match the visual consistency of other menu options, including the slight orange accent and border styling when active/selected.

## Current State Analysis
The "New Conversation" button currently has:
- Dashed border styling (`border-dashed border-border`)
- Hover state with muted background and primary border accent
- Different visual treatment from topic thread buttons

Topic thread buttons have:
- Active state: `bg-primary/10 border-primary/20 text-foreground`
- Inactive state: `border-transparent hover:bg-muted`
- Consistent solid border styling

## Requirements

### Visual Consistency
1. **Active State Styling**: When "New Conversation" is the current active view, it should have:
   - Light orange/primary background (`bg-primary/10`)
   - Orange/primary border (`border-primary/20`)
   - Consistent text color (`text-foreground`)

2. **Inactive State Styling**: When not active:
   - Transparent border (`border-transparent`)
   - Hover background (`hover:bg-muted`)
   - Consistent with other menu items

3. **Icon Styling**: 
   - Active: Orange/primary color (`text-primary`)
   - Inactive: Muted color (`text-muted-foreground`)

### Implementation Details

#### Component Updates Required
- **File**: `/components/chat/topic-sidebar.tsx`
- **Props**: Add `isNewConversationActive` boolean prop to track active state
- **Styling**: Replace current button classes with conditional styling matching topic threads

#### Styling Classes
```tsx
// Active state
"bg-primary/10 border-primary/20 text-foreground"

// Inactive state  
"border-transparent hover:bg-muted"

// Icon classes
isActive ? "text-primary" : "text-muted-foreground"
```

#### State Management
- Parent component needs to track when "New Conversation" view is active
- Pass `isNewConversationActive` prop to `TopicSidebar`
- Update styling conditionally based on this state

## Implementation Steps

1. **Update TopicSidebar Props**
   - Add `isNewConversationActive?: boolean` to `TopicSidebarProps`

2. **Modify Button Styling**
   - Replace current button classes with conditional styling
   - Match the exact pattern used for topic thread buttons

3. **Update Icon Styling**
   - Apply conditional coloring to `PlusIcon`
   - Use same color logic as topic thread icons

4. **Parent Component Integration**
   - Update parent component to track new conversation state
   - Pass appropriate boolean value to sidebar

## Expected Outcome
- "New Conversation" button visually matches other sidebar options
- Consistent orange accent color when active
- Unified border and background styling across all menu items
- Improved visual hierarchy and user experience

## Testing Checklist
- [ ] New Conversation button shows active state when selected
- [ ] Active state matches topic thread styling exactly
- [ ] Hover states work consistently
- [ ] Icon colors change appropriately with state
- [ ] All themes (default, dark, claude) display correctly
- [ ] Visual consistency maintained across different screen sizes

## Files Modified
- `/components/chat/topic-sidebar.tsx` - Main styling updates
- Parent component calling `TopicSidebar` - State management

## Design Notes
The orange accent color comes from the CSS custom property `--primary` which adapts to the current theme. This ensures the styling works consistently across all three themes (default, dark, claude).
