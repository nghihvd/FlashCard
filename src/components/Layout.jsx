import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

const Layout = ({ children, activeView, setView }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 transition-colors duration-300 overflow-x-hidden relative">
      {/* Background blobs for premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-32 pb-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
