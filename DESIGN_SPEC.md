# Calculator Design System

## Color Tokens

### Dark Theme (Lotus Pond)
- `primary-deep`: #0b272a
- `primary-dark`: #244747
- `primary-medium`: #4e706b
- `primary-soft`: #7b9c92
- `accent-cream`: #dad7c5

### Light Theme (Soft Lotus)
- `bg-cream`: #dad7c5
- `bg-light`: #f5f3eb
- `accent-dark`: #244747
- `accent-medium`: #4e706b
- `accent-soft`: #7b9c92

## Typography

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500

### Line Heights
- Display: 1.2 (120%)
- Body: 1.5 (150%)

### Sizes
- Display: 2rem (32px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Tiny: 0.75rem (12px)

## Spacing System (8px base)

- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## Button States (3D System)

### REST
```css
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.1),
  0 2px 4px rgba(0, 0, 0, 0.06),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1),
  inset 0 2px 4px rgba(255, 255, 255, 0.1);
```

### HOVER
```css
transform: translateY(-2px);
box-shadow:
  0 6px 12px rgba(0, 0, 0, 0.15),
  0 3px 6px rgba(0, 0, 0, 0.1),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1),
  inset 0 2px 4px rgba(255, 255, 255, 0.15);
```

### ACTIVE
```css
transform: translateY(0) scale(0.97);
box-shadow:
  inset 0 2px 6px rgba(0, 0, 0, 0.2),
  inset 0 -1px 2px rgba(255, 255, 255, 0.05),
  0 1px 2px rgba(0, 0, 0, 0.05);
animation: ripple 0.4s ease-out;
```

## Border Radius

- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## Shadows

### Card Shadow (Dark)
```css
shadow: 0 8px 32px rgba(11, 39, 42, 0.5)
```

### Card Shadow (Light)
```css
shadow: 0 8px 32px rgba(123, 156, 146, 0.2)
```

## Transitions

- Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Standard: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Theme Switch: 300ms ease

## Animation Keyframes

### Ripple Effect
```css
@keyframes ripple {
  0% { box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0.3) }
  50% { box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0) }
  100% { box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0) }
}
```

## Accessibility

- Minimum touch target: 48x48px
- Focus visible outline: 2px solid rgba(123, 156, 146, 0.5)
- Outline offset: 2px
- Keyboard navigation support
- ARIA labels where needed

## Component Architecture

### Calculator Modes
1. Standard - Basic arithmetic
2. Scientific - Trigonometry, logarithms, powers
3. Programmer - Base conversion, bitwise operations
4. Date - Date difference, age calculator

### Features
- Theme persistence (localStorage)
- History tracking (last 10 operations)
- Real-time base conversion
- Degree/Radian toggle
- Error handling with visual feedback
