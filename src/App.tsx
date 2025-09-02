import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ChangePassword from './pages/changePassword';
import Cookies from 'js-cookie';
import ScrollToTop from './components/ScrollTop/ScrollToTop'
import UserProfile from "./components/UserProfile";
// ✅ Lazy load pages/components
const Home = lazy(() => import("./pages/Home"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const About = lazy(() => import("./components/About/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const UpdateEvent = lazy(()=>import("./pages/updateEvent"));
const NotFound = lazy(() => import("./pages/NotFound"));
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [verifyToken, setVerifyToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("JwtToken");
    Cookies.set("JwtToken", token);
    setVerifyToken(token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar verifyToken={verifyToken} />
          <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact token={verifyToken} />} />
              <Route
                path="/login"
                element={
                  verifyToken ? <Navigate to="/" replace /> : <Login />
                }
              />
              <Route
                path="/signup"
                element={
                  verifyToken ? <Navigate to="/" replace /> : <Signup />
                }
              />
              <Route
                path="/events/:id"
                element={
                  verifyToken ? <EventDetails /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/create-event"
                element={
                  verifyToken ? <CreateEvent /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/change-password"
                element={
                  verifyToken ? <ChangePassword /> : <Navigate to='/login' replace />
                }
              />
              <Route 
                path="/user-profile"
                element={
                  verifyToken ? <UserProfile /> : <Navigate to='/login' replace />
                }
                
              />
              <Route 
                path="/update-event/:id"
                element={
                  verifyToken ? <UpdateEvent /> : <Navigate to='/login' replace />
                }
                
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
