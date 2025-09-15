import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 border-r flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col space-y-3">
        <Link to="/home" className="hover:bg-gray-200 p-2 rounded">Home</Link>
        <Link to="/activities" className="hover:bg-gray-200 p-2 rounded">Activities</Link>
        <Link to="/gallery" className="hover:bg-gray-200 p-2 rounded">Gallery</Link>
        <Link to="/team" className="hover:bg-gray-200 p-2 rounded">Team</Link>
        <Link to="/board_team" className="hover:bg-gray-200 p-2 rounded">Board Team</Link>
        <Link to="/news" className="hover:bg-gray-200 p-2 rounded">News</Link>
        <Link to="/users" className="hover:bg-gray-200 p-2 rounded">Users</Link>
      </nav>
    </div>
  );
}
