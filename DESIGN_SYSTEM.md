# Unified Design System

**Control Point**: `app/globals.css`  
**Philosophy**: Single source of truth for all design tokens, colors, animations, and component styles.

---

## 🎨 Color Philosophy

### Brand Colors (Teal-Emerald-Lime Theme)

Our color palette reflects the **social impact sector** values:

| Color | Hex | Meaning | Usage |
|-------|-----|---------|-------|
| **Teal** | `#0D9488` | Trust, growth, sustainability | Primary brand color, CTAs, links |
| **Emerald** | `#10B981` | Nature, community, impact | Secondary support, success states |
| **Lime** | `#84CC16` | Energy, hope, action | Accent highlights, trends |
| **Amber** | `#F59E0B` | Urgency, warmth, opportunity | Category badges, alerts |

### Why We Changed from Purple-Pink-Orange

The original purple-pink-orange palette was too consumer/tech-focused. Our **target audience** (NGOs, volunteers, social impact seekers) responds better to:
- **Nature-inspired colors** (teal/emerald) → Trust and authenticity
- **Environmental associations** → Sustainability and long-term impact
- **Calming tones** → Approachable and inclusive platform

---

## 📁 Architecture

### 1. CSS Variables (`:root` & `.dark`)
**Location**: Lines 48-110 in `globals.css`

All colors defined in **OKLCH format** for better color science:
```css
:root {
  --primary: oklch(0.55 0.15 185); /* Teal */
  --brand-teal: 173 58% 39%;
  --brand-emerald: 160 84% 39%;
  --brand-lime: 84 81% 44%;
}
```

**Usage in Components**:
```tsx
// ✅ Good - Uses CSS variables
<div className="text-primary bg-card border-border">

// ❌ Bad - Hardcoded colors
<div className="text-teal-600 bg-white border-gray-200">
```

---

### 2. @layer utilities
**Location**: Lines 166-279 in `globals.css`

Reusable animation and interaction classes based on `job-card.tsx` patterns.

#### Card Hover Effects
```css
.card-hover           /* Shadow-xl on hover */
.card-hover-lift      /* Shadow + lift (-translate-y-1) */
```

**Usage**:
```tsx
<div className="card-hover rounded-xl p-6">
  <!-- Content -->
</div>
```

#### Gradient Overlays
```css
.gradient-overlay          /* Primary teal gradient on hover */
.gradient-overlay-emerald  /* Emerald gradient */
.gradient-overlay-lime     /* Lime gradient */
```

**Usage** (with `group` pattern):
```tsx
<div className="group relative">
  <div className="gradient-overlay absolute inset-0" />
  <p>Hover me!</p>
</div>
```

#### Ring Animations
```css
.ring-hover          /* Ring-2 expands on hover */
.avatar-ring         /* Ring for avatars that glows on group-hover */
```

**Usage**:
```tsx
<img className="avatar-ring rounded-full" />
```

#### Fade Effects
```css
.fade-in-hover       /* opacity-0 -> opacity-100 on group-hover */
.fade-out-hover      /* opacity-100 -> opacity-0 on group-hover */
```

#### Scale & Border Effects
```css
.scale-hover         /* scale-105 on hover */
.scale-hover-sm      /* scale-[1.02] on hover */
.border-glow         /* Border + shadow glow on hover */
```

#### Background Transitions
```css
.bg-hover-teal       /* Teal-50 background on hover */
.bg-hover-emerald    /* Emerald-50 background on hover */
```

#### Slide Animations
```css
.slide-in-right      /* Slide from right on group-hover */
.slide-in-left       /* Slide from left on group-hover */
```

---

### 3. @layer components
**Location**: Lines 285-386 in `globals.css`

Pre-built card, button, and badge components for consistency.

#### Impact Cards
```css
.impact-card          /* Universal card: bg, border, hover, overflow */
.impact-card-compact  /* Smaller padding variant */
```

**Usage**:
```tsx
<div className="impact-card group">
  <div className="gradient-overlay absolute inset-0" />
  <h3 className="text-xl font-bold">Card Title</h3>
  <p className="fade-in-hover">Hover to reveal</p>
</div>
```

#### Category Badges
```css
.category-badge-teal      /* Teal badge for Technology */
.category-badge-emerald   /* Emerald badge for Environment */
.category-badge-amber     /* Amber badge for Community */
.category-badge-lime      /* Lime badge for Education */
```

**Usage**:
```tsx
<span className="category-badge-teal">
  <Tag className="w-3 h-3" />
  Technology
</span>
```

#### Buttons
```css
.btn-primary       /* Teal gradient button */
.btn-primary-lg    /* Large variant */
.btn-secondary     /* Outline button */
.btn-ghost         /* Ghost/text button */
.btn-icon          /* Icon-only button */
```

**Usage**:
```tsx
<button className="btn-primary">
  Apply Now
</button>

<button className="btn-secondary">
  Learn More
</button>
```

#### Compensation Box
```css
.compensation-box  /* Emerald gradient box for salary/benefits */
```

**Usage** (from `job-card.tsx`):
```tsx
<div className="compensation-box">
  <DollarSign className="w-4 h-4" />
  $50,000 - $70,000
</div>
```

