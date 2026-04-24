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
import ProfilePage from "./pages/Profile-page";

function App() {
  console.log("isAuthenticated : ", userAppStore((state) => state.isAuthenticated));
  const setIsAuthenticated = userAppStore((state) => state.setIsAuthenticated);
  const setUserId = userAppStore((state) => state.setUserId);
  const { data, isPending , isError} = useUserData();
  
  console.log("This is App.tsx : " , "data :" , data , "ispending : " , isPending , "isError : " , isError);
  useEffect(() => {
    if (data?.success) {
      setIsAuthenticated(true);
      setUserId(data.data._id);
    }
    if (isError) {
      setIsAuthenticated(false);
    }
  }, [data, setIsAuthenticated]);

  if (isPending) {
    return <div className="h-screen w-screen flex justify-center items-center">
      <Loader/>
    </div>;
  }

  // Now I have to test it , weather useUserData API is acting accordingly for the source of truth of the user's authentication

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicRoutes>
            <ProdXLandingPage />
          </PublicRoutes>}
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
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;