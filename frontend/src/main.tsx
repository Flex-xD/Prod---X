import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from "./context/socket-context/index.tsx";
import { PresenceProvider } from "./context/user-presence-context/index.tsx";

const queryCleint = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min , 

      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryCleint}>
    {/* ? See if socket provider should be after queryClientProvider or before it  */}
    <SocketProvider>
      <PresenceProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
          <App />
          <Toaster position="top-right" richColors />
        </GoogleOAuthProvider>
      </PresenceProvider>
    </SocketProvider>
  </QueryClientProvider>


)
