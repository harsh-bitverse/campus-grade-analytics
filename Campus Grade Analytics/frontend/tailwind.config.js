/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf8",
          100: "#d3f7ef",
          200: "#a9efdf",
          300: "#71dfc9",
          400: "#39c5ae",
          500: "#1ca892",
          600: "#138678",
          700: "#136b61",
          800: "#14554e",
          900: "#154640"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.18)"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(28,168,146,0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

