import { useEffect } from "react";
import ProdXAuth from "./pages/Auth-page";
import ProdXDashboard from "./pages/Dashboard";
import ProdXLandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from "socket.io-client";

function App() {
  // See weather you should put the api-gateway url or the specififc service one
  useEffect(() => {
    const socket = io("http://localhost:9000");

    socket.on("connect", () => {
      console.log(`Socket connected to the server : ${socket.id}`);
    })

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    () => {
      socket.disconnect();
    }
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProdXLandingPage />} />
        <Route path='/dashboard' element={<ProdXDashboard />} />
        <Route path='/auth' element={<ProdXAuth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;