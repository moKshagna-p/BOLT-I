/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette from the image
        primary: {
          DEFAULT: '#f59e0b', // Primary orange
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#3f4f6', // Secondary gray-blue
          foreground: '#4b5563',
        },
        accent: {
          DEFAULT: '#fffbeb', // Light cream/beige
          foreground: '#92400e', // Brown accent
        },
        muted: {
          DEFAULT: '#f9fafb', // Light gray
          foreground: '#6b7280',
        },
        destructive: {
          DEFAULT: '#ef4444', // Red for destructive actions
          foreground: '#ffffff',
        },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#f59e0b',
      },
    },
  },
  plugins: [],
};