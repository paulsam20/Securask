import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Bell,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  searchValue,
  onSearchChange,
}) => {
  const { logout, user } = React.useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 z-40 overflow-y-auto"
      >
        {/* Sidebar content */}
        <div className="p-6 space-y-8">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg tracking-tight">
              S
            </div>
            <div>
              <p className="font-bold text-lg text-black tracking-tight">
                Securask
              </p>
              <p className="text-xs text-neutral-400 font-medium">
                Task Manager
              </p>
            </div>
          </motion.div>

          {/* User info */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <p className="text-xs text-neutral-400 font-medium">Welcome back</p>
            <p className="font-semibold text-black truncate mt-1">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-white transition-colors"
            >
              <Home size={18} />
              <span className="text-sm font-semibold">Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
              <Bell size={18} />
              <span className="text-sm font-medium">Notifications</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </motion.button>
          </nav>

          {/* Logout button */}
          <div className="pt-4 border-t border-neutral-100">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-red-500 hover:border-red-200 transition-all font-medium"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
          }`}
      >
        {/* Top bar */}
        <motion.header className="bg-white/80 border-b border-neutral-200 backdrop-blur-md p-5 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-6">
            {/* Menu toggle */}
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              {sidebarOpen ? (
                <X size={22} className="text-neutral-600" />
              ) : (
                <Menu size={22} className="text-neutral-600" />
              )}
            </motion.button>

            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-neutral-400 transition-all duration-300 text-sm"
              />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors relative"
              >
                <Bell size={18} className="text-neutral-500" />
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
