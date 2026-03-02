import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAuthListener } from "@/lib/auth";
import { initializeHiveStores } from "@/lib/hive-simple";

// Initialize Hive stores before starting the app
initializeHiveStores().then(() => {
  console.log('Hive stores initialized, starting app...');
}).catch(error => {
  console.error('Failed to initialize Hive stores:', error);
});

initAuthListener();

createRoot(document.getElementById("root")!).render(<App />);
