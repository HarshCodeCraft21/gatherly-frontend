import React, { useState, useRef, useEffect } from "react";
import { Settings, User, Shield, LogOutIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const SettingsDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const clearToken = () => {
    if (confirm("Are you sure you want to Logout?")) {
      localStorage.clear();
      Cookies.remove("JwtToken");
      toast.success("You logged out successfully");
      window.location.reload();
    }
  };

  // Menu items (reuse for desktop + mobile)
  const menuItems = [
    {
      label: "User Profile",
      icon: <User className="w-5 h-5 text-purple-500" />,
      onClick: () => alert("User Profile clicked"),
    },
    {
      label: "Security",
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      onClick: () => alert("Security clicked"),
    },
    {
      label: "Logout",
      icon: <LogOutIcon size={16} />,
      onClick: clearToken,
      extraClass: "text-red-500 hover:text-red-600",
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 bg-purple-600 text-white rounded-md shadow-lg 
                   hover:bg-purple-700 hover:scale-110 transition-all duration-200 flex items-center gap-2"
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>

      {/* Desktop Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="hidden sm:block absolute right-0.5 mt-3 w-56 rounded-xl overflow-hidden z-20
                       bg-white border border-purple-300 shadow-xl"
          >
            <div className="flex flex-col">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className={`group flex items-center gap-3 px-5 py-3 text-gray-700 
                             hover:bg-purple-50 hover:text-purple-600 transition-all ${item.extraClass || ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="sm:hidden fixed bottom-0 left-0 w-full z-30
                       bg-white border-t border-purple-300 rounded-t-2xl shadow-2xl p-4"
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1.5 bg-purple-400 rounded-full"></div>
            </div>

            <div className="flex flex-col space-y-3">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className={`flex items-center gap-3 px-5 py-3 text-gray-700 
                              bg-purple-50 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all ${item.extraClass || ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsDropdown;
