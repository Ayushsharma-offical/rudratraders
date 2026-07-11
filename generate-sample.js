import jsPDF from 'jspdf';
import { numToWords } from './src/utils/generateQuotation.js';
import fs from 'fs';
// Simple base64 SVG converter for node testing (no canvas dep needed)
const getStampBase64Node = () => {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <path id="topArc" d="M 20,100 A 80,80 0 0,1 180,100"/>
      <path id="botArc" d="M 30,115 A 75,75 0 0,0 170,115"/>
    </defs>
    <circle cx="100" cy="100" r="92" fill="none" stroke="#6b21a8" stroke-width="4"/>
    <circle cx="100" cy="100" r="84" fill="none" stroke="#6b21a8" stroke-width="1.5"/>
    <text x="18" y="108" fill="#6b21a8" font-size="16" font-family="serif">&#9733;</text>
    <text x="164" y="108" fill="#6b21a8" font-size="16" font-family="serif">&#9733;</text>
    <text fill="#6b21a8" font-size="15" font-family="Arial" font-weight="bold" letter-spacing="3">
      <textPath href="#topArc" startOffset="8%">RUDRA TRADERS</textPath>
    </text>
    <circle cx="100" cy="100" r="52" fill="none" stroke="#6b21a8" stroke-width="1.2"/>
    <text x="100" y="97" fill="#6b21a8" font-size="13" font-family="Arial" font-weight="bold" text-anchor="middle">New Delhi</text>
    <path d="M72,112 Q85,104 100,112 Q115,120 128,112" fill="none" stroke="#6b21a8" stroke-width="1.5" stroke-linecap="round"/>
    <text fill="#6b21a8" font-size="13" font-family="Arial" font-weight="bold" letter-spacing="2">
      <textPath href="#botArc" startOffset="12%">Uttam Nagar</textPath>
    </text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svgStr).toString('base64');
};

const runTest = async () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14; 

  const stampBase64 = getStampBase64Node();

  // Deep Navy Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 46, 'F');

  // Gold accent
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, 4, 46, 'F');

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

  const rX = pageW - M;
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 210);
  doc.text('255-A, Vipin Garden, Uttam Nagar', rX, 14, { align: 'right' });
  doc.text('New Delhi – 110059, India', rX, 20, { align: 'right' });
  doc.text('+91 7982813507 | +91 8130957597', rX, 26, { align: 'right' });
  doc.text('rudratraders.store@gmail.com', rX, 32, { align: 'right' });

  // Gold Band
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 46, pageW, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('QUOTATION', pageW / 2, 53, { align: 'center' });

  // Ref & Date
  let y = 63;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Ref. No.: QT-10024`, M, y);
  doc.text(`Date: 09 July 2026`, pageW - M, y, { align: 'right' });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(M, y + 3, pageW - M, y + 3);

  // Client Box
  y += 8;
  const clientBoxH = 38;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M, y, pageW - M * 2, clientBoxH, 2, 2, 'F');
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, pageW - M * 2, clientBoxH, 2, 2, 'S');

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(M, y, 32, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('BILL TO', M + 5, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Amit Kumar Roy', M + 4, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  doc.text('S/O: Rajender Roy', M + 4, y + 21);
  doc.text('Sector 62, Noida, Uttar Pradesh', M + 4, y + 27);
  doc.text('Mobile: +91 9876543210', M + 4, y + 33);

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
  doc.text('Spices Grinding and Packing Plant', midX + 4, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('PIN: 201301', midX + 4, y + 30);

  y += clientBoxH + 6;

  // Sub Line
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 80);
  doc.text('Sub: Quotation for machinery required for Spices Grinding and Packing Plant.', M, y);
  y += 7;

  // Table header & raw draw using lines (to avoid importing heavy autotable in standalone node script easily)
  // Let's mock a structured Table view inside A4 dimensions
  doc.setFillColor(15, 23, 42);
  doc.rect(M, y, pageW - M*2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text('S.No.', M + 2, y + 5.5);
  doc.text('Description of Goods', M + 15, y + 5.5);
  doc.text('Qty', M + 102, y + 5.5);
  doc.text('Unit Rate (INR)', M + 115, y + 5.5);
  doc.text('Amount (INR)', M + 150, y + 5.5);

  const testItems = [
    { desc: 'Spice Grinding Plant 10 HP', qty: 1, rate: 95000 },
    { desc: 'Mixture Machine 50 KG/HR', qty: 2, rate: 59000 }
  ];

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 40);

  let totalExGST = 0;
  testItems.forEach((item, idx) => {
    const rowAmt = item.rate * item.qty;
    totalExGST += rowAmt;
    
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 252);
    doc.rect(M, y, pageW - M*2, 8, 'F');
    doc.text(String(idx + 1), M + 4, y + 5.5);
    doc.text(item.desc, M + 15, y + 5.5);
    doc.text(String(item.qty), M + 104, y + 5.5);
    doc.text(fmt(item.rate), M + 133, y + 5.5, { align: 'right' });
    doc.text(fmt(rowAmt), M + 168, y + 5.5, { align: 'right' });
    y += 8;
  });

  // Borders for table
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.25);
  doc.line(M, y - 16, M, y);
  doc.line(M + 12, y - 16, M + 12, y);
  doc.line(M + 97, y - 16, M + 97, y);
  doc.line(M + 113, y - 16, M + 113, y);
  doc.line(M + 146, y - 16, M + 146, y);
  doc.line(pageW - M, y - 16, pageW - M, y);
  doc.line(M, y, pageW - M, y);

  y += 4;

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

  // Words
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

  // Bank box & Signatory
  const bankW = (pageW - M * 2) * 0.54;
  const sigW  = (pageW - M * 2) * 0.42;
  const sigX  = M + bankW + (pageW - M * 2) * 0.04;
  const sectionH = 44;

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

  // Signatory
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

  if (stampBase64) {
    doc.addImage(stampBase64, 'PNG', sigX + 2, y + 14, 32, 32);
  }

  doc.setDrawColor(80, 80, 90);
  doc.setLineWidth(0.5);
  doc.line(sigX + 4, y + sectionH - 6, sigX + sigW - 4, y + sectionH - 6);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 80);
  doc.text('(Authorised Signatory)', sigX + sigW / 2, y + sectionH - 2, { align: 'center' });

  y += sectionH + 7;

  // Terms
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

  // Footer bar
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

  const buffer = doc.output('arraybuffer');
  fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\549258d5-7a43-4f63-92b8-70f27f6b897e\\sample_quotation_preview.pdf', Buffer.from(buffer));
  console.log('Sample PDF successfully generated and saved as artifact.');
};

runTest();
