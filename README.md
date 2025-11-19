[![Netlify Status](https://api.netlify.com/api/v1/badges/d19e7432-8155-4355-adb9-b2dc7621f984/deploy-status)](https://app.netlify.com/projects/graceful-puffpuff-983cf3/deploys)

# seanyang.me - Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js 15, featuring an animated background, light/dark mode toggle, interactive tooltips, and smooth scroll animations.

Dynamic content served from https://api.seanyang.me/

See https://github.com/aicheye/api.seanyang.me for more.

## Features

### Visual Design

- **Animated Background**: Dynamic blob animations and dot patterns that adapt to light/dark themes
- **Light/Dark Mode**: Seamless theme switching with persistent user preference
- **Responsive Design**: Fully responsive layout optimized for all screen sizes
- **Modern UI**: Clean, minimalist design with smooth transitions and hover effects

### Interactive Elements

- **Mouse-Following Tooltips**: Interactive tooltips that follow cursor movement
- **Smooth Animations**: Fade-in effects and bounce animations for enhanced user experience
- **Scroll Animations**: Content appears dynamically as users scroll
- **Theme Toggle**: Fixed theme switcher with sun/moon icons (synced to system settings)

### Technical Features

- **Next.js 15**: Latest version with Turbopack for fast development
- **React 19**: Modern React with hooks and functional components
- **Tailwind CSS 4**: Utility-first CSS framework for rapid styling

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/seanyang.me.git
   cd seanyang.me
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the website.

## Adding New Projects

Edit the `src/data/portfolio.js` file to add new projects:

```javascript
const portfolio = [
  {
    title: "Your Project Title",
    description: "Brief description of your project",
    github: "https://github.com/username/repo",
    thumbnail: "/your-image.png", // Place image in public/ folder
  },
  // Add more projects...
];
```

## License

This project is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- oneko: https://github.com/adryd325/oneko.js
- Idea to show song suggestions: Brian Cai
