/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        sage: "#A8B5A3",
        cream: "#F4F1ED",
        gold: "#D4A373",
        ebony: "#1C1C1C",
        eucalyptus: "#748C69",
        transition: "#FAF7F2",
        primary: {
          300: "#94A88B",  // Lighter shade
          400: "#849C7A",  // Light shade
          500: "#748C69",  // Base color (eucalyptus)
          600: "#647A59",  // Darker shade
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        slogan: ["Raleway", "sans-serif"],
        body: ["Lora", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0, 0, 0, 0.05)",
        medium: "0 6px 12px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "geometric-pattern": "url('/images/geometric-pattern.svg')",
        "nature-pattern": "url('/images/nature-pattern.svg')",
      },
    },
  },
  plugins: [],
};
