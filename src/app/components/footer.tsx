"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useThemeStore } from '@/app/stores/useThemeStore';

export default function Footer() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <footer className={`w-full ${isDark ? 'bg-black text-gray-400 border-gray-800' : 'bg-gray-50 text-gray-500 border-gray-200'} py-12 px-4 border-t`}>
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Left side - Logo/Branding */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-2xl font-bold bg-gradient-to-r ${isDark ? 'from-blue-700 to-cyan-600' : 'from-blue-600 to-cyan-500'} bg-clip-text text-transparent`}
            >
              Pathfinder
            </motion.div>
            <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className="text-sm">Advanced Tracking Solutions</span>
          </div>

          {/* Middle - Navigation Links */}
          <motion.div 
            className="flex gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/privacy" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
              Terms of Service
            </Link>
            <Link href="/contact" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
              Contact
            </Link>
          </motion.div>

          {/* Right side - Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm flex flex-col items-center md:items-end"
          >
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Alemdar Teknik</span>
            </div>
            <div>All rights reserved © {new Date().getFullYear()}</div>
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`h-px bg-gradient-to-r from-transparent ${isDark ? 'via-gray-700' : 'via-gray-300'} to-transparent my-8`}
        />

        {/* Social/Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6"
        >
          <Link href="#" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </Link>
          <Link href="#" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </Link>
          <Link href="#" className={`hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
