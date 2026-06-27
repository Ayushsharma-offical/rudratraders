import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { numToWords } from './generateQuotation'; // Note: numToWords needs to be exported from generateQuotation.js or duplicated here. I will just duplicate it for simplicity since it's not exported.

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(-num);

  let words = '';
  if (Math.floor(num / 10000000) > 0) {
    words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += numberToWords(Math.floor(num / 100)) + ' Hundred ';
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) words += ' ' + ones[num % 10];
    }
  }
  return words.trim();
};

export const generateAdvanceReceipt = (clientDetails, amountPaid, orderId) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ----- HEADER BAR -----
  doc.setFillColor(26, 54, 54); // brand green
  doc.rect(0, 0, pageW, 42, 'F');

  // Company Name (left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55); // gold
  doc.text('RUDRA TRADERS', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('MSME Machinery Specialists', margin, 23);
  doc.text('GST No: 07BCFPK2624A1Z7', margin, 29);

  // Company details (right)
  const rightX = pageW - margin;
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Address: 255 A, Vipin Garden, Uttam Nagar', rightX, 12, { align: 'right' });
  doc.text('New Delhi - 110059', rightX, 17, { align: 'right' });
  doc.text('Phone: +91 7982813507', rightX, 22, { align: 'right' });
  doc.text('Email: rudratraders.store@gmail.com', rightX, 27, { align: 'right' });

  // ----- RECEIPT TITLE -----
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 42, pageW, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(10, 15, 15);
  doc.text('ADVANCE PAYMENT RECEIPT', pageW / 2, 49, { align: 'center' });

  // ----- REF & DATE -----
  let y = 62;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Order ID: ${orderId}`, margin, y);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, rightX, y, { align: 'right' });

  // ----- CLIENT DETAILS -----
  y += 8;
  doc.setFillColor(245, 245, 240);
  doc.roundedRect(margin, y, pageW - margin * 2, 38, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 54, 54);
  doc.text('RECEIVED FROM:', margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`Mr. ${clientDetails.name}`, margin + 4, y + 16);
  if (clientDetails.careOf) doc.text(`S/O: ${clientDetails.careOf}`, margin + 4, y + 22);
  if (clientDetails.address) {
    const addr = doc.splitTextToSize(clientDetails.address, 100);
    doc.text(addr, margin + 4, clientDetails.careOf ? y + 28 : y + 22);
  }
  if (clientDetails.phone) doc.text(`Mob: ${clientDetails.phone}`, margin + 4, y + 34);
  
  y += 46;

  // ----- PAYMENT DETAILS -----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 54, 54);
  doc.text('Payment Summary', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Amount (INR)']],
    body: [
      [`Advance Payment Received for Order ${orderId}`, `Rs. ${amountPaid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [26, 54, 54],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  const afterTable = doc.lastAutoTable.finalY;
  y = afterTable + 10;

  // ----- AMOUNT IN WORDS -----
  doc.setFillColor(255, 250, 230);
  doc.roundedRect(margin, y, pageW - margin * 2, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 54, 54);
  doc.text('Amount in words:', margin + 4, y + 8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(40, 40, 40);
  const amtWords = `${numberToWords(Math.round(amountPaid))} Rupees Only`;
  doc.text(amtWords, margin + 42, y + 8);
  y += 24;

  // ----- MESSAGE / SIGNATURE -----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text('This is a computer-generated receipt for your advance payment.', margin, y);
  doc.text('We will begin processing your machinery order immediately.', margin, y + 6);
  
  const sigX = margin + (pageW - margin * 2) * 0.65;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 54, 54);
  doc.text('For Rudra Traders', sigX, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('(Authorised Signatory)', sigX, y + 26);
  doc.setDrawColor(100, 100, 100);
  doc.line(sigX, y + 24, sigX + 50, y + 24);

  // ----- FOOTER -----
  doc.setFillColor(26, 54, 54);
  doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageW, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text('Thank you for your business! | rudratraders.store@gmail.com | +91 7982813507', pageW / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });

  // Save
  const safeName = (clientDetails.name || 'Client').replace(/\s+/g, '_');
  doc.save(`Rudra_Traders_Advance_Receipt_${safeName}.pdf`);
};
