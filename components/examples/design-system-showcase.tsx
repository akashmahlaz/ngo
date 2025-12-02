/**
 * Design System Showcase Component
 * 
 * This file demonstrates how to use the unified design system
 * from globals.css. Copy these patterns to your components.
 */

import { Button } from "@/components/ui/button"
import { Heart, Star, TrendingUp, DollarSign } from "lucide-react"

export function DesignSystemShowcase() {
  return (
    <div className="section-container">
      <h1 className="gradient-text text-4xl font-bold mb-8">
        Design System Showcase
      </h1>

      {/* Card Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Card Components</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Impact Card Example */}
          <div className="impact-card group">
            <div className="gradient-overlay absolute inset-0" />
            
            <div className="relative z-10">
              <div className="avatar-ring w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Impact Card</h3>
              <p className="text-muted-foreground mb-4">
                Hover to see the gradient overlay effect
              </p>
              
              <p className="fade-in-hover text-sm text-muted-foreground">
                This text fades in on hover!
              </p>
            </div>
          </div>

          {/* Compact Card Example */}
          <div className="impact-card-compact">
            <h3 className="text-lg font-bold mb-2">Compact Card</h3>
            <p className="text-sm text-muted-foreground">
              Smaller padding for denser layouts
            </p>
          </div>

          {/* Card with Lift */}
          <div className="impact-card card-hover-lift">
            <h3 className="text-lg font-bold mb-2">Card with Lift</h3>
            <p className="text-sm text-muted-foreground">
              Lifts up on hover with shadow
            </p>
          </div>
        </div>
      </section>

      {/* Button Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Button Components</h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">
            <Heart className="w-4 h-4" />
            Primary Button
          </button>
          
          <button className="btn-primary-lg">
            Large Primary
          </button>
          
          <button className="btn-secondary">
            Secondary Button
          </button>
          
          <button className="btn-ghost">
            Ghost Button
          </button>
          
          <button className="btn-icon">
            <Star className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Badge Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Badge Components</h2>
        
        <div className="flex flex-wrap gap-4">
          <span className="category-badge-teal">
            <TrendingUp className="w-3 h-3" />
            Technology
          </span>
          
          <span className="category-badge-emerald">
            Environment
          </span>
          
          <span className="category-badge-amber">
            Community
          </span>
          
          <span className="category-badge-lime">
            Education
          </span>
          
          <div className="compensation-box">
            <DollarSign className="w-4 h-4" />
            $50,000 - $70,000
          </div>
        </div>
      </section>

      {/* Animation Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Animation Utilities</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 border rounded-xl bg-card">
            <div className="w-16 h-16 bg-teal-100 rounded-lg mb-4 scale-hover" />
            <p className="text-sm font-medium">scale-hover</p>
          </div>
          
          <div className="p-6 border rounded-xl bg-card">
            <div className="w-16 h-16 bg-emerald-100 rounded-lg mb-4 ring-hover" />
            <p className="text-sm font-medium">ring-hover</p>
          </div>
          
          <div className="p-6 border rounded-xl bg-card">
            <div className="w-16 h-16 bg-lime-100 rounded-lg mb-4 border-glow" />
            <p className="text-sm font-medium">border-glow</p>
          </div>
          
          <div className="p-6 border rounded-xl bg-card">
            <div className="w-16 h-16 bg-amber-100 rounded-lg mb-4 animate-pulse-glow" />
            <p className="text-sm font-medium">pulse-glow</p>
          </div>
        </div>
      </section>

      {/* Group Hover Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Group Hover Patterns</h2>
        
        <div className="impact-card group max-w-md">
          <div className="gradient-overlay absolute inset-0" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Hover This Card</h3>
            <p className="text-muted-foreground mb-4">
              Multiple elements respond to the hover
            </p>
            
            <div className="space-y-2">
              <div className="fade-in-hover p-3 bg-accent rounded-lg">
                <p className="text-sm">✨ Fades in on hover</p>
              </div>
              
              <div className="slide-in-right p-3 bg-accent rounded-lg">
                <p className="text-sm">➡️ Slides in from right</p>
              </div>
              
              <div className="slide-in-left p-3 bg-accent rounded-lg">
                <p className="text-sm">⬅️ Slides in from left</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Text Utilities</h2>
        
        <div className="space-y-4">
          <p className="gradient-text text-3xl font-bold">
            Teal → Emerald → Lime Gradient
          </p>
          
          <p className="gradient-text-reverse text-3xl font-bold">
            Lime → Emerald → Teal Gradient
          </p>
          
          <p className="text-glow text-2xl font-bold">
            Hover for text glow effect
          </p>
        </div>
      </section>

      {/* Stats Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Stats Components</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="stats-card">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Active Volunteers</div>
          </div>
          
          <div className="stats-card">
            <div className="text-4xl font-bold gradient-text mb-2">1.2K+</div>
            <div className="text-sm text-muted-foreground">Verified NGOs</div>
          </div>
          
          <div className="stats-card">
            <div className="text-4xl font-bold text-primary mb-2">2M+</div>
            <div className="text-sm text-muted-foreground">Impact Hours</div>
          </div>
        </div>
      </section>

      {/* Trust Badge Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Special Components</h2>
        
        <div className="flex flex-wrap gap-6">
          <div className="trust-badge">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Trusted by 1,200+ NGOs</span>
          </div>
          
          <div className="feature-card max-w-sm">
            <h3 className="text-lg font-bold mb-2">Feature Card</h3>
            <p className="text-sm text-muted-foreground">
              For highlighting key features with hover effects
            </p>
          </div>
          
          <div className="testimonial-card max-w-sm">
            <p className="text-sm italic mb-4">
              "This platform changed my life!"
            </p>
            <p className="text-xs font-medium">- Happy Volunteer</p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section>
        <h2 className="text-2xl font-bold mb-6">How to Use</h2>
        
        <div className="bg-neutral-900 text-neutral-100 p-6 rounded-xl">
          <pre className="text-sm overflow-x-auto">
{`// Simple card with hover effects
<div className="impact-card group">
  <div className="gradient-overlay absolute inset-0" />
  
  <div className="relative z-10">
    <h3 className="gradient-text">Title</h3>
    <p className="fade-in-hover">Hidden until hover</p>
  </div>
</div>

// Button
<button className="btn-primary">
  Click Me
</button>

// Badge
<span className="category-badge-teal">
  Technology
</span>`}
          </pre>
        </div>
      </section>
    </div>
  )
}
