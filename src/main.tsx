import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Providers } from "@/components/platform/Providers";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");

      // If there's already a waiting worker (after refresh), activate it.
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            // New version is ready—reload to ensure we don't mix old/new JS chunks.
            window.location.reload();
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } catch {
      // Silent fail (offline support is best-effort)
    }
  });
}
