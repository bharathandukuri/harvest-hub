import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        allowedHosts: [
            "dd86-103-193-77-243.ngrok-free.app",
            "5e9b-2409-40f0-3183-350c-f81f-5d6c-736f-900c.ngrok-free.app",
            "73bf-103-193-77-70.ngrok-free.app",
            "a464-103-193-77-70.ngrok-free.app",
        ],
        watch: {
            ignored: ["**/backend/**"],
        },
    },
});
