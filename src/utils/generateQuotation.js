import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Function to convert number to words (simple implementation for INR)
const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only' : '';
  return str;
};

export const generateQuotation = (clientDetails, items, refNo = "65") => {
  const doc = new jsPDF();
  
  // Document properties
  doc.setProperties({
    title: `Quotation_${clientDetails.name.replace(/\s+/g, '_')}`,
    subject: 'Machinery Quotation - Rudra Traders',
    author: 'Rudra Traders',
  });

  // Header / Logo Area
  // In a real app we'd load the base64 of the logo. For now, text placeholder mimicking the logo.
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Rudra Traders", 14, 25);
  
  // Company Details (Right aligned)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const startX = 130;
  doc.text("Address- 255 A, Vipin Garden", startX, 20);
  doc.text("Uttam Nagar, New Delhi-110059", startX, 25);
  doc.text("GST NO- 07BCFPK2624A1Z7", startX, 30);
  doc.text("Contact No-7982813507", startX, 35);
  doc.text("Email Id-rudratraders.store@gmail.com", startX, 40);

  doc.line(14, 45, 196, 45); // Horizontal line

  // Ref No & Date
  doc.setFontSize(10);
  doc.text(`Ref .No.-${refNo}`, 14, 52);
  const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
  doc.text(`Date:${today}`, 160, 52);

  // Client Details
  doc.text("Quotation to,", 14, 62);
  doc.text(`Mr. ${clientDetails.name}`, 14, 67);
  if(clientDetails.careOf) doc.text(`S/O- ${clientDetails.careOf}`, 14, 72);
  if(clientDetails.address) {
    const splitTitle = doc.splitTextToSize(clientDetails.address, 90);
    doc.text(splitTitle, 14, 77);
  }
  doc.text(`India - ${clientDetails.pincode || ""}`, 14, 87);
  doc.text(`Mob No-${clientDetails.phone}`, 14, 92);

  // Subject
  doc.setFont("helvetica", "italic");
  doc.text(`Sub:quotation for machinery required for ${clientDetails.projectType || 'processing Unit'}.`, 14, 105);
  doc.setFont("helvetica", "normal");

  // Table
  let totalAmount = 0;
  const tableData = items.map((item, index) => {
    const amount = parseFloat(item.rate) * parseInt(item.quantity);
    totalAmount += amount;
    return [
      index + 1,
      item.description,
      item.quantity,
      parseFloat(item.rate).toFixed(2),
      amount.toFixed(2)
    ];
  });

  doc.autoTable({
    startY: 115,
    head: [['S no.', 'Description', 'Unit', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 90 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    }
  });

  const finalY = doc.lastAutoTable.finalY;
  
  // Totals & GST
  doc.setFont("helvetica", "bold");
  doc.text("Total INR", 130, finalY + 7);
  doc.text(totalAmount.toFixed(2), 196, finalY + 7, { align: 'right' });
  
  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text(`Gst Included in total (18%) INR ${gstAmount.toFixed(2)}/-`, 196, finalY + 14, { align: 'right' });

  // Amount in words box
  doc.setDrawColor(0);
  doc.rect(14, finalY + 18, 182, 10);
  doc.setFont("helvetica", "normal");
  doc.text("Amount in word", 16, finalY + 24.5);
  doc.setFont("helvetica", "bold");
  doc.text(`${numberToWords(Math.round(grandTotal))} Rupees`, 194, finalY + 24.5, { align: 'right' });

  // Bank Details Box
  doc.rect(14, finalY + 28, 182, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Account Details :", 16, finalY + 34);
  doc.text("Account Name- Rudra Traders", 16, finalY + 42);
  doc.text("Account No-924020061654700", 16, finalY + 50);
  doc.text("Bank Name – Axis Bank", 16, finalY + 58);
  doc.text("Ifsc Code- UTIB0000644", 16, finalY + 66);

  // Terms and Signature
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("The above quoted prices include Gst.", 16, finalY + 80);
  doc.text("Transportation charge will be extra", 16, finalY + 87);
  doc.text("100% advance payment will be made before delivery.", 16, finalY + 94);

  // Authorized Signatory Stamp (Placeholder)
  doc.setDrawColor(0, 0, 200); // Blueish circle
  doc.circle(165, finalY + 85, 12, 'S');
  doc.setFontSize(8);
  doc.text("RUDRA TRADERS", 165, finalY + 78, { align: 'center' });
  doc.text("New Delhi", 165, finalY + 85, { align: 'center' });
  doc.text("Uttam Nagar", 165, finalY + 92, { align: 'center' });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Authorized signatory", 165, finalY + 105, { align: 'center' });

  // Save the PDF
  doc.save(`Quotation_${clientDetails.name.replace(/\s+/g, '_')}.pdf`);
};
