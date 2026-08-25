import { useUserData } from "./custom-hooks/user-related-fetching/user-data";
import ProdXAuth from "./pages/Auth-page";
import ProdXDashboard from "./pages/Dashboard";
import ProdXLandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { userAppStore } from "./store";
import { useContext, useEffect } from "react";
import { Loader } from "lucide-react";
import { ProtectedRoutes } from "./custom-components/protected-routes";
import { PublicRoutes } from "./custom-components/public-routes";
import ProfilePage from "./pages/Profile-page";
import TimerPage from "./pages/Productivity-timer-pages";
import { socketContext } from "./context/socket-context";
import socket from "./lib/socket.io";
import { toast } from "sonner";
import { usePresence } from "./context/user-presence-context";


// * Have a single source of truth here for authentication right now there is !!accessToken and one is isAuthenticated. . .

function App() {
  // console.log("isAuthenticated : ", userAppStore((state) => state.isAuthenticated));

  const isSocketConnected = useContext(socketContext);


  // ? Debug this , isUserOnline is showing false when connected
  const {isUserOnline , seedOnlineUsers} = usePresence();
  
  console.log("Is User Online : " , isUserOnline);

  console.log(`Socket Connection : ${JSON.stringify(isSocketConnected)}`);

  const setIsAuthenticated = userAppStore((state) => state.setIsAuthenticated);
  const setUserId = userAppStore((state) => state.setUserId);

  const user_id = userAppStore((state) => state.user_id);

  const { data, isPending, isError } = useUserData();

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
      <Loader />
    </div>;
  }

  // * Test this ASAP !
  socket.on("invitation-notification", (payload: any) => {
    console.log(`This is the payload : ${{payload}}`);
    toast.info(`You are invited to group-timer from ${payload.username}`)
  });
  
  console.log("This is App.tsx : ", "data :", data, "ispending : ", isPending, "isError : ", isError);
  console.log("UserId in APP.tsx : ", user_id);

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
        <Route
          path="/timer"
          element={
            <ProtectedRoutes>
              <TimerPage />
            </ProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;