"use client";

import { useState } from "react";

export default function HeaderActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 md:px-4 rounded-full font-medium hover:bg-[#1ebd59] transition-colors text-sm md:text-base"
      >
        Chat Now
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[280px] md:w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[100]">
          <div className="bg-brand-maroon text-brand-ivory p-4">
            <h4 className="font-bold text-lg leading-tight">Welcome to Shree Siddhivinayak Distributors! 🪔</h4>
            <p className="text-sm mt-2 text-brand-cream">How can we help you with your spiritual needs today?</p>
          </div>
          <div className="p-4 bg-gray-50 flex flex-col gap-3">
            <a 
              href="https://wa.me/917400422743" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-[#25D366] text-white py-3 rounded font-bold hover:bg-[#1ebd59] transition-colors flex items-center justify-center gap-2"
            >
              Open WhatsApp
            </a>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full text-center border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
