import React, { useState, useRef, useEffect, useCallback } from "react";
import { Settings, User, Shield, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

const SettingsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      if (sheetRef.current && sheetRef.current.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const clearToken = useCallback(() => {
    if (confirm("Are you sure you want to Logout?")) {
      localStorage.clear();
      Cookies.remove("JwtToken");
      toast.success("You logged out successfully");
      window.location.reload();
    }
  }, []);

  // helper to handle click and close sheet
  const handleItemClick = useCallback(
    (fn) => {
      return () => {
        try {
          fn && fn();
        } catch (err) {
          console.error(err);
        }
        setOpen(false);
      };
    },
    []
  );

  // Menu items
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
      icon: <LogOut size={16} />,
      onClick: clearToken,
      extraClass: "text-red-500 hover:text-red-600",
    },
  ];

  // Motion Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.95 },
  };

  const sheetVariants = {
    hidden: { y: "100%" }, // fully below screen
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
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
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="hidden sm:block absolute right-0.5 mt-3 w-56 rounded-xl overflow-hidden z-20
                       bg-white border border-purple-300 shadow-xl"
          >
            <div className="flex flex-col">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={handleItemClick(item.onClick)}
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

      {/* Mobile Bottom Sheet (Portal) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={sheetRef}
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="sm:hidden fixed bottom-0 left-0 w-full z-50
                           bg-white border-t border-purple-300 rounded-t-2xl shadow-2xl p-4"
              >
                {/* Drag handle */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-1.5 bg-purple-400 rounded-full" />
                </div>

                {/* Menu Items */}
                <div className="flex flex-col space-y-3">
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={handleItemClick(item.onClick)}
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
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default SettingsDropdown;
