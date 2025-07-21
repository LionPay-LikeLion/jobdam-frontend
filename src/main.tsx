import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("💡 GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
createRoot(document.getElementById("root")!).render(<App />);
