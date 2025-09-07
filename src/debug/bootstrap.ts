// === HUBB bootstrap debug ===
console.log("[HUBB] bootstrap start", new Date().toISOString());

(function attachGlobalHandlers(){
  if (typeof window !== "undefined") {
    window.addEventListener("error", (e) => {
      console.error("[HUBB] window.error:", e?.message || e, e?.error || "");
    });
    window.addEventListener("unhandledrejection", (e) => {
      console.error("[HUBB] unhandledrejection:", (e && (e.reason || e)) || "unknown");
    });
  }
})();
export {};
