---
name: Dossier OS
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad8e8'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#eeecfc'
  surface-container-high: '#e9e6f6'
  surface-container-highest: '#e3e1f1'
  on-surface: '#1a1b26'
  on-surface-variant: '#454558'
  inverse-surface: '#2f2f3b'
  inverse-on-surface: '#f1efff'
  outline: '#757589'
  outline-variant: '#c5c4db'
  surface-tint: '#353cff'
  primary: '#0200bb'
  on-primary: '#ffffff'
  primary-container: '#0500ff'
  on-primary-container: '#b3b7ff'
  inverse-primary: '#bfc2ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#730001'
  on-tertiary: '#ffffff'
  tertiary-container: '#9e0002'
  on-tertiary-container: '#ffa699'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bfc2ff'
  on-primary-fixed: '#00006e'
  on-primary-fixed-variant: '#0400ef'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#930002'
  background: '#fbf8ff'
  on-background: '#1a1b26'
  surface-variant: '#e3e1f1'
  background-canvas: '#ffffff'
  surface-muted: '#f2f2f2'
  border-primary: '#111111'
  border-muted: '#d8d8d4'
  text-muted: '#666666'
  signal-green: '#25e85c'
typography:
  display-xl:
    fontFamily: Departure Mono
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Departure Mono
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-base:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  status-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
  display-mobile:
    fontFamily: Departure Mono
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.2'
spacing:
  panel-margin: 24px
  gutter: 1px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  inner-padding: 16px
---

## Brand & Style

The design system is a high-fidelity "portfolio operating system" designed for an AI Product Manager. It prioritizes the aesthetic of a **Technical Dossier**—moving away from the warmth of typical SaaS landing pages toward a sharp, experimental, and hyper-intentional design language. The brand personality is precise, intellectual, and forward-looking, evoking the feeling of a custom design archive or a project inspector.

The visual style is a blend of **Brutalism** and **Minimalism**. It utilizes thin, 1px dividers, hard edges, and a fixed split-screen grid to create a structured, non-scrolling "dashboard" experience. The interface should feel like a specialized tool for browsing intellectual property and AI systems, rather than a generic personal website.

Key characteristics:
- **Intentionality:** Every pixel, coordinate, and label serves a structural purpose.
- **Experimentalism:** Uses terminal-style status bars and coordinate markers to reinforce the "AI builder" persona.
- **Dossier Feeling:** Fixed panels and horizontal divisions create a sense of organized, high-density information.

## Colors

The palette is strictly monochrome with high-vibrancy functional accents. The primary interaction color is **Electric Blue**, used exclusively for active states, highlights, and selection markers. **Signal Green** is reserved for status indicators (e.g., "Initializing Sequence" or "Live").

- **Backgrounds:** Use pure white (#ffffff) for the main canvas. Use light gray (#f2f2f2) for inactive project detail areas or panel grouping.
- **Typography:** The foreground is a deep off-black (#111111) for maximum legibility and contrast against the white canvas.
- **Borders:** Use solid black (#111111) for structural column dividers and muted gray (#d8d8d4) for secondary internal separators or inactive states.

## Typography

The typography system relies on monospaced and squared-display fonts to reinforce the technical/systemic aesthetic. 

- **Display Hierarchy:** Use **Departure Mono** for large statements and project numbers. These should feel architectural and blocky.
- **UI & Body:** Use **JetBrains Mono** for all descriptive text, project titles in the list, and status bar logs. It provides high legibility at small sizes while maintaining the developer-centric feel.
- **Metadata & Labels:** Use **IBM Plex Mono** in all-caps for small labels (e.g., "PROJECT ID", "CATEGORY", "X/Y COORDINATES").
- **Styling:** Avoid font smoothing where possible to maintain the "pixel-perfect" edge. Use underlines for interactive links rather than weight changes.

## Layout & Spacing

The design uses a **Fixed 4-Column Grid** that occupies 100% of the viewport height. This is not a scrolling page, but a dashboard interface.

- **Grid Model:**
  - **Column 1 (Nav Rail):** Fixed width (approx 80px - 120px). Contains the logo, vertical navigation, and terminal footer.
  - **Column 2 (Index):** Flexible width (approx 30%). Contains the editorial headline, project list, and project description.
  - **Column 3 (Preview):** Primary focus (approx 45%). Contains the large-scale abstract project previews.
  - **Column 4 (Inspector):** Fixed width (approx 20%). Contains the primary CTA and metadata inspector.

- **Dividers:** Columns are separated by 1px solid black lines. No gutters exist between panels; the border is the gutter.
- **Rhythm:** Use an 8px base grid for internal padding within panels to ensure all elements align to a predictable technical structure.

## Elevation & Depth

This system is strictly flat. It rejects shadows and depth metaphors in favor of **Tonal Layers** and **Coordinate Alignment**.

- **Surface Levels:** All panels exist on the same Z-index. Depth is only suggested by color changes (e.g., an active project row using a `#f2f2f2` background).
- **Overlays:** Small annotation labels (e.g., X/Y coordinates) may sit on top of project previews but should have a solid background and thin 1px border.
- **No Shadows:** Do not use drop shadows or blurs. Visual separation is achieved exclusively through 1px black borders and background color shifts.

## Shapes

The shape language is **Sharp**. Most UI elements should have a 0px border radius to maintain the dossier/architectural feel.

- **Hard Edges:** All buttons, panels, and project rows must have 90-degree corners.
- **Exceptions:** A minimal 2px radius may be used for status dots or very small interface chips if needed for legibility, but 0px is the default preference.
- **Lines:** Use 1px stroke weight for all UI borders, dividers, and selection boxes.

## Components

### Buttons
- **Primary (SAY HEY):** Solid black background with white monospaced text. 0px radius. Hover state: Electric Blue background or inverted (white background with black text/border).
- **Ghost/Link:** Underlined monospaced text with no background.

### Project List Rows
- **Idle:** White background, 1px bottom border. Large project number (01, 02) followed by title.
- **Active:** Electric Blue marker (vertical line) or a light gray background (#f2f2f2). Text may shift to Electric Blue.
- **Hover:** Subtle background tint and the appearance of a project ID/metadata snippet.

### Inspector Panels
- Small boxed labels using `label-mono` typography.
- Thin 1px boxes surrounding metadata values (e.g., `[ LIVE ]` or `[ PROTOTYPE ]`).

### Status Bars
- Located at the bottom of Column 1 and Column 2.
- Uses `status-code` typography with `//` or `C:\` prefixes to simulate a command-line interface.

### Project Previews
- Use grid-based collages of abstract UI elements, wireframes, and typographic blocks.
- Incorporate "crosshair" markers and coordinate labels to emphasize the "inspector" metaphor.