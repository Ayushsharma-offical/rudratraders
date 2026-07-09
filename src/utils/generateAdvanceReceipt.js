import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { numToWords } from './generateQuotation';

const fmt = (n) => {
  const r = Math.round(n).toString();
  const last3 = r.slice(-3);
  const rest = r.slice(0, -3);
  return rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
};

// ─── Load Stamp & Remove White Background ─────────────────────────────────────
const loadTransparentStamp = async () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          // Replace light pixels with transparent
          if (r > 230 && g > 230 && b > 230) {
            data[i+3] = 0;
          } else if (r > 200 && g > 200 && b > 200) {
            data[i+3] = 100; // semi-transparent for smoothing edges
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        // Fallback if canvas taint issues occur (shouldn't happen with local file)
        resolve(canvas.toDataURL('image/png'));
      }
    };
    img.onerror = () => resolve(null);
    img.src = '/stamp.png';
  });
};

// ─── MAIN ADVANCE RECEIPT GENERATOR ─────────────────────────────────────────
export const generateAdvanceReceipt = async (clientDetails, amountPaid, orderId, totalAmount = amountPaid) => {
  const stampBase64 = await loadTransparentStamp();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14;

  // ── DARK HEADER ──────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // deep navy
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
  doc.text('+91 7982813507', rX, 26, { align: 'right' });
  doc.text('rudratraders.store@gmail.com', rX, 32, { align: 'right' });

  // ── GOLD TITLE BAND ───────────────────────────────────────────────────────
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 46, pageW, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT RECEIPT', pageW / 2, 53, { align: 'center' });

  // ── REF & DATE ROW ───────────────────────────────────────────────────────
  let y = 63;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Order ID: ${orderId}`, M, y);
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

  // "RECEIVED FROM" label
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(M, y, 32, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('RECEIVED FROM', M + 3, y + 5);

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

  // Right half info
  const midX = pageW / 2 + 4;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(midX, y, 32, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('ORDER SUMMARY', midX + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  doc.text(`Order Reference: ${orderId.substring(0, 14)}...`, midX + 4, y + 15);
  if (clientDetails.pincode) doc.text(`PIN: ${clientDetails.pincode}`, midX + 4, y + 22);

  y += clientBoxH + 6;

  // ── PAYMENT SUMMARY TABLE ────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Payment Information', M, y);
  y += 5;

  const tableBody = [];
  if (totalAmount > amountPaid) {
    tableBody.push(['Total Order Value (incl. GST)', `Rs. ${fmt(totalAmount)}`]);
    tableBody.push([`Advance Payment Received (via UPI/Razorpay)`, `Rs. ${fmt(amountPaid)}`]);
    tableBody.push(['Pending Amount', `Rs. ${fmt(totalAmount - amountPaid)}`]);
  } else {
    tableBody.push([`Full Payment Received (Order Confirmation)`, `Rs. ${fmt(amountPaid)}`]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Transaction Details', 'Amount (INR)']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 40],
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 62, halign: 'right' },
    },
    margin: { left: M, right: M },
  });

  y = doc.lastAutoTable.finalY + 6;

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
  const words = `${numToWords(Math.round(amountPaid))} Rupees Only`;
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

  y += sectionH + 6;

  // ── SYSTEM NOTE ──────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 80);
  doc.text('Note: This is a system-generated transaction confirmation and serves as advance/full payment receipt.', M, y);
  y += 5;

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
  const filename = `Rudra_Traders_Receipt_${safeName}_${orderId}.pdf`;

  if (window.AndroidApp) {
    const base64 = doc.output('datauristring').split(',')[1];
    window.AndroidApp.showPdf(base64, filename);
  } else {
    doc.save(filename);
  }
};
