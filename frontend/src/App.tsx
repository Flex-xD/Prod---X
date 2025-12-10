import ProdXAuth from "./pages/Auth-page";
import ProdXDashboard from "./pages/Dashboard";
import ProdXLandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProdXLandingPage />} />
        <Route path='/dashboard' element={ <ProdXDashboard/>} />
        <Route path='/auth' element={ <ProdXAuth/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;