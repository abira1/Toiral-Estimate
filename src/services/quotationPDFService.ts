import jsPDF from 'jspdf';
import { UserPackageAssignment } from '../types/packages';

export const generateQuotationPDF = (assignment: UserPackageAssignment): void => {
  const doc = new jsPDF();
  
  // Page margins and settings
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = margin;

  // Helper function to add text with line break support
  const addText = (text: string, x: number, y: number, maxWidth?: number, size?: number) => {
    if (size) doc.setFontSize(size);
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (size || 10) * 0.35; // Return height used
    } else {
      doc.text(text, x, y);
      return (size || 10) * 0.35;
    }
  };

  // Header - Company Logo/Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // Primary blue
  doc.text('TOIRAL ESTIMATE', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Professional Quotation & Project Management', margin, yPosition);
  yPosition += 15;

  // Quotation Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PROJECT QUOTATION', margin, yPosition);
  yPosition += 3;
  
  // Line under title
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Quotation Info Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const infoBoxY = yPosition;
  doc.text(`Quotation ID: ${assignment.id.slice(-8).toUpperCase()}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date(assignment.createdAt).toLocaleDateString()}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Valid Until: ${new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}`, margin, yPosition);
  
  // Client Info (right side)
  yPosition = infoBoxY;
  const rightColumnX = pageWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information:', rightColumnX, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(assignment.userName, rightColumnX, yPosition);
  yPosition += 5;
  doc.text(assignment.userEmail, rightColumnX, yPosition);
  yPosition += 15;

  // Package Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Package Details', margin, yPosition);
  yPosition += 8;

  // Package Name and Category
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`${assignment.packageCategory} - ${assignment.packageName}`, margin, yPosition);
  yPosition += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const descHeight = addText(assignment.packageDescription, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += descHeight + 8;

  // Price Table
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Item', margin + 5, yPosition + 5);
  doc.text('Price', pageWidth - margin - 30, yPosition + 5);
  yPosition += 10;

  // Base Package
  doc.setFont('helvetica', 'normal');
  doc.text(`${assignment.packageName} Package`, margin + 5, yPosition);
  doc.text(`$${assignment.basePrice.toFixed(2)}`, pageWidth - margin - 30, yPosition);
  yPosition += 7;

  // Add-ons
  if (assignment.selectedAddOns && assignment.selectedAddOns.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Add-ons:', margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    assignment.selectedAddOns.forEach(addOn => {
      doc.text(`  • ${addOn.name}`, margin + 5, yPosition);
      doc.text(`$${addOn.price.toFixed(2)}`, pageWidth - margin - 30, yPosition);
      yPosition += 5;
    });
    yPosition += 2;
  }

  // Total line
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Total Amount:', margin + 5, yPosition);
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text(`$${assignment.totalPrice.toFixed(2)}`, pageWidth - margin - 35, yPosition);
  yPosition += 12;

  // Payment Schedule
  if (assignment.paymentMilestones && assignment.paymentMilestones.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Payment Schedule', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    assignment.paymentMilestones.forEach((milestone, index) => {
      const status = milestone.status === 'paid' ? '✓ PAID' : 'PENDING';
      const statusColor = milestone.status === 'paid' ? [34, 197, 94] : [249, 115, 22];
      
      doc.text(`${milestone.name}`, margin + 5, yPosition);
      doc.text(`$${milestone.amount.toFixed(2)}`, pageWidth / 2, yPosition);
      doc.text(`Due: ${new Date(milestone.dueDate).toLocaleDateString()}`, pageWidth / 2 + 40, yPosition);
      
      doc.setTextColor(...statusColor);
      doc.text(status, pageWidth - margin - 25, yPosition);
      doc.setTextColor(60, 60, 60);
      
      yPosition += 6;
    });
    yPosition += 8;
  }

  // Payment Summary
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  yPosition += 6;

  doc.setFont('helvetica', 'normal');
  doc.text('Total Amount:', margin + 5, yPosition);
  doc.text(`$${assignment.totalPrice.toFixed(2)}`, pageWidth - margin - 35, yPosition);
  yPosition += 5;

  doc.text('Amount Paid:', margin + 5, yPosition);
  doc.setTextColor(34, 197, 94);
  doc.text(`$${assignment.totalPaid.toFixed(2)}`, pageWidth - margin - 35, yPosition);
  doc.setTextColor(60, 60, 60);
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Remaining Balance:', margin + 5, yPosition);
  doc.setTextColor(249, 115, 22);
  doc.text(`$${assignment.remainingBalance.toFixed(2)}`, pageWidth - margin - 35, yPosition);
  yPosition += 12;

  // Project Timeline
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Project Timeline', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  if (assignment.startDate) {
    doc.text(`Start Date: ${new Date(assignment.startDate).toLocaleDateString()}`, margin + 5, yPosition);
    yPosition += 5;
  }
  
  if (assignment.expectedCompletionDate) {
    doc.text(`Expected Completion: ${new Date(assignment.expectedCompletionDate).toLocaleDateString()}`, margin + 5, yPosition);
    yPosition += 5;
  }

  doc.text(`Current Progress: ${assignment.progress}%`, margin + 5, yPosition);
  yPosition += 10;

  // Project Milestones
  if (assignment.projectMilestones && assignment.projectMilestones.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Project Milestones:', margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');

    assignment.projectMilestones.forEach((milestone, index) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      const statusIcon = milestone.status === 'completed' ? '✓' : 
                        milestone.status === 'in_progress' ? '▶' : '○';
      const statusColor = milestone.status === 'completed' ? [34, 197, 94] :
                         milestone.status === 'in_progress' ? [59, 130, 246] : [156, 163, 175];
      
      doc.setTextColor(...statusColor);
      doc.text(statusIcon, margin + 5, yPosition);
      doc.setTextColor(60, 60, 60);
      doc.text(`${milestone.name}`, margin + 12, yPosition);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Due: ${new Date(milestone.dueDate).toLocaleDateString()}`, pageWidth - margin - 40, yPosition);
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      yPosition += 5;
    });
    yPosition += 8;
  }

  // Terms and Conditions
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Terms & Conditions', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  const terms = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. Payment must be made according to the payment schedule outlined above.',
    '3. Project will commence upon receipt of the first payment milestone.',
    '4. Changes to project scope may result in additional charges.',
    '5. Final delivery is subject to completion of all payment milestones.',
    '6. Support and maintenance terms as specified in the package description.'
  ];

  terms.forEach(term => {
    const height = addText(term, margin + 5, yPosition, pageWidth - 2 * margin - 10, 9);
    yPosition += height + 3;
  });

  yPosition += 10;

  // Footer
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Thank you for choosing Toiral Estimate!', margin, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('For questions, contact us at: support@toiral.com | +1 (555) 123-4567', margin, yPosition);
  yPosition += 4;
  doc.text('Visit us: www.toiral.com', margin, yPosition);

  // Save the PDF
  const fileName = `Quotation_${assignment.packageName.replace(/\s+/g, '_')}_${assignment.id.slice(-6)}.pdf`;
  doc.save(fileName);
};
