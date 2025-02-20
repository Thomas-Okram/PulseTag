import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7000", // ✅ Local development backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL":
      process.env.NODE_ENV === "production"
        ? `"https://pulsetagapp.com"` // ✅ Use the correct production backend
        : `"http://localhost:7000"`, // ✅ Use local backend during development
  },
});
