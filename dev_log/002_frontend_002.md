# Unit 02: Frontend Development - Subunit 002: Assistant-UI Chat Integration

## Objective

Properly integrate assistant-ui library using its native primitives and theming system to create a modern chat interface. Build on assistant-ui's architecture rather than bypassing it, establishing a solid foundation for both static conversations and future live AWS Bedrock integration.

## Technical Approach

### Assistant-UI Package Selection
- **@assistant-ui/react** (v0.10.43) - Core unstyled chat primitives and runtime
- **@assistant-ui/react-markdown** - Markdown rendering for content
- **@assistant-ui/react-ai-sdk** - Future AWS Bedrock integration support

### Styling Strategy
- **Tailwind CSS** - Keep existing Tailwind setup (assistant-ui is unstyled, Tailwind is optional but recommended)
- **CSS variables for theming** - Use semantic color tokens that work with Tailwind
- **Utility classes for layout** - Use Tailwind for spacing, flexbox, responsive design
- **Avoid direct color classes** - Use `text-foreground` instead of `text-orange-900`

### Architecture Decisions
- **Use assistant-ui primitives** - Thread, Message, Composer components as intended
- **StaticRuntime integration** - Use assistant-ui's StaticRuntime for pre-built conversations
- **Hybrid styling approach** - CSS variables for colors + Tailwind utilities for layout
- **Solve TypeScript issues** - Work through complexity rather than bypassing it
- **Follow assistant-ui patterns** - Build on their architecture, don't replace it

## Implementation Plan

### Phase 1: Package Installation
1. Install core assistant-ui packages
2. Verify compatibility with existing dependencies
3. Test basic imports and TypeScript support
4. Study assistant-ui documentation and examples

### Phase 2: Basic Assistant-UI Integration
1. Import and use `Thread` component from assistant-ui
2. Set up `StaticRuntime` for static conversations
3. Replace homepage with proper assistant-ui Thread component
4. Ensure TypeScript compilation works with assistant-ui types

### Phase 3: Assistant-UI Theming Setup
1. Configure assistant-ui's CSS variable theming system
2. Create theme variants using CSS custom properties
3. Integrate JetBrains Mono through CSS variables
4. Test theme switching with assistant-ui components

### Phase 4: Static Runtime Configuration
1. Configure StaticRuntime with conversation data structure
2. Test message rendering with assistant-ui primitives
3. Verify auto-scroll and responsive behavior work natively
4. Prepare conversation data format for Unit 2.3

## Files to Create/Modify

### New Assistant-UI Integration
- `components/chat/assistant-thread.tsx` - Proper Thread component using assistant-ui primitives
- `components/chat/static-runtime-provider.tsx` - StaticRuntime configuration and provider
- `lib/assistant-ui-theme.css` - CSS variables for assistant-ui theming
- `src/app/page.tsx` - Homepage with proper assistant-ui Thread integration

### Theme Configuration
- `src/app/globals.css` - Tailwind import + CSS variables for theming
- `components/theme-provider.tsx` - Theme switching with CSS variable updates
- `lib/theme-config.ts` - Theme definitions using semantic color tokens

### TypeScript Configuration
- `types/assistant-ui.d.ts` - Type definitions and extensions for assistant-ui
- `lib/conversation-types.ts` - Static conversation data types

## Success Criteria

1. ✅ Assistant-UI packages install without conflicts
2. ✅ Thread component renders using assistant-ui primitives (not custom components)
3. ✅ StaticRuntime properly configured and working
4. ✅ Theming uses CSS variables (not direct Tailwind classes)
5. ✅ TypeScript compilation succeeds with assistant-ui types
6. ✅ JetBrains Mono integrates through CSS variable system
7. ✅ Message rendering uses assistant-ui's native components
8. ✅ Auto-scroll and responsive behavior work natively
9. ✅ Build process completes successfully
10. ✅ Foundation ready for static conversations (Unit 2.3)

## Implementation Examples

### Correct Assistant-UI Usage
```tsx
// components/chat/assistant-thread.tsx
import { Thread } from "@assistant-ui/react";
import { useStaticRuntime } from "@assistant-ui/react";

export function AssistantThread() {
  const runtime = useStaticRuntime({
    messages: [
      {
        role: "assistant",
        content: "Hello! I'm Roberto. What would you like to know about me?"
      }
    ]
  });

  return <Thread runtime={runtime} />;
}
```

### Correct Theming Approach
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-muted: hsl(var(--muted));
}

:root {
  --background: 255 255 255;
  --foreground: 15 23 42;
  --primary: 59 130 246;
  --muted: 248 250 252;
}

.claude-theme {
  --background: 254 242 242; /* orange-50 */
  --foreground: 154 52 18;   /* orange-900 */
  --primary: 249 115 22;     /* orange-500 */
  --muted: 255 237 213;      /* orange-100 */
}
```

```tsx
// Use semantic Tailwind classes that reference CSS variables
<Thread className="bg-background text-foreground border-border" />
<div className="flex flex-col h-full px-4 py-2"> {/* Layout utilities OK */}
```

## Antipatterns to Avoid

### ❌ Don't Create Custom Chat Components
```tsx
// DON'T DO THIS - bypasses assistant-ui
function CustomChatInterface() {
  const [messages, setMessages] = useState([]);
  return (
    <div className="chat-container">
      {messages.map(msg => <CustomMessage />)}
    </div>
  );
}
```

### ❌ Don't Use Direct Color Classes for Theming
```tsx
// DON'T DO THIS - hard-coded colors, no theme switching
<div className="bg-orange-100 text-orange-900 border-orange-200">
  Message content
</div>

// DO THIS INSTEAD - semantic classes with CSS variables
<div className="bg-muted text-foreground border-border">
  Message content
</div>
```

### ❌ Don't Bypass TypeScript Issues
```tsx
// DON'T DO THIS - avoiding TypeScript problems
const runtime = useStaticRuntime(data as any);
```

### ❌ Don't Create Custom State Management
```tsx
// DON'T DO THIS - assistant-ui handles this
const [isTyping, setIsTyping] = useState(false);
const [currentMessage, setCurrentMessage] = useState("");
```

### ✅ Tailwind Layout Utilities Are Fine
```tsx
// THIS IS OK - layout and spacing utilities
<div className="flex flex-col h-full px-4 py-2 rounded-lg">
  <Thread className="bg-background text-foreground" />
</div>
```

## AI Interactions

This unit will involve:
- Learning assistant-ui's proper usage patterns
- Configuring StaticRuntime with conversation data
- Setting up CSS variable theming system
- Solving TypeScript integration challenges
- Testing assistant-ui components and behavior

## Next Steps

After completion, this will enable:
- **002_frontend_003**: Static conversation implementation using assistant-ui
- **002_frontend_004**: Real markdown content integration with assistant-ui
- **004_api-chat**: AWS Bedrock live chat integration using assistant-ui runtime

## Status: Ready to Start

**Target Implementation Date:** August 22, 2025  
**Estimated Duration:** 45-60 minutes

### Key Focus Areas

1. **Follow assistant-ui documentation exactly** - Don't deviate from their patterns
2. **Solve TypeScript issues** - Work through complexity rather than bypassing
3. **Use CSS variables for theming** - Integrate with assistant-ui's system
4. **Build incrementally** - Get basic functionality working first, then customize
5. **Test thoroughly** - Ensure assistant-ui features work as intended

The goal is to have a proper assistant-ui integration that leverages all of its built-in functionality and can be extended naturally for future enhancements.
