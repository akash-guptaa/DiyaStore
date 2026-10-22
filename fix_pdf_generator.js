const fs = require('fs');

let fileContent = fs.readFileSync('src/components/CatalogueViewer.tsx', 'utf8');

const targetStr = `      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

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
        setProgressMsg(\`Rendering page \${i + 1} of \${pageElements.length}...\`);
        const pageEl = pageElements[i];

        // Capture page as high-resolution canvas
        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x for sharp 300dpi-like clarity
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FAF7F2',
          logging: false,
          windowWidth: 1200,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }`;

const replacementStr = `      const { default: jsPDF } = await import('jspdf');
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
        setProgressMsg(\`Rendering page \${i + 1} of \${pageElements.length}...\`);
        const pageEl = pageElements[i];

        // Capture page as high-resolution JPEG via native browser foreignObject renderer
        // Bypasses html2canvas CSS parsing crashes on modern Tailwind v4 lab()/oklch() color formats
        const imgData = await toJpeg(pageEl, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#FAF7F2',
          cacheBust: false,
        });

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }`;

// Replace CRLF or LF safely
fileContent = fileContent.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');

if (fileContent.includes(normalizedTarget)) {
  fileContent = fileContent.replace(normalizedTarget, replacementStr);
  fs.writeFileSync('src/components/CatalogueViewer.tsx', fileContent);
  console.log('Successfully updated CatalogueViewer.tsx to use html-to-image!');
} else {
  console.error('Could not find target string in CatalogueViewer.tsx');
  process.exit(1);
}
