import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/SideBar";
import Home from "./Pages/Home";
import Activities from "./Pages/Activities";
import EventGallery from "./Pages/Gallery";
import News from "./Pages/News";
import Team from "./Pages/Team";
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
              <Route path="/gallery" element={<EventGallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/team" element={<Team />} />
              {/* 
              
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
