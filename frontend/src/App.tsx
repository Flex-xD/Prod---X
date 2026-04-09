import { useUserData } from "./custom-hooks/user-related-fetching/user-data";
import ProdXAuth from "./pages/Auth-page";
import ProdXDashboard from "./pages/Dashboard";
import ProdXLandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { userAppStore } from "./store";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { ProtectedRoutes } from "./custom-components/protected-routes";
import { PublicRoutes } from "./custom-components/public-routes";

function App() {
  const setIsAuthenticated = userAppStore((state) => state.setIsAuthenticated);
  const { data, isPending, isError } = useUserData();

  useEffect(() => {
    if (data?.success) {
      setIsAuthenticated(true);
    }
    if (isError) {
      setIsAuthenticated(false);
    }
  }, [data, isPending, setIsAuthenticated]);

  if (isPending) {
    return <Loader></Loader>;
  }

  // Now I have to test it , weather useUserData API is acting accordingly for the source of truth of the user's authentication

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ProdXLandingPage />}
        />
        <Route
          path="/auth"
          element={
            <PublicRoutes>
              <ProdXAuth />
            </PublicRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <ProdXDashboard />
            </ProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;