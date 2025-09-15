import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/SideBar";
import Home from "./Pages/Home";
import Activities from "./Pages/Activities";
function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
               <Route path="/activities" element={<Activities />} />
              {/* <Route path="/gallery" element={<Gallery />} />
              <Route path="/team" element={<Team />} />
              <Route path="/news" element={<News />} />
              <Route path="/users" element={<Users />} />
              */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
