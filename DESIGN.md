---
name: Premium Obsidian & Gold
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#d0cecd'
  on-tertiary: '#313030'
  tertiary-container: '#b5b2b2'
  on-tertiary-container: '#464545'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style

This design system is engineered for a high-end, professional photography platform. The brand personality is **exclusive, meticulous, and sophisticated**, evoking the atmosphere of a private gallery or a secure, luxury vault. It targets professional event photographers and discerning clients who value the sanctity and presentation of their visual memories.

The visual style is a fusion of **Corporate Modern** and **Glassmorphism**. It utilizes a deep, monochromatic base to allow professional photography to become the focal point, while "Metallic Gold" accents provide a sense of prestige and value. The UI should feel like a premium tool: quiet, precise, and effortlessly elegant. Use generous whitespace to create a sense of breathing room, and ensure all transitions are smooth and deliberate to reinforce the feeling of luxury.

## Colors

The palette is rooted in a "Dark Vault" aesthetic. The primary color, **Metallic Gold (#D4AF37)**, is reserved for high-impact brand moments, primary calls to action, and thin structural accents. 

- **Background (Canvas):** Deepest Black (#050505). This provides maximum contrast for photos.
- **Surface (Vault Tiers):** Dark Charcoals (#0A0A0A) and Rich Grays (#1A1A1A). These define the container hierarchy.
- **Accents:** Use Gold sparingly. Overuse diminishes its "premium" effect.
- **Typography:** Pure White (#FFFFFF) for high emphasis, and muted silver-grays for secondary information to maintain a balanced hierarchy.

## Typography

This design system uses a high-contrast typographic pairing. **Playfair Display** provides an authoritative, editorial feel for large headings and branding moments. **Inter** is used for all functional UI elements, navigation, and body copy to ensure maximum legibility against dark backgrounds.

Uppercase styling with increased letter spacing is recommended for labels and small navigational links to enhance the "luxury brand" aesthetic. Maintain tight tracking on large display type for a more modern, professional look.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to maintain an "art gallery" presentation, centering content within a 1440px max-width container. 

- **Desktop:** 12-column grid with 24px gutters. Use wide 64px outer margins to push content inward, emphasizing the premium nature of the space.
- **Mobile:** 4-column grid with 16px margins. 
- **Rhythm:** An 8px linear scale (8, 16, 24, 32, 48, 64, 80) governs all padding and margins. Use the larger ends of the scale (48px+) between major sections to prevent the UI from feeling cramped.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Subtle Glassmorphism**.

1.  **Base Layer:** Solid #050505.
2.  **Surface Tier:** #0A0A0A with a 1px border of #1A1A1A or a very faint gold tint (10% opacity).
3.  **Floating Elements:** Glassmorphism is applied to navigation bars and overlays. Use a background blur of 12px-20px combined with a semi-transparent #1A1A1A fill (60% opacity).
4.  **Shadows:** Shadows are rarely used on dark surfaces. Instead, use "inner glow" or 1px strokes to define edges. For modals, use a deep, diffused shadow: `0 20px 40px rgba(0,0,0,0.8)`.

## Shapes

The design system utilizes **Soft** roundedness. Precision is key; sharp corners feel too aggressive, while pill shapes feel too casual. 

- **Standard UI (Buttons, Inputs):** 4px (0.25rem) radius.
- **Containers (Cards, Modals):** 8px (0.5rem) radius.
- **Image Frames:** Always sharp or 4px radius to respect the professional integrity of the photographs.

## Components

### Buttons
- **Primary:** Solid Gold (#D4AF37) with Black text. No shadow.
- **Secondary:** Transparent background with a 1px Gold border. Gold text.
- **Ghost:** White text, no background, slight opacity shift on hover.

### Inputs & Fields
- Backgrounds should be #0A0A0A with a 1px border (#1A1A1A). On focus, the border transitions to Gold. 
- Text should be Inter 16px for comfortable mobile entry.

### Cards
- Use a "Vault Card" style: #0A0A0A background, 1px subtle border, and 0px radius on the image inside the card to keep it looking like a professional print.

### Chips & Tags
- Used for photo metadata (e.g., "Wedding", "4K"). Small, uppercase Inter, 1px silver-gray border, low-profile padding (4px 12px).

### List Items
- Separated by 1px dark gray lines (#1A1A1A). Hover states should use a subtle #121212 background tint.