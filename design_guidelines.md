# Exploring India Website - Design Guidelines

## Design Approach: Minimalist India Travel Experience
**Reference Inspiration**: Airbnb (clean travel aesthetic) + Apple (minimalist approach) adapted for India tourism with the user's specified design system.

## Core Design Principles
1. **Minimalist Elegance**: Clean, spacious layouts with purposeful use of white space
2. **Cultural Authenticity**: Respectful representation of India's diverse destinations
3. **Clarity First**: Intuitive navigation prioritizing information accessibility for foreign visitors

---

## Color System

### Base Palette (User-Specified)
- **Background**: #FFFDF2 (warm cream) - `250 67% 97%`
- **Foreground/Text**: #000000 (pure black) - `0 0% 0%`

### Extended Palette
- **Primary Actions**: `25 95% 45%` (saffron-inspired orange for CTAs)
- **Accent**: `140 50% 40%` (muted green, subtle cultural nod)
- **Borders/Dividers**: `250 20% 85%` (soft beige)
- **Hover States**: `0 0% 15%` (near-black)
- **Input Backgrounds**: `250 40% 99%` (lighter cream)

---

## Typography (User-Specified Fonts)

**Font Implementation via Google Fonts CDN**:
- Inconsolata (400, 600, 700)
- Poppins (400, 500, 600)
- Antic (400)

### Type Scale
- **Hero Headings**: Inconsolata, 3.5rem/4rem (mobile: 2.5rem), font-weight 700
- **Section Headings**: Inconsolata, 2.5rem/3rem (mobile: 2rem), font-weight 600
- **Subheadings**: Poppins, 1.25rem/1.75rem, font-weight 500
- **Body Text**: Antic, 1rem/1.6rem, font-weight 400
- **Captions/Labels**: Poppins, 0.875rem/1.25rem, font-weight 400

---

## Layout System

### Spacing Primitives (Tailwind)
Use consistent spacing units: **2, 4, 6, 8, 12, 16, 20, 24, 32**
- Small gaps: `gap-4` to `gap-6`
- Section padding: `py-16` to `py-24` (desktop), `py-12` (mobile)
- Card padding: `p-6` to `p-8`
- Element margins: `mb-6`, `mt-8`, `mx-auto`

### Container Strategy
- **Max-widths**: `max-w-7xl` for full sections, `max-w-4xl` for content, `max-w-prose` for text-heavy areas
- **Responsive breakpoints**: Mobile-first, stack at `md:`, multi-column at `lg:`

---

## Component Library

### Navigation (Pre-Login)
- Fixed top navigation with transparent-to-solid transition on scroll
- Logo (left): Inconsolata, "Exploring India"
- Menu (right): Login, Register buttons with `border border-black` styling
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
- **Layout**: Side-by-side (60/40 split on desktop, stack on mobile)
- **Left**: Title (Inconsolata), description (Antic, max 2-3 lines), CTA button
- **Right**: Large hero image (Indian landmark - Taj Mahal, Gateway of India, or Jaipur architecture)
- **Background**: Subtle texture overlay on cream background
- **Height**: `min-h-[600px]` desktop, natural on mobile

### Place Cards (Popular Places Section)
- **Layout**: 3-column grid desktop (`lg:grid-cols-3`), 2-col tablet, 1-col mobile
- **Card Design**: Rounded corners (`rounded-lg`), subtle shadow (`shadow-md`), border (`border border-gray-200`)
- **Structure**: Image top (aspect-ratio 16:9), title (Poppins 600), brief description (Antic), "Importance" badge
- **Hover**: Subtle lift (`hover:shadow-lg transition-shadow duration-300`)

### Review Cards
- **Layout**: 2-column grid (`lg:grid-cols-2`), stack on mobile
- **Structure**: Quotation marks, review text (Antic italic), reviewer name + country (Poppins)
- **Style**: Light background (`bg-cream-50`), left border accent (`border-l-4 border-saffron`)

### Forms (Contact, Login, Register)
- **Input Fields**: `border border-black`, `bg-cream-lighter`, `rounded-md`, `px-4 py-3`
- **Labels**: Poppins 500, positioned above inputs with `mb-2`
- **Buttons**: Primary (`bg-black text-cream`), Secondary (`border border-black text-black`)
- **Validation**: Red accent for errors (`text-red-600`), green for success

### Dashboard (Post-Login)
- **Greeting**: Large welcome message (Inconsolata 2xl) with username
- **Dashboard Grid**: 2x2 card layout for sections (Explore, Explored, Reviews, Upcoming)
- **Cards**: Icon top, title (Poppins), count/status (Antic), action link
- **Style**: Consistent with place cards, interactive hover states

---

## Images

### Required Images with Descriptions

1. **Hero Image (Landing)**: 
   - High-quality photo of iconic Indian landmark (Taj Mahal at sunrise, vibrant Jaipur architecture, or Kerala backwaters)
   - Aspect ratio: 4:3 or 3:2
   - Placement: Right side of hero section (desktop), below text (mobile)

2. **Popular Places (6-8 images)**:
   - Taj Mahal, Jaipur (Pink City), Kerala backwaters, Goa beaches, Varanasi ghats, Himalayas, Mumbai Gateway of India, Rajasthan forts
   - Aspect ratio: 16:9
   - Treatment: Slight overlay on hover for readability

3. **About Us Section**:
   - Supporting image of diverse travelers or cultural montage
   - Placement: Background or side element

4. **Review Section**:
   - Small circular avatars for reviewers (placeholder or actual photos)
   - Size: 48px x 48px

### Image Treatment
- All images: `object-cover`, `rounded-lg`
- Hero: No overlay by default, text on cream background
- Cards: Subtle dark overlay (10% opacity) on hover for contrast
- Loading: Skeleton screens with cream background animation

---

## Animations

**Use Sparingly** - Minimalist approach:
- Smooth transitions: `transition-all duration-300 ease-in-out`
- Hover states: Shadow elevation, subtle scale (`hover:scale-105`)
- Page transitions: Fade-in on scroll for sections (intersection observer)
- NO: Complex animations, auto-play carousels, distracting effects

---

## Accessibility & Responsiveness

- **Contrast**: Black on cream exceeds WCAG AA standards
- **Focus States**: Visible outline on all interactive elements
- **Mobile-First**: All layouts stack gracefully, touch targets minimum 44px
- **Semantic HTML**: Proper heading hierarchy, landmarks, alt text for all images

---

## Special Considerations

**Cultural Sensitivity**: Authentic representation without stereotypes, diverse imagery showcasing India's variety

**Information Hierarchy**: Foreign visitors need clear, scannable information - use bulleted lists, clear headings, concise descriptions

**Trust Building**: Reviews and social proof prominently displayed to reassure international travelers