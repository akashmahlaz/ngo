# Quick Reference: Unified Design System

> **Control Center**: `app/globals.css` - All colors, animations, and components in ONE place

---

## 🎨 Colors

```tsx
// Semantic tokens (preferred)
className="bg-primary text-primary-foreground"
className="bg-card text-card-foreground border-border"

// Brand colors (for specific needs)
className="bg-teal-600"  // Tailwind direct color
className="text-emerald-500"
```

---

## 🃏 Cards

```tsx
// Universal impact card
<div className="impact-card group">
  <div className="gradient-overlay absolute inset-0" />
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>

// Compact variant
<div className="impact-card-compact">
```

---

## 🔘 Buttons

```tsx
<button className="btn-primary">Primary Action</button>
<button className="btn-primary-lg">Large Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-ghost">Ghost</button>
<button className="btn-icon"><Icon /></button>
```

---

## 🏷️ Badges

```tsx
<span className="category-badge-teal">Technology</span>
<span className="category-badge-emerald">Environment</span>
<span className="category-badge-amber">Community</span>
<span className="category-badge-lime">Education</span>

<div className="compensation-box">
  <DollarSign /> $50K - $70K
</div>
```

---

## ✨ Animations & Hovers

```tsx
// Card effects
className="card-hover"           // Shadow-xl on hover
className="card-hover-lift"      // Shadow + lift up

// Gradients (use with "group")
<div className="group">
  <div className="gradient-overlay absolute inset-0" />
</div>

// Rings
className="ring-hover"           // Ring expands on hover
className="avatar-ring"          // Avatar ring (with group-hover)

// Fades (use with "group")
className="fade-in-hover"        // Hidden → visible on group-hover
className="fade-out-hover"       // Visible → hidden on group-hover

// Scale
className="scale-hover"          // Scale 105% on hover
className="scale-hover-sm"       // Scale 102% on hover

// Backgrounds
className="bg-hover-teal"        // Teal background on hover
className="bg-hover-emerald"     // Emerald background on hover

// Slides (use with "group")
className="slide-in-right"       // Slide from right
className="slide-in-left"        // Slide from left

// Border
className="border-glow"          // Glowing border on hover
```

---

## 🎬 Keyframe Animations

```tsx
className="animate-shimmer"      // Loading shimmer
className="animate-float"        // Gentle floating
className="animate-pulse-glow"   // Pulsing glow
className="animate-slide-up"     // Slide up fade-in
className="animate-slide-down"   // Slide down fade-in
```

---

## 📐 Layout

```tsx
<section className="section-container">
  {/* Max-w-7xl with padding */}
</section>

<section className="section-container-compact">
  {/* Reduced padding */}
</section>
```

---

## 🎨 Text

```tsx
className="gradient-text"        // Teal → Emerald → Lime
className="gradient-text-reverse" // Lime → Emerald → Teal
className="text-glow"            // Text glow on hover
```

---

## 🌟 The Job Card Pattern

```tsx
function ExampleCard() {
  return (
    <div className="impact-card group">
      {/* 1. Gradient overlay */}
      <div className="gradient-overlay absolute inset-0" />
      
      {/* 2. Content layer */}
      <div className="relative z-10">
        {/* 3. Avatar with ring */}
        <img className="avatar-ring rounded-full w-16 h-16" />
        
        {/* 4. Title */}
        <h3 className="text-xl font-bold mt-4">Card Title</h3>
        
        {/* 5. Reveal on hover */}
        <p className="fade-in-hover mt-2">Hidden details</p>
        
        {/* 6. Category badge */}
        <span className="category-badge-teal mt-4">
          Technology
        </span>
        
        {/* 7. Compensation (if applicable) */}
        <div className="compensation-box mt-4">
          <DollarSign /> $50K - $70K
        </div>
      </div>
    </div>
  );
}
```

---

## 🚦 Rules

✅ **DO**:
- Use CSS variables (`bg-primary`, `text-foreground`)
- Use utility classes (`.card-hover`, `.fade-in-hover`)
- Use component classes (`.btn-primary`, `.impact-card`)
- Apply `group` class for hover effects on children

❌ **DON'T**:
- Hardcode colors (`bg-teal-600` - use `bg-primary`)
- Duplicate styles (create utility class instead)
- Create component-specific CSS files (add to `globals.css`)
- Forget `group` when using `group-hover` utilities

---

## 🔧 Quick Fixes

### Card not showing gradient on hover?
```tsx
// ❌ Missing "group"
<div className="impact-card">
  <div className="gradient-overlay" />
</div>

// ✅ Add "group"
<div className="impact-card group">
  <div className="gradient-overlay absolute inset-0" />
</div>
```

### Element hidden behind overlay?
```tsx
// ✅ Add z-index
<div className="relative z-10">
  {/* Content */}
</div>
```

### Button looks wrong?
```tsx
// ❌ Custom styles
<button className="px-6 py-3 bg-teal-600">

// ✅ Use component class
<button className="btn-primary">
```

---

## 📝 Cheat Sheet

| Need | Use |
|------|-----|
| Primary button | `.btn-primary` |
| Card with hover | `.impact-card group` + `.gradient-overlay` |
| Badge | `.category-badge-teal` |
| Avatar | `.avatar-ring` |
| Gradient text | `.gradient-text` |
| Loading | `.animate-shimmer` |
| Hover reveal | `.fade-in-hover` (with `group`) |
| Card lift | `.card-hover-lift` |

---

**Full Documentation**: See `DESIGN_SYSTEM.md`  
**Source of Truth**: `app/globals.css`
