'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Settings } from '@/types/settings';

export default function CatalogueViewer({ products, settings }: { products: Product[]; settings: Settings }) {
  const [showPrices, setShowPrices] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const catalogueContainerRef = useRef<HTMLDivElement>(null);

  // Split published products into chunks of 3 for each product page
  const chunkSize = 3;
  const productChunks: Product[][] = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    productChunks.push(products.slice(i, i + chunkSize));
  }

  // Page numbering:
  // Page 1: Cover (01)
  // Page 2: About Artisans (02)
  // Page 3: Collection Intro (03)
  // Page 4 to (3 + productChunks.length): Product Pages
  // Final Page: Contact & Ordering (3 + productChunks.length + 1)
  const totalPages = 3 + productChunks.length + 1;

  const pad = (num: number) => String(num).padStart(2, '0');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!catalogueContainerRef.current) return;
    setIsDownloading(true);
    setProgressMsg('Preparing PDF generator...');

    try {
      const { default: jsPDF } = await import('jspdf');
      const { toJpeg } = await import('html-to-image');

      const pageElements = catalogueContainerRef.current.querySelectorAll<HTMLElement>('.catalogue-page');
      if (pageElements.length === 0) {
        throw new Error('No catalogue pages found to export.');
      }

      // Create A4 PDF (210 x 297 mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        setProgressMsg(`Rendering page ${i + 1} of ${pageElements.length}...`);
        const pageEl = pageElements[i];

        // Capture page as high-resolution JPEG via native browser foreignObject renderer
        // Force exact 794x1123 A4 dimensions and zero out all browser margin offsets
        const imgData = await toJpeg(pageEl, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#FAF7F2',
          cacheBust: false,
          width: 794,
          height: 1123,
          style: {
            margin: '0',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0',
            marginBottom: '0',
            left: '0',
            top: '0',
            transform: 'none',
            width: '794px',
            height: '1123px',
            minWidth: '794px',
            maxWidth: '794px',
            minHeight: '1123px',
            maxHeight: '1123px',
          },
        });

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setProgressMsg('Saving PDF...');
      pdf.save('Diya_Store_Product_Catalogue.pdf');
      setProgressMsg('Done!');
      setTimeout(() => {
        setIsDownloading(false);
        setProgressMsg('');
      }, 1500);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      alert('Could not download PDF directly: ' + (err.message || 'Please use "Print / Save as PDF" button.'));
      setIsDownloading(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 py-6 md:py-10">
      
      {/* Sticky Action Toolbar (Hidden during print) */}
      <div className="no-print sticky top-20 z-40 max-w-5xl mx-auto px-4 mb-6">
        <div className="bg-white/95 backdrop-blur-md border border-stone-300 rounded-2xl shadow-xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="text-stone-700 hover:text-stone-900 text-xs md:text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              ← Back to Shop
            </Link>
            <div className="h-4 w-px bg-stone-300"></div>
            <div className="text-xs md:text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <span>📖</span>
              <span>{totalPages} Pages Catalogue</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Show/Hide Prices Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 transition-colors select-none">
              <input 
                type="checkbox" 
                checked={showPrices} 
                onChange={(e) => setShowPrices(e.target.checked)}
                className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
              />
              <span>Show Prices</span>
            </label>

            {/* Print / Save as Vector PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-stone-800 text-white hover:bg-stone-900 transition-colors shadow-sm"
              title="Print or Save as crisp vector PDF using browser print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>Print / Save as PDF</span>
            </button>

            {/* Direct One-Click Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-[#8C432C] hover:bg-[#733522] text-white transition-colors shadow-md disabled:opacity-60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>{isDownloading ? (progressMsg || 'Generating...') : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {isDownloading && (
          <div className="mt-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs px-4 py-2 rounded-lg flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"></span>
              {progressMsg || 'Rendering pages...'}
            </span>
            <span className="font-semibold text-[11px] text-amber-800">Please keep this tab open</span>
          </div>
        )}
      </div>

      {/* Catalogue Pages Canvas Container */}
      <div ref={catalogueContainerRef} className="space-y-8 md:space-y-12">

        {/* =========================================================================
            PAGE 1: COVER PAGE (Exact match to Reference PDF Page 1)
        ========================================================================= */}
        <div className="flex justify-center w-full print:block">
          <section 
            className="catalogue-page bg-[#FAF7F2] text-[#3D332F] relative flex flex-col justify-between shadow-2xl border border-[#E8E0D5] box-border overflow-hidden flex-shrink-0"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', margin: 0, padding: '48px 56px', boxSizing: 'border-box' }}
          >
            {/* Top Running Header */}
            <div className="flex justify-between items-center text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase pb-2">
              <span>DIYA STORE • HANDMADE WITH LOVE</span>
              <span className="font-mono font-semibold">01</span>
            </div>

            {/* Main Title Block */}
            <div className="text-center pt-6">
              <h1 className="font-merriweather font-bold text-3xl text-[#8C432C] tracking-[0.18em] uppercase mb-2">
                THE DIYA COLLECTION
              </h1>
              <p className="font-serif italic text-sm text-[#705B53] tracking-wide">
                Thoughtfully handcrafted diyas for meaningful moments
              </p>
            </div>

            {/* Central Oval / Arch Medallion (Exact match to Reference PDF emblem) */}
            <div className="my-auto flex items-center justify-center py-4">
              <div className="bg-[#FAF2E8] p-8 rounded-sm border border-[#E8DEC9] shadow-inner flex items-center justify-center w-full max-w-sm">
                <div className="bg-[#8C432C] text-[#FAF7F2] w-64 h-84 rounded-[140px] border-2 border-white/40 flex flex-col items-center justify-center p-6 text-center shadow-md relative">
                  {/* Botanical & Diya Motif */}
                  <div className="mb-2 text-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c.5 2 2 3.5 2 5.5 0 2-1 3.5-2 3.5s-2-1.5-2-3.5c0-2 1.5-3.5 2-5.5z" fill="#FDE68A" stroke="#F59E0B" />
                      <path d="M4 14c0 4 3.5 7 8 7s8-3 8-7H4z" fill="#FDE68A" stroke="#F59E0B" />
                      <path d="M2 14h20" stroke="#FDE68A" />
                    </svg>
                  </div>

                  <div className="font-merriweather italic text-3xl text-amber-100 font-bold tracking-wide">
                    Diya Store
                  </div>
                  
                  <div className="text-[10px] tracking-[0.28em] uppercase text-amber-200/90 font-medium mt-1">
                    HANDMADE WITH LOVE
                  </div>

                  <div className="text-xs text-amber-200 my-2">♥</div>

                  <div className="text-[10px] tracking-[0.25em] uppercase text-amber-100 font-semibold mt-1">
                    PURE • ECO FRIENDLY • PRESENT
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Callout & Sub-title */}
            <div className="text-center pb-2">
              <p className="font-serif text-sm text-[#5A4D46] font-medium leading-relaxed">
                Warm light. Thoughtful details. Made to be gifted, displayed, and enjoyed.
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C432C] font-bold mt-2">
                DIYA STORE • HANDMADE WITH LOVE
              </p>
            </div>

            {/* Bottom Rule & Page Footer */}
            <div>
              <div className="border-b border-[#E3D8CC] w-full mb-3"></div>
              <div className="flex justify-between items-center text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase">
                <span>DIYA STORE • HANDMADE WITH LOVE</span>
                <span className="font-mono font-semibold">01</span>
              </div>
            </div>
          </section>
        </div>


        {/* =========================================================================
            PAGE 2: MEET THE ARTISANS / OUR STORY (Exact match to Reference PDF Page 2)
        ========================================================================= */}
        <div className="flex justify-center w-full print:block">
          <section 
            className="catalogue-page bg-[#FAF7F2] text-[#3D332F] relative flex flex-col justify-between shadow-2xl border border-[#E8E0D5] box-border overflow-hidden flex-shrink-0"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', margin: 0, padding: '48px 56px', boxSizing: 'border-box' }}
          >
            {/* Top Running Header */}
            <div className="flex justify-between items-center text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase pb-2">
              <span>DIYA STORE • HANDMADE WITH LOVE</span>
              <span className="font-mono font-semibold">02</span>
            </div>

            <div className="my-auto">
              <h2 className="font-merriweather font-bold text-3xl text-[#8C432C] mb-4">
                Meet the Artisans
              </h2>

              {/* Framed Container with Outer Border (matches Page 2 box) */}
              <div className="border-[1.5px] border-[#8C432C]/70 bg-[#FDFCFA] p-8 rounded-sm grid grid-cols-12 gap-6 shadow-sm">
                
                {/* Left Column: Portrait / Workshop Image */}
                <div className="col-span-5 flex flex-col justify-center">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded bg-stone-100 border border-[#E3D8CC] shadow-inner">
                    <img 
                      src="/uploads/terracotta_diya.jpg" 
                      alt="Artisan Craftsmanship" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Column: Artisan Story & Details */}
                <div className="col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-merriweather font-bold text-2xl text-[#8C432C]">
                      Akash & Artisans
                    </h3>
                    <div className="text-[11px] font-bold tracking-[0.2em] text-[#705B53] uppercase mt-0.5 mb-4">
                      FOUNDER & ARTISANS, DIYA STORE
                    </div>

                    <div className="space-y-3 text-xs text-[#4A3E39] leading-relaxed">
                      <p>
                        At Diya Store, we are guided by a deep love for thoughtful design, authentic Indian craftsmanship, and the small details that make a gift feel truly personal. Every diya in our collection brings together sacred temple forms, sculptural silhouettes, and classic earthen styles.
                      </p>
                      <p>
                        From statement peacock deepams to multi-layered lotus lamps and hand-poured matka mombattis, our handcrafted collection offers pieces crafted to add warmth and auspicious character to everyday spaces, Diwali festivities, and memorable gifting.
                      </p>
                    </div>

                    {/* Quote */}
                    <blockquote className="my-3 pl-3 border-l-2 border-[#8C432C] italic text-xs text-[#5A4D46]">
                      “A little detail can turn an everyday moment into something memorable.”
                    </blockquote>
                  </div>

                  {/* Bottom Highlight Box: Our Design Approach */}
                  <div className="pt-3 border-t border-[#E8DEC9]">
                    <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C432C] mb-1">
                      OUR DESIGN APPROACH
                    </div>
                    <div className="text-xs text-[#5A4D46] font-medium">
                      Traditional craft • Warm earthy tones • Decorative silhouettes • Thoughtful gifting
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Rule & Page Footer */}
            <div>
              <div className="border-b border-[#E3D8CC] w-full mb-3"></div>
              <div className="flex justify-between items-center text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase">
                <span>DIYA STORE • HANDMADE WITH LOVE</span>
                <span className="font-mono font-semibold">02</span>
              </div>
            </div>
          </section>
        </div>


        {/* =========================================================================
            PAGE 3: COLLECTION INTRO (Exact match to Reference PDF Page 3)
        ========================================================================= */}
        <section className="catalogue-page bg-[#FAF7F2] text-[#3D332F] relative w-full md:w-[210mm] min-h-[297mm] h-[297mm] p-6 md:p-[20mm] flex flex-col justify-between shadow-2xl mx-auto border border-[#E8E0D5] box-border overflow-hidden">
          {/* Top Running Header */}
          <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase pb-2">
            <span>DIYA STORE • HANDMADE WITH LOVE</span>
            <span className="font-mono font-semibold">03</span>
          </div>

          <div className="text-center pt-4 md:pt-6">
            <h2 className="font-merriweather font-bold text-2xl md:text-4xl text-[#8C432C] mb-4">
              The Diya Collection
            </h2>
            <p className="font-serif text-xs md:text-sm text-[#5A4D46] max-w-xl mx-auto leading-relaxed">
              From petite tea-lights to sculptural floral pieces, each design is presented with a short description to help customers explore the collection. Crafted with natural riverbed clay, pure brass, and devotion for your sacred celebrations.
            </p>
          </div>

          {/* Center Emblem Card */}
          <div className="my-auto flex items-center justify-center py-6">
            <div className="bg-[#FAF2E8] p-6 md:p-10 rounded-sm border border-[#E8DEC9] shadow-inner flex items-center justify-center w-full max-w-sm">
              <div className="bg-[#8C432C] text-[#FAF7F2] w-52 md:w-60 h-72 md:h-80 rounded-[120px] border-2 border-white/40 flex flex-col items-center justify-center p-6 text-center shadow-md relative">
                <div className="mb-2 text-amber-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2c.5 2 2 3.5 2 5.5 0 2-1 3.5-2 3.5s-2-1.5-2-3.5c0-2 1.5-3.5 2-5.5z" fill="#FDE68A" stroke="#F59E0B" />
                    <path d="M4 14c0 4 3.5 7 8 7s8-3 8-7H4z" fill="#FDE68A" stroke="#F59E0B" />
                    <path d="M2 14h20" stroke="#FDE68A" />
                  </svg>
                </div>
                <div className="font-merriweather italic text-2xl text-amber-100 font-bold tracking-wide">
                  Diya Store
                </div>
                <div className="text-[9px] tracking-[0.28em] uppercase text-amber-200/90 font-medium mt-1">
                  HANDMADE WITH LOVE
                </div>
                <div className="text-xs text-amber-200 my-2">♥</div>
                <div className="text-[9px] tracking-[0.25em] uppercase text-amber-100 font-semibold mt-1">
                  PURE • ECO FRIENDLY • PRESENT
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pb-2">
            <p className="font-serif text-xs md:text-sm text-[#705B53] font-medium">
              Decorative diyas & candles for home, celebrations, and gifting
            </p>
          </div>

          {/* Bottom Rule & Page Footer */}
          <div>
            <div className="border-b border-[#E3D8CC] w-full mb-3"></div>
            <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase">
              <span>DIYA STORE • HANDMADE WITH LOVE</span>
              <span className="font-mono font-semibold">03</span>
            </div>
          </div>
        </section>


        {/* =========================================================================
            PAGES 4 TO N: PRODUCT SHOWCASE PAGES (Exact match to Reference PDF Pages 4-11)
            - 3 products per page
            - Framed box container with 3 equal horizontal rows
            - Square image on left, title & description on right
        ========================================================================= */}
        {productChunks.map((chunk, pageIndex) => {
          const currentPageNum = 4 + pageIndex;

          return (
            <section 
              key={pageIndex} 
              className="catalogue-page bg-[#FAF7F2] text-[#3D332F] relative w-full md:w-[210mm] min-h-[297mm] h-[297mm] p-6 md:p-[20mm] flex flex-col justify-between shadow-2xl mx-auto border border-[#E8E0D5] box-border overflow-hidden"
            >
              {/* Top Running Header */}
              <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase pb-2">
                <span>DIYA STORE • HANDMADE WITH LOVE</span>
                <span className="font-mono font-semibold">{pad(currentPageNum)}</span>
              </div>

              {/* Page Title & Subtitle */}
              <div className="pt-2 pb-3">
                <h2 className="font-merriweather font-bold text-xl md:text-2xl text-[#8C432C]">
                  The Candle & Diya Collection
                </h2>
                <p className="font-serif text-xs text-[#705B53]">
                  Decorative candles and handcrafted earthen lamps for home, celebrations, and gifting
                </p>
              </div>

              {/* Main Framed Container with 3 Rows (Matches exact reference PDF layout) */}
              <div className="border-[1.5px] border-[#E3D8CC] bg-[#FAF7F2] rounded-sm divide-y divide-[#E3D8CC] flex-1 flex flex-col my-auto shadow-sm overflow-hidden">
                {chunk.map((product) => {
                  const imgUrl = product.images?.[0]?.url || '/uploads/terracotta_diya.jpg';

                  return (
                    <div 
                      key={product.id} 
                      className="flex-1 grid grid-cols-12 items-center p-3 md:p-4 gap-4 md:gap-6 bg-[#FAF7F2]"
                    >
                      {/* Left: Square Product Image */}
                      <div className="col-span-4 h-full flex items-center justify-center">
                        <div className="aspect-square w-full max-w-[130px] md:max-w-[150px] overflow-hidden rounded bg-stone-100 border border-[#E3D8CC] shadow-inner flex-shrink-0">
                          <img 
                            src={imgUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Right: Product Name, Code, Description & Optional Price */}
                      <div className="col-span-8 flex flex-col justify-center pr-2">
                        <h3 className="font-merriweather font-bold text-sm md:text-base text-[#8C432C] leading-snug mb-1">
                          {product.name}
                        </h3>

                        {/* Product SKU Code & Category Tag */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-[#705B53] uppercase">
                            Code: {product.productCode}
                          </span>
                          {product.categoryId && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-[#FAF2E8] border border-[#E8DEC9] text-[#8C432C] rounded">
                              {product.categoryId}
                            </span>
                          )}
                        </div>

                        {/* Short Description */}
                        <p className="text-[11px] md:text-xs text-[#4A3E39] leading-relaxed line-clamp-3">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Price Tag (Toggleable via action bar) */}
                        {showPrices && (
                          <div className="mt-2 flex items-center gap-2 font-bold text-[#8C432C] text-xs md:text-sm">
                            <span>₹{product.salePrice || product.price}</span>
                            {product.salePrice && (
                              <span className="text-[11px] line-through text-stone-400 font-normal">
                                MRP ₹{product.price}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* If the last page has only 1 or 2 products, render clean empty placeholder rows to maintain grid balance */}
                {chunk.length < 3 && Array.from({ length: 3 - chunk.length }).map((_, emptyIdx) => (
                  <div key={emptyIdx} className="flex-1 bg-[#FAF7F2]/60 hidden md:block"></div>
                ))}
              </div>

              {/* Bottom Rule & Page Footer */}
              <div>
                <div className="border-b border-[#E3D8CC] w-full mb-3"></div>
                <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase">
                  <span>DIYA STORE • HANDMADE WITH LOVE</span>
                  <span className="font-mono font-semibold">{pad(currentPageNum)}</span>
                </div>
              </div>
            </section>
          );
        })}


        {/* =========================================================================
            FINAL PAGE: CONTACT, BULK ORDERS & CUSTOM GIFTING
        ========================================================================= */}
        <section className="catalogue-page bg-[#FAF7F2] text-[#3D332F] relative w-full md:w-[210mm] min-h-[297mm] h-[297mm] p-6 md:p-[20mm] flex flex-col justify-between shadow-2xl mx-auto border border-[#E8E0D5] box-border overflow-hidden">
          {/* Top Running Header */}
          <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase pb-2">
            <span>DIYA STORE • HANDMADE WITH LOVE</span>
            <span className="font-mono font-semibold">{pad(totalPages)}</span>
          </div>

          <div className="my-auto">
            <h2 className="font-merriweather font-bold text-2xl md:text-3xl text-[#8C432C] mb-4 text-center">
              Ordering & Custom Gifting
            </h2>
            <p className="text-center font-serif text-xs md:text-sm text-[#705B53] max-w-lg mx-auto mb-8">
              We deliver handcrafted diyas, bespoke festive hampers, and personalized wedding favors across India with secure packaging.
            </p>

            {/* Framed Container with 2 Sections */}
            <div className="border-[1.5px] border-[#8C432C]/70 bg-[#FDFCFA] p-6 md:p-8 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
              
              {/* Left Column: How to Order */}
              <div className="space-y-4">
                <div className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8C432C] border-b border-[#E8DEC9] pb-1.5">
                  HOW TO ORDER
                </div>

                <div className="space-y-2 text-xs text-[#4A3E39]">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#8C432C]">1.</span>
                    <span>Browse this catalogue and note your desired <strong>Product Codes</strong> and quantities.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#8C432C]">2.</span>
                    <span>Send us a message directly on WhatsApp with your selection and delivery address.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#8C432C]">3.</span>
                    <span>We pack your order in break-safe protective packaging and ship directly to your doorstep.</span>
                  </div>
                </div>

                {/* Direct Contacts */}
                <div className="pt-2 space-y-1.5 text-xs text-[#4A3E39]">
                  <div className="font-semibold text-stone-900">Contact & Support:</div>
                  <div>📞 Phone / WhatsApp: <span className="font-mono font-bold text-[#8C432C]">+91 7400422743 / +91 9322274986</span></div>
                  <div>📍 Address: <span className="text-stone-600">{settings.address || 'Shop No. 1, Girnar Dharshan, Narayan Nagar Road, Bhayandar West, Maharashtra – 401101'}</span></div>
                  <div>🌐 Website: <span className="text-[#8C432C] font-medium">diyastore.netlify.app</span></div>
                </div>
              </div>

              {/* Right Column: Bulk & Custom Hampers */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8C432C] border-b border-[#E8DEC9] pb-1.5">
                    BULK & CORPORATE GIFTING
                  </div>
                  <p className="text-xs text-[#4A3E39] leading-relaxed mt-2">
                    Looking for corporate Diwali gifts, wedding returns, or festive hampers? We offer custom branded boxes, artisan gift sets, and attractive wholesale discounts for bulk orders.
                  </p>

                  <div className="mt-4 p-3 bg-[#FAF2E8] border border-[#E8DEC9] rounded text-center">
                    <span className="text-xs font-bold text-[#8C432C] block mb-1">
                      Ready to Place an Order?
                    </span>
                    <a 
                      href={`https://wa.me/917400422743?text=${encodeURIComponent("Hello Diya Store! I am viewing your PDF Catalogue and would like to place an order.")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-1 px-4 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-full shadow hover:bg-[#20bd5a] transition-all"
                    >
                      Chat on WhatsApp Now
                    </a>
                  </div>
                </div>

                <blockquote className="italic text-xs text-[#5A4D46] border-l-2 border-[#8C432C] pl-3 py-1">
                  “May the divine light of deepam fill your home with peace, joy, and prosperity.”
                </blockquote>
              </div>

            </div>
          </div>

          {/* Bottom Rule & Page Footer */}
          <div>
            <div className="border-b border-[#E3D8CC] w-full mb-3"></div>
            <div className="flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.25em] font-serif text-[#705B53] uppercase">
              <span>DIYA STORE • HANDMADE WITH LOVE</span>
              <span className="font-mono font-semibold">{pad(totalPages)}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
