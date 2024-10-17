import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import ChatBot from "../../features/chatbot/ChatBot";

export default function HomeLayout() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[80vh] overflow-hidden">
        <Outlet />
      </main>
      <ChatBot />
    </div>
  );
}
