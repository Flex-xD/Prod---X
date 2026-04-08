import ProdXAuth from "./pages/Auth-page";
import ProdXDashboard from "./pages/Dashboard";
import ProdXLandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type React from "react";

const ProtectedRoutes = (isProtected: boolean, allowWithoutAuthentication: boolean, children: React.ElementType) => {
  if (allowWithoutAuthentication) return children;
  if (!isProtected) return <Navigate to={"/auth"} />
  return children;
}

function App() {

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