#### Utility Components
```css
.trust-badge        /* For hero trust indicators */
.stats-card         /* For metric displays */
.feature-card       /* For feature highlights */
.testimonial-card   /* For testimonials */
.gradient-text      /* Teal→Emerald→Lime text gradient */
```

---

## 🎬 Animation Patterns

All animations defined in `tailwind.config.js` and applied via utility classes.

### Available Animations
```javascript
shimmer      // Loading shimmer effect
float        // Gentle up/down floating
pulse-glow   // Pulsing glow shadow
slide-up     // Slide up fade-in
slide-down   // Slide down fade-in
```

**Usage**:
```tsx
<div className="animate-shimmer">Loading...</div>
<div className="animate-float">🌍</div>
```

---

## 📋 The Job Card Pattern

`components/job-card.tsx` is the **gold standard** for card interactions. Key patterns:

### 1. Group Hover Pattern
```tsx
<div className="group">
  <div className="opacity-0 group-hover:opacity-100">
    <!-- Hidden until parent hover -->
  </div>
</div>
```

### 2. Gradient Overlay
```tsx
<div className="gradient-overlay absolute inset-0" />
```

### 3. Avatar Ring Animation
```tsx
<img className="avatar-ring" />
```

### 4. Shadow Transitions
```tsx
<div className="card-hover">
  <!-- Gets shadow-xl on hover -->
</div>
```

### 5. Compensation Highlighting
```tsx
<div className="compensation-box">
  <DollarSign /> $50K - $70K
</div>
```

---

## 🛠️ How to Use This System

### Creating a New Card Component

```tsx
export function MyCard() {
  return (
    <div className="impact-card group">
      {/* Gradient overlay appears on hover */}
      <div className="gradient-overlay absolute inset-0" />
      
      {/* Content */}
      <div className="relative z-10">
        <img className="avatar-ring rounded-full w-16 h-16" />
        <h3 className="text-xl font-bold mt-4">Card Title</h3>
        
        {/* Hidden until hover */}
        <p className="fade-in-hover mt-2 text-muted-foreground">
          Additional details
        </p>
        
        {/* Category badge */}
        <span className="category-badge-teal mt-4">
          Technology
        </span>
      </div>
    </div>
  );
}
```

### Creating a CTA Button

```tsx
<button className="btn-primary">
  <Sparkles className="w-4 h-4" />
  Get Started
</button>
```

### Using Color Variables

```tsx
// ✅ Correct - Uses semantic tokens
<div className="bg-primary text-primary-foreground">
<div className="border-border bg-card">

// ❌ Avoid - Hardcoded colors
<div className="bg-teal-600 text-white">
```

---

## 🔄 Maintenance Guide

### To Change Brand Colors
1. Update CSS variables in `:root` (line 48)
2. Update `.dark` variant (line 66)
3. Update `--brand-*` HSL values (line 41-44)
4. Colors cascade automatically to all components

### To Add New Animation
1. Add keyframe to `tailwind.config.js`:
```javascript
keyframes: {
  "my-animation": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  }
}
```
2. Add animation timing:
```javascript
animation: {
  "my-animation": "my-animation 2s linear infinite"
}
```
3. Use in components:
```tsx
<div className="animate-my-animation">
```

### To Create New Card Type
Add to `@layer components` in `globals.css`:
```css
.my-custom-card {
  @apply bg-card border border-border rounded-xl p-6 
         transition-all duration-300 hover:shadow-xl 
         relative overflow-hidden;
}
```

---

## 🎯 Design Principles

1. **Audience-First**: Design for volunteers and NGOs, not tech enthusiasts
2. **Nature-Inspired**: Use teal/emerald colors to convey sustainability
3. **Consistent Patterns**: Job card hover effects everywhere
4. **Accessible**: OKLCH colors ensure perceptual uniformity
5. **Single Source**: All design decisions in `globals.css`

---

## 🚫 Anti-Patterns to Avoid

```tsx
// ❌ Don't use inline Tailwind colors
<div className="bg-teal-600">

// ✅ Use CSS variables
<div className="bg-primary">

// ❌ Don't duplicate animation styles
<div className="transition-all duration-300 hover:shadow-xl">

// ✅ Use utility class
<div className="card-hover">

// ❌ Don't create component-specific styles
// in individual component files

// ✅ Add to @layer components in globals.css
```

---

## 📊 Current Status

✅ **Completed**:
- Teal-Emerald-Lime color system in CSS variables
- 30+ utility classes for animations
- 20+ component classes for cards/buttons/badges
- Full dark mode support
- Build passing (85 pages generated)

⏳ **Next Steps**:
1. Refactor existing components to use utility classes
2. Apply job-card patterns to volunteer-card, ngo-card
3. Update remaining pages (jobs, ngos, volunteers)
4. Create Storybook documentation

---

## 🎓 Learning Resources

- [OKLCH Color Space](https://oklch.com/) - Why we use OKLCH
- [Tailwind @layer](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer) - Layer documentation
- [Design Tokens](https://css-tricks.com/what-are-design-tokens/) - Token philosophy

---

**Questions?** All design decisions are documented in `app/globals.css` header comment (lines 6-47).

**Last Updated**: Created during teal color system migration  
**Maintainer**: Design System Team
