import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="p-4 sm:ml-64 min-h-screen">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[calc(100vh-2rem)]">
          <Toaster position="top-right" />
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
