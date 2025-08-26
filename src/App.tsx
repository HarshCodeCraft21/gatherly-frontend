import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import About from "./components/About/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [verifyToken, setVerifyToken] = useState(null);
  useEffect(() => {
    const token = Cookies.get("JwtToken");
    console.log(token)
    setVerifyToken(token);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar verifyToken={verifyToken} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact token={verifyToken} />} />
            <Route path="/login" element={verifyToken ? <Navigate to='/' replace /> : <Login />} />
            <Route path="/signup" element={verifyToken ? <Navigate to='/' replace /> : <Signup />} />
            <Route path="/events/:id" element={verifyToken ? <EventDetails /> : <Navigate to='/login' replace />} />
            <Route path="/create-event" element={verifyToken ? <CreateEvent /> : <Navigate to='/login' replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
