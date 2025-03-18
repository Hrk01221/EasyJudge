/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React components
    "./index.html", // Main HTML file (if applicable)
  ],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#1a2e36",
        primary: " #14B8A6",
        secondary: "#93c5f6",
        Text: "#D1D5DB",
        Button: "#3B82F6",
        "Button-Hover": "#2563EB",
        "dark-input": {
          DEFAULT: "#1F2937",
          placeholder: "#6B7280",
        },
        "border-custom": "#374151",
        "border-custom2": "#7C3AED",
        "login-reg-card": "#1a2b36",
        "nav-col": "#662D91",
      },
    },
  },
  plugins: [],
};
