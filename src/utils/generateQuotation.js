import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Indian Number Format ───────────────────────────────────────────────────
const fmt = (n) => {
  const r = Math.round(n).toString();
  const last3 = r.slice(-3);
  const rest = r.slice(0, -3);
  return rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
};

// ─── Number to Words ────────────────────────────────────────────────────────
export const numToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  let w = '';
  if (Math.floor(num / 10000000) > 0) { w += numToWords(Math.floor(num / 10000000)) + ' Crore '; num %= 10000000; }
  if (Math.floor(num / 100000) > 0)   { w += numToWords(Math.floor(num / 100000)) + ' Lakh '; num %= 100000; }
  if (Math.floor(num / 1000) > 0)     { w += numToWords(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
  if (Math.floor(num / 100) > 0)      { w += numToWords(Math.floor(num / 100)) + ' Hundred '; num %= 100; }
  if (num > 0) { w += num < 20 ? ones[num] : tens[Math.floor(num / 10)] + (num % 10 > 0 ? ' ' + ones[num % 10] : ''); }
  return w.trim();
};

// ─── Stamp SVG → base64 PNG via canvas ─────────────────────────────────────
const getStampBase64 = () => new Promise((resolve) => {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <path id="topArc" d="M 20,100 A 80,80 0 0,1 180,100"/>
      <path id="botArc" d="M 30,115 A 75,75 0 0,0 170,115"/>
    </defs>
    <!-- outer ring -->
    <circle cx="100" cy="100" r="92" fill="none" stroke="#6b21a8" stroke-width="4"/>
    <circle cx="100" cy="100" r="84" fill="none" stroke="#6b21a8" stroke-width="1.5"/>
    <!-- stars -->
    <text x="18" y="108" fill="#6b21a8" font-size="16" font-family="serif">&#9733;</text>
    <text x="164" y="108" fill="#6b21a8" font-size="16" font-family="serif">&#9733;</text>
    <!-- top arc text -->
    <text fill="#6b21a8" font-size="15" font-family="Arial" font-weight="bold" letter-spacing="3">
      <textPath href="#topArc" startOffset="8%">RUDRA TRADERS</textPath>
    </text>
    <!-- inner circle -->
    <circle cx="100" cy="100" r="52" fill="none" stroke="#6b21a8" stroke-width="1.2"/>
    <!-- New Delhi -->
    <text x="100" y="97" fill="#6b21a8" font-size="13" font-family="Arial" font-weight="bold" text-anchor="middle">New Delhi</text>
    <!-- signature scribble -->
    <path d="M72,112 Q85,104 100,112 Q115,120 128,112" fill="none" stroke="#6b21a8" stroke-width="1.5" stroke-linecap="round"/>
    <!-- bottom arc text -->
    <text fill="#6b21a8" font-size="13" font-family="Arial" font-weight="bold" letter-spacing="2">
      <textPath href="#botArc" startOffset="12%">Uttam Nagar</textPath>
    </text>
  </svg>`;

  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    resolve(canvas.toDataURL('image/png'));
  };
  img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
  img.src = url;
});

// ─── MAIN FUNCTION ──────────────────────────────────────────────────────────
export const generateQuotation = async (clientDetails, items, refNo) => {
  const stampBase64 = await getStampBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14; // margin

  // ── DARK HEADER ──────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);        // deep navy
  doc.rect(0, 0, pageW, 46, 'F');

  // Gold left accent bar
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, 4, 46, 'F');

  // Company name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(212, 175, 55);
  doc.text('RUDRA TRADERS', M + 4, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 190);
  doc.text('MSME Machinery Specialists — Est. 2020', M + 4, 22);
  doc.text('GST No: 07BCFPK2624A1Z7', M + 4, 28);
  doc.text('Website: rudratrades.in', M + 4, 34);

  // Right block
  const rX = pageW - M;
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 210);
  doc.text('255-A, Vipin Garden, Uttam Nagar', rX, 14, { align: 'right' });
  doc.text('New Delhi – 110059, India', rX, 20, { align: 'right' });
  doc.text('+91 7982813507 | +91 8130957597', rX, 26, { align: 'right' });
  doc.text('rudratraders.store@gmail.com', rX, 32, { align: 'right' });

  // ── GOLD TITLE BAND ───────────────────────────────────────────────────────
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 46, pageW, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('QUOTATION', pageW / 2, 53, { align: 'center' });

  // ── REF & DATE ROW ───────────────────────────────────────────────────────
  let y = 63;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Ref. No.: QT-${refNo}`, M, y);
  doc.text(`Date: ${dateStr}`, pageW - M, y, { align: 'right' });

  // thin divider
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(M, y + 3, pageW - M, y + 3);

  // ── CLIENT BOX ───────────────────────────────────────────────────────────
  y += 8;
  const clientBoxH = 38;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M, y, pageW - M * 2, clientBoxH, 2, 2, 'F');
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, pageW - M * 2, clientBoxH, 2, 2, 'S');

  // "BILL TO" label
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(M, y, 32, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('BILL TO', M + 5, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${clientDetails.name || ''}`, M + 4, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  let clientY = y + 21;
  if (clientDetails.careOf)  { doc.text(`S/O: ${clientDetails.careOf}`, M + 4, clientY); clientY += 6; }
  if (clientDetails.address) {
    const addrLines = doc.splitTextToSize(clientDetails.address, 100);
    doc.text(addrLines, M + 4, clientY);
    clientY += addrLines.length * 5;
  }
  if (clientDetails.phone)   doc.text(`Mobile: ${clientDetails.phone}`, M + 4, clientY);

  // Right half: project
  const midX = pageW / 2 + 4;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(midX, y, 32, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('PROJECT', midX + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  const projLines = doc.splitTextToSize(clientDetails.projectType || 'Machinery Processing Unit', 72);
  doc.text(projLines, midX + 4, y + 15);

  if (clientDetails.pincode) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`PIN: ${clientDetails.pincode}`, midX + 4, y + 30);
  }

  y += clientBoxH + 6;

  // ── SUBJECT LINE ─────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 80);
  doc.text(
    `Sub: Quotation for machinery required for ${clientDetails.projectType || 'processing unit'}.`,
    M, y
  );
  y += 7;

  // ── ITEMS TABLE ───────────────────────────────────────────────────────────
  let totalExGST = 0;
  const tableRows = items.map((item, i) => {
    const amt = parseFloat(item.rate) * parseInt(item.quantity || 1);
    totalExGST += amt;
    return [
      i + 1,
      item.description,
      item.quantity || 1,
      `Rs. ${fmt(parseFloat(item.rate))}`,
      `Rs. ${fmt(amt)}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['S.No.', 'Description of Goods', 'Qty', 'Unit Rate (INR)', 'Amount (INR)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 40],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 85 },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 33, halign: 'right' },
      4: { cellWidth: 34, halign: 'right' },
    },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    styles: { lineColor: [210, 215, 225], lineWidth: 0.25 },
    margin: { left: M, right: M },
  });

  y = doc.lastAutoTable.finalY + 4;

  // ── TOTALS ────────────────────────────────────────────────────────────────
  const gst = totalExGST * 0.18;
  const grand = totalExGST + gst;
  const totW = 80, totX = pageW - M - totW;

  const drawTotRow = (label, value, bg, textClr, bold) => {
    doc.setFillColor(...bg);
    doc.rect(totX, y, totW, 8, 'F');
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...textClr);
    doc.text(label, totX + 3, y + 5.5);
    doc.text(`Rs. ${fmt(value)}`, pageW - M - 2, y + 5.5, { align: 'right' });
    y += 8;
  };

  drawTotRow('Sub Total (Ex. GST)', totalExGST, [242, 244, 248], [40, 40, 50], false);
  drawTotRow('GST @ 18%', gst, [235, 237, 245], [40, 40, 50], false);
  drawTotRow('GRAND TOTAL (INR)', grand, [15, 23, 42], [212, 175, 55], true);
  y += 4;

  // ── AMOUNT IN WORDS ───────────────────────────────────────────────────────
  doc.setFillColor(255, 252, 235);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, pageW - M * 2, 11, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Amount in Words:', M + 3, y + 7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(50, 50, 60);
  const words = `${numToWords(Math.round(grand))} Rupees Only`;
  doc.text(words, M + 43, y + 7.5);
  y += 17;

  // ── BANK DETAILS + SIGNATORY ───────────────────────────────────────────────
  const bankW = (pageW - M * 2) * 0.54;
  const sigW  = (pageW - M * 2) * 0.42;
  const sigX  = M + bankW + (pageW - M * 2) * 0.04;
  const sectionH = 44;

  // Bank box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.25);
  doc.roundedRect(M, y, bankW, sectionH, 2, 2, 'FD');

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(M, y, 38, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('BANK DETAILS', M + 4, y + 5);

  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 50);
  const bx = M + 4;
  const vx = M + 40;
  const bankItems = [
    ['Account Name', 'Rudra Traders'],
    ['Account No.',  '924020061654700'],
    ['Bank Name',    'Axis Bank'],
    ['IFSC Code',    'UTIB0000644'],
    ['Branch',       'Uttam Nagar, New Delhi'],
  ];
  bankItems.forEach(([label, val], i) => {
    const by = y + 13 + i * 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 90);
    doc.text(`${label}:`, bx, by);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val, vx, by);
  });

  // Signatory box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(200, 205, 215);
  doc.roundedRect(sigX, y, sigW, sectionH, 2, 2, 'FD');

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(sigX, y, 42, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('AUTHORISED SIGNATORY', sigX + 3, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('For Rudra Traders', sigX + 4, y + 14);

  // Stamp (SVG rendered)
  if (stampBase64) {
    doc.addImage(stampBase64, 'PNG', sigX + 2, y + 14, 32, 32);
  }

  // Signature line
  doc.setDrawColor(80, 80, 90);
  doc.setLineWidth(0.5);
  doc.line(sigX + 4, y + sectionH - 6, sigX + sigW - 4, y + sectionH - 6);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 80);
  doc.text('(Authorised Signatory)', sigX + sigW / 2, y + sectionH - 2, { align: 'center' });

  y += sectionH + 7;

  // ── TERMS ─────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Terms & Conditions:', M, y);
  y += 5;

  const terms = [
    '1. Prices quoted are subject to GST @ 18% as applicable.',
    '2. Transportation & installation charges will be extra as per actuals.',
    '3. 100% advance payment required before dispatch of goods.',
    '4. Delivery: 7–15 working days after receipt of payment.',
    '5. Warranty as per manufacturer terms. No warranty on electrical parts.',
    '6. This quotation is valid for 30 days from the date of issue.',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 65, 75);
  terms.forEach(t => {
    doc.text(t, M, y);
    y += 5.2;
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageH - 13, pageW, 13, 'F');

  doc.setFillColor(212, 175, 55);
  doc.rect(0, pageH - 13, pageW, 1.5, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 195);
  doc.text(
    'Thank you for your business!  |  rudratrades.in  |  rudratraders.store@gmail.com  |  +91 7982813507',
    pageW / 2, pageH - 5.5, { align: 'center' }
  );

  // ── SAVE / SHOW ────────────────────────────────────────────────────────────
  const safeName = (clientDetails.name || 'Client').replace(/\s+/g, '_');
  const filename = `Rudra_Traders_Quotation_${safeName}_${refNo}.pdf`;

  if (window.AndroidApp) {
    const base64 = doc.output('datauristring').split(',')[1];
    window.AndroidApp.showPdf(base64, filename);
  } else {
    doc.save(filename);
  }
};
