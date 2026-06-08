/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        ember: "#d97706",
        mist: "#f8fafc",
        pine: "#14532d",
        sand: "#f7f1e8",
        coral: "#f97316"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Manrope", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.12), transparent 0 28%), radial-gradient(circle at 80% 0%, rgba(20, 83, 45, 0.14), transparent 0 22%), linear-gradient(135deg, #fffaf2 0%, #f8fafc 48%, #eefbf1 100%)"
      }
    },
  },
  plugins: [],
};
