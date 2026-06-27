import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (amount) => {
  const rounded = Math.round(amount);
  const x = rounded.toString();
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  return lastThree;
};

export const numToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numToWords(-num);

  let words = '';
  if (Math.floor(num / 10000000) > 0) {
    words += numToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += numToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += numToWords(Math.floor(num / 100)) + ' Hundred ';
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

export const generateQuotation = (clientDetails, items, refNo) => {
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

  // ----- QUOTATION TITLE -----
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 42, pageW, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(10, 15, 15);
  doc.text('QUOTATION', pageW / 2, 49, { align: 'center' });

  // ----- REF & DATE -----
  let y = 62;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Ref. No.: ${refNo}`, margin, y);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, rightX, y, { align: 'right' });

  // ----- CLIENT DETAILS -----
  y += 8;
  doc.setFillColor(245, 245, 240);
  doc.roundedRect(margin, y, pageW - margin * 2, 38, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 54, 54);
  doc.text('QUOTATION TO:', margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`Mr. ${clientDetails.name}`, margin + 4, y + 16);
  if (clientDetails.careOf) doc.text(`S/O: ${clientDetails.careOf}`, margin + 4, y + 22);
  if (clientDetails.address) {
    const addr = doc.splitTextToSize(clientDetails.address, 100);
    doc.text(addr, margin + 4, clientDetails.careOf ? y + 28 : y + 22);
  }
  if (clientDetails.phone) doc.text(`Mob: ${clientDetails.phone}`, margin + 4, y + 34);
  if (clientDetails.pincode) doc.text(`PIN: ${clientDetails.pincode}`, margin + 80, y + 34);

  // Right side of client box
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 54, 54);
  doc.text('Project:', pageW / 2 + 10, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const projTitle = doc.splitTextToSize(clientDetails.projectType || 'Machinery Unit', 75);
  doc.text(projTitle, pageW / 2 + 10, y + 14);

  y += 46;

  // ----- SUBJECT LINE -----
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Sub: Quotation for machinery required for ${clientDetails.projectType || 'processing unit'}.`, margin, y);
  y += 8;

  // ----- ITEMS TABLE -----
  let totalExGST = 0;
  const tableData = items.map((item, i) => {
    const amount = parseFloat(item.rate) * parseInt(item.quantity || 1);
    totalExGST += amount;
    return [
      i + 1,
      item.description,
      item.quantity || 1,
      `Rs. ${formatCurrency(parseFloat(item.rate))}`,
      `Rs. ${formatCurrency(amount)}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['S.No.', 'Description', 'Unit', 'Rate (INR)', 'Amount (INR)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 54, 54],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 85 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: { fillColor: [248, 248, 245] },
    styles: { lineColor: [200, 200, 200], lineWidth: 0.3 },
  });

  const afterTable = doc.lastAutoTable.finalY;
  y = afterTable + 4;

  // ----- TOTALS -----
  const gst = totalExGST * 0.18;
  const grandTotal = totalExGST + gst;

  doc.setFillColor(245, 245, 240);
  doc.rect(pageW - margin - 75, y, 75, 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text('Sub Total:', pageW - margin - 73, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${formatCurrency(totalExGST)}`, pageW - margin - 2, y + 5.5, { align: 'right' });
  y += 8;

  doc.setFillColor(238, 238, 232);
  doc.rect(pageW - margin - 75, y, 75, 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.text('GST @18%:', pageW - margin - 73, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${formatCurrency(gst)}`, pageW - margin - 2, y + 5.5, { align: 'right' });
  y += 8;

  doc.setFillColor(26, 54, 54);
  doc.rect(pageW - margin - 75, y, 75, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text('TOTAL INR:', pageW - margin - 73, y + 7);
  doc.text(`Rs. ${formatCurrency(grandTotal)}`, pageW - margin - 2, y + 7, { align: 'right' });
  y += 16;

  // ----- AMOUNT IN WORDS -----
  doc.setFillColor(255, 250, 230);
  doc.roundedRect(margin, y, pageW - margin * 2, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(26, 54, 54);
  doc.text('Amount in words:', margin + 4, y + 8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(40, 40, 40);
  const amtWords = `${numToWords(Math.round(grandTotal))} Rupees Only`;
  doc.text(amtWords, margin + 42, y + 8);
  y += 18;

  // ----- BANK DETAILS -----
  doc.setFillColor(245, 245, 240);
  doc.roundedRect(margin, y, (pageW - margin * 2) * 0.55, 42, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 54, 54);
  doc.text('Bank Details:', margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const bankY = y + 15;
  doc.text('Account Name:', margin + 4, bankY);
  doc.setFont('helvetica', 'bold');
  doc.text('Rudra Traders', margin + 38, bankY);
  doc.setFont('helvetica', 'normal');
  doc.text('Account No:', margin + 4, bankY + 7);
  doc.setFont('helvetica', 'bold');
  doc.text('924020061654700', margin + 38, bankY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text('Bank:', margin + 4, bankY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Axis Bank', margin + 38, bankY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('IFSC Code:', margin + 4, bankY + 21);
  doc.setFont('helvetica', 'bold');
  doc.text('UTIB0000644', margin + 38, bankY + 21);

  // ----- SIGNATORY (right of bank) -----
  const sigX = margin + (pageW - margin * 2) * 0.58;
  doc.setDrawColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 54, 54);
  doc.text('For Rudra Traders', sigX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('(Authorised Signatory)', sigX, y + 38);
  doc.line(sigX, y + 36, sigX + 60, y + 36);

  y += 48;

  // ----- TERMS -----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const terms = [
    '• The above quoted prices are inclusive of GST (18%).',
    '• Transportation charges will be extra as per actuals.',
    '• 100% advance payment before dispatch.',
    '• Delivery within 7–15 working days after payment confirmation.',
    '• This quotation is valid for 30 days from the date of issue.',
  ];
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 54, 54);
  doc.text('Terms & Conditions:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  terms.forEach(t => {
    doc.text(t, margin, y);
    y += 5.5;
  });

  // ----- FOOTER -----
  doc.setFillColor(26, 54, 54);
  doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageW, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text('Thank you for your business! | rudratraders.store@gmail.com | +91 7982813507', pageW / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });

  // Save
  const safeName = (clientDetails.name || 'Client').replace(/\s+/g, '_');
  doc.save(`Rudra_Traders_Quotation_${safeName}_${refNo}.pdf`);
};
