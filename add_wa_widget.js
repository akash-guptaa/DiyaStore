const fs = require('fs');

const widgetContent = `
'use client';
import { useState, useEffect } from 'react';

export default function WhatsAppWidget() {
  const [number, setNumber] = useState('917400422743');
  const [showGreeting, setShowGreeting] = useState(false);
  
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.whatsappNumber) {
        setNumber(data.whatsappNumber.replace(/[^0-9]/g, ''));
      }
    }).catch(() => {});

    // Show greeting after 2 seconds
    const timer = setTimeout(() => setShowGreeting(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const message = encodeURIComponent("Hi! I'm interested in your products.");
  const href = \`https://wa.me/\${number}?text=\${message}\`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Greeting Message Bubble */}
      <div className={\`transition-all duration-500 transform origin-bottom-right \${showGreeting ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}\`}>
        <div className="bg-white px-4 py-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-stone-100 relative">
          <p className="text-sm font-bold text-stone-800 flex items-center gap-2">
            Hi there! <span className="animate-bounce">👋</span>
          </p>
          <p className="text-xs text-stone-500 mt-1 pr-2">Need help? Chat with us.</p>
          {/* Caret pointing to button */}
          <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-b border-r border-stone-100 transform -rotate-45"></div>
          
          <button 
            onClick={(e) => { e.preventDefault(); setShowGreeting(false); }} 
            className="absolute top-2 right-2 text-stone-300 hover:text-stone-600"
          >
            &times;
          </button>
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <a 
        href={href} 
        target="_blank" 
        rel="noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 relative group"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:hidden"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" className="relative z-10">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.585c-.605-1.047-.922-2.256-.922-3.487 0-4.666 3.797-8.461 8.465-8.461 4.667 0 8.466 3.795 8.467 8.461 0 4.667-3.798 8.462-8.466 8.462z"/>
        </svg>
      </a>
    </div>
  );
}
`;

fs.writeFileSync('src/components/WhatsAppWidget.tsx', widgetContent.trim() + '\\n');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

if (!layout.includes('WhatsAppWidget')) {
  layout = layout.replace('import Footer from "@/components/Footer";', 'import Footer from "@/components/Footer";\\nimport WhatsAppWidget from "@/components/WhatsAppWidget";');
  layout = layout.replace('<Footer />', '<Footer />\\n          <WhatsAppWidget />');
  fs.writeFileSync('src/app/layout.tsx', layout);
}

console.log("WhatsApp widget added.");
