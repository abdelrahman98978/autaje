---
name: AwjaTech Design System
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'ة
  on-surface-variant: '#42474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#73777e'
  outline-variant: '#c3c7ce'
  surface-tint: '#406182'
  primary: '#001629'
  on-primary: '#ffffff'
  primary-container: '#002b49'
  on-primary-container: '#7293b6'
  inverse-primary: '#a8caef'
  secondary: '#00677f'
  on-secondary: '#ffffff'
  secondary-container: '#5ad8ff'
  on-secondary-container: '#005c72'
  tertiary: '#001813'
  on-tertiary: '#ffffff'
  tertiary-container: '#002f27'
  on-tertiary-container: '#00a28a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#a8caef'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#274969'
  secondary-fixed: '#b6ebff'
  secondary-fixed-dim: '#57d5fc'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#71f9db'
  tertiary-fixed-dim: '#50dcbf'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#005143'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style

This design system is built to project **Engineering Excellence, Reliability, and Innovation**. The visual language bridges the gap between high-stakes infrastructure and futuristic smart technology. It targets B2B stakeholders, project managers, and enterprise clients who value precision and technical proficiency.

The design style is **Corporate / Modern** with a **Technical** edge. It utilizes a structured grid, high-clarity typography, and a "precision-engineered" aesthetic. Visual interest is generated through subtle technical gradients and a palette that evokes the cleanliness of high-tech hardware and networking environments. The UI should feel stable, secure, and advanced.

## Colors

The color palette is derived directly from the core engineering identity. 
- **Deep Corporate Blue (#002B49):** The foundation. Used for headers, primary text, and high-importance structural elements to convey trust and authority.
- **Technical Cyan (#00A9CE) & Green (#00B398):** Taken from the logo gradient. These are used for accents, active states, and to represent "flow" or "connectivity" in technical diagrams.
- **Backgrounds:** Use a crisp white (#FFFFFF) for main content areas and a very light cool gray/blue (#F4F7F9) for section backgrounds to create a layered, organized feel without heavy shadows.

## Typography

**IBM Plex Sans** is the primary typeface for its unique balance of industrial precision and humanist approach. It mirrors the engineering nature of the business—calculated yet accessible. For Arabic implementation, use **IBM Plex Sans Arabic** to maintain a consistent visual weight and technical character across languages.

- **Headlines:** Should be bold and authoritative. Use tighter letter-spacing for large display text to create a "locked-in" technical feel.
- **Body Text:** Prioritize legibility. Use adequate line heights to ensure technical specifications are easy to parse.
- **Labels:** Use Medium or Semi-Bold weights for technical labels and status indicators to distinguish them from general body copy.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop, centered within the viewport. The spacing logic is strictly based on an **8px base unit**, ensuring mathematical harmony across all components.

- **Desktop (1200px+):** 12 columns, 24px gutters, 48px side margins.
- **Tablet (768px - 1199px):** 8 columns, 20px gutters, 32px side margins.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px side margins.

Content should follow a "Z-pattern" layout for service descriptions, alternating between text and technical imagery. Vertical spacing between major sections should be generous (80px+) to allow the "technical" elements room to breathe.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. This maintains a "clean-room" or "blue-print" aesthetic.

1.  **Level 0 (Floor):** Neutral background (#F4F7F9).
2.  **Level 1 (Cards/Containers):** Pure White (#FFFFFF) with a very thin 1px border in a light cool gray (#E2E8F0). No shadow.
3.  **Level 2 (Interactive/Floating):** Pure White with a subtle, highly diffused shadow (0px 4px 20px rgba(0, 43, 73, 0.05)) to indicate interactivity or focus.

Avoid heavy blurs. Use "Ghost" buttons (transparent with 1px borders) for secondary actions to keep the focus on the primary blue/cyan CTAs.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the industrial feel without becoming overly casual or "bubbly."

- **Standard Elements:** 4px (0.25rem) corner radius for buttons, input fields, and small cards.
- **Large Containers:** 8px (0.5rem) corner radius for large project cards and modals.
- **Status Tags:** Use slightly more rounded corners (12px) or pill shapes to distinguish them from structural elements.

The geometry should feel deliberate and architectural.

## Components

### Buttons
- **Primary:** Solid #002B49 (Corporate Blue) with White text. Sharp, high-contrast, for primary CTAs like "Request a Quote."
- **Secondary:** Gradient background from #00A9CE (Cyan) to #00B398 (Green) with White text. Used for "View Project" or "Our Services."
- **Ghost:** 1px border in #002B49, transparent background. For low-priority actions.

### Cards
- **Service Cards:** White background, 1px light gray border. Top-aligned technical icon in Cyan. Heading in Deep Blue.
- **Project Cards:** Full-width image top, followed by a metadata row (Sector, Date) using `label-sm` typography and a short description.

### Input Fields
- Structured with a 1px border. On focus, the border changes to Technical Cyan (#00A9CE) with a 2px outer glow of the same color at 10% opacity.

### Status Indicators
- Use small, filled circles next to text for "System Status" or "Live Support" indicators, utilizing the success (Green) and error (Red) palette.

### Technical Icons
- Use 2px stroke-width icons. Icons should be monolinear and geometric, avoiding filled shapes where possible to maintain the "blue-print" feel.