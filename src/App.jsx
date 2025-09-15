import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import Sidebar from "./Components/SideBar";
import Home from "./Pages/Home";
import Activities from "./Pages/Activities";
import News from "./Pages/News";
import Team from "./Pages/Team";
import SteeringTeam from "./Pages/BoardTeam";
import CombinedGallery from "./Pages/Gallery";
import Login from "./service/Login";
import NotFound from "./Components/NotFound";

const AppLayout = () => {
  const location = useLocation();

  // Define known layout routes
  const layoutRoutes = [
    "/home",
    "/activities",
    "/gallery",
    "/news",
    "/team",
    "/board_team"
  ];

  const isLoginPage = location.pathname === "/login";
  const isLayoutRoute = layoutRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const showLayout = !isLoginPage && isLayoutRoute;

  return (
    <div className="flex flex-col h-screen">
      {showLayout && <Navbar />}
      <div className="flex flex-1">
        {showLayout && <Sidebar />}

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/gallery" element={<CombinedGallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/team" element={<Team />} />
            <Route path="/board_team" element={<SteeringTeam />} />
            <Route path="*" element={<NotFound />} /> {/* 404 Route */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
