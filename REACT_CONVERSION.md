# React + Tailwind Conversion Guide

## Already Implemented

The calculator is built with React + Tailwind and fully functional.

## File Structure

```
src/
├── Calculator.tsx          # Main calculator component
├── index.css              # 3D button animations
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

## Key Features Implemented

### 1. Standard Calculator
- Basic arithmetic operations (+, -, ×, ÷)
- Decimal support
- Clear and backspace
- History tracking (last 10 operations)

### 2. Scientific Calculator
- Trigonometric functions (sin, cos, tan)
- Degree/Radian toggle
- Logarithms (log, ln)
- Square root and powers (x², x^y)
- Factorial
- Exponential function
- Parentheses support

### 3. Programmer Mode
- Base conversion (BIN, OCT, DEC, HEX)
- Real-time conversion display
- Bitwise operations (AND, OR, XOR, NOT, LSHIFT, RSHIFT)
- Base-aware input validation

### 4. Date Mode
- Date difference calculator (days, months, years)
- Age calculator (years, months, days)
- Date input with native date picker

### 5. Theme System
- Dark mode (lotus pond aesthetic)
- Light mode (cream base)
- Smooth 300ms transitions
- localStorage persistence
- Elegant toggle switch with icons

### 6. 3D Button System
- REST: Raised with outer shadow + top highlight
- HOVER: Elevated (-2px translateY)
- ACTIVE: Pressed inset shadow + scale(0.97) + ripple
- Spring physics micro-bounce
- Minimum 48x48px touch targets
- Keyboard navigation support

## Component Architecture

### State Management
```typescript
- theme: 'light' | 'dark'
- mode: 'standard' | 'scientific' | 'programmer' | 'date'
- display: string
- expression: string
- angleMode: 'deg' | 'rad'
- numberBase: 'BIN' | 'OCT' | 'DEC' | 'HEX'
- history: HistoryEntry[]
- showHistory: boolean
- Date inputs: startDate, endDate, birthDate
```

### Key Functions
- `handleNumber()` - Input validation per mode
- `handleOperator()` - Expression building
- `handleEquals()` - Safe evaluation
- `handleScientific()` - Trig/math functions
- `handleBitwise()` - Bitwise operations
- `convertBase()` - Real-time base conversion
- `safeEvaluate()` - No raw eval() security

## Safety Features

1. **No eval()**: Custom safe evaluator using Function constructor with sanitization
2. **Input validation**: Base-aware character filtering in programmer mode
3. **Error handling**: Graceful error display with auto-reset
4. **History persistence**: localStorage with JSON serialization
5. **Theme persistence**: localStorage for user preference

## Customization Points

### Colors (Easy to modify)
```typescript
Dark theme:
- bg: #0b272a, #244747
- buttons: #4e706b, #7b9c92
- text: #dad7c5

Light theme:
- bg: #dad7c5, #f5f3eb
- buttons: #7b9c92, #244747
```

### Animation Timing
- Button transition: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Theme switch: 300ms ease
- Ripple duration: 400ms ease-out

### Layout
- Max width: 28rem (448px)
- Padding: 1.5rem (24px)
- Gap: 0.75rem (12px)
- Border radius: 2rem (32px) card, 0.75rem (12px) buttons

## Extending Functionality

### Add New Mode
1. Add to Mode type union
2. Create mode tab in header
3. Add conditional rendering in keypad section
4. Implement mode-specific handlers

### Add New Scientific Function
1. Add button to scientific mode grid
2. Extend handleScientific() switch statement
3. Implement Math operation

### Add New Bitwise Operation
1. Add button to programmer mode
2. Extend handleBitwise() switch statement
3. Ensure result converts to current base

## Performance Optimizations

- Single state updates per action
- Efficient re-render with conditional blocks
- LocalStorage only on change (useEffect)
- No unnecessary calculations in render
- CSS transitions hardware-accelerated

## Accessibility Features

- Keyboard navigation (Enter, Backspace, Escape support ready)
- Focus-visible outlines
- Minimum 48x48px touch targets
- High contrast in both themes
- Screen reader friendly (add aria-labels as needed)

## Testing Checklist

- [ ] All number inputs work in each mode
- [ ] All operators produce correct results
- [ ] Scientific functions accurate (deg/rad)
- [ ] Base conversion accurate
- [ ] Date calculations correct
- [ ] History saves and loads
- [ ] Theme persists across sessions
- [ ] All buttons have 3D animation
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive
- [ ] Error handling graceful
