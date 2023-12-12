/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        pulse: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
    colors: {
      transparent: "transparent",
      coralPink: "#FF9271",
      coralPinkLight: "#fdbfa6",
      turquoise: "#68e0f8 ",
      darkTurquoise: "#045c5a",
      mediumTurquoise: "#00b9bc",
      mustardYellow: "#F9C74F ",
      white: "#ffffff",
      lightGray: "#F0F0F0 ",
      charcoal: "#333333",
      red: "#dc2626",
    },
  },

  plugins: [],
};
