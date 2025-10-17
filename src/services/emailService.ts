import emailjs from 'emailjs-com';

// EmailJS configuration
// You'll need to create an account at https://www.emailjs.com/
// and get your SERVICE_ID, TEMPLATE_ID, and USER_ID
const EMAILJS_SERVICE_ID = 'service_toiral'; // Replace with your service ID
const EMAILJS_USER_ID = 'your_public_key'; // Replace with your public key

interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
}

export const sendEmail = async (templateId: string, data: EmailData): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      data,
      EMAILJS_USER_ID
    );
    
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Specific email templates
export const sendQuotationCreatedEmail = async (
  clientEmail: string,
  clientName: string,
  quotationName: string,
  totalPrice: number
) => {
  const templateId = 'template_quotation_created';
  
  return await sendEmail(templateId, {
    to_email: clientEmail,
    to_name: clientName,
    subject: 'Your Quotation is Ready',
    message: `Dear ${clientName},\n\nYour quotation "${quotationName}" has been created successfully.\n\nTotal Amount: $${totalPrice}\n\nThank you for choosing Toiral!\n\nBest regards,\nToiral Team`,
    from_name: 'Toiral Web Development'
  });
};

export const sendQuotationApprovedEmail = async (
  clientEmail: string,
  clientName: string,
  quotationName: string
) => {
  const templateId = 'template_quotation_approved';
  
  return await sendEmail(templateId, {
    to_email: clientEmail,
    to_name: clientName,
    subject: 'Quotation Approved',
    message: `Dear ${clientName},\n\nYour quotation "${quotationName}" has been approved!\n\nWe will begin working on your project soon.\n\nBest regards,\nToiral Team`,
    from_name: 'Toiral Web Development'
  });
};

export const sendPaymentReminderEmail = async (
  clientEmail: string,
  clientName: string,
  projectName: string,
  amount: number,
  dueDate: string
) => {
  const templateId = 'template_payment_reminder';
  
  return await sendEmail(templateId, {
    to_email: clientEmail,
    to_name: clientName,
    subject: 'Payment Reminder',
    message: `Dear ${clientName},\n\nThis is a reminder that payment for "${projectName}" is due on ${dueDate}.\n\nAmount: $${amount}\n\nThank you!\n\nBest regards,\nToiral Team`,
    from_name: 'Toiral Web Development'
  });
};

export const sendProjectMilestoneEmail = async (
  clientEmail: string,
  clientName: string,
  projectName: string,
  milestone: string
) => {
  const templateId = 'template_milestone_update';
  
  return await sendEmail(templateId, {
    to_email: clientEmail,
    to_name: clientName,
    subject: 'Project Milestone Update',
    message: `Dear ${clientName},\n\nGreat news! We've reached a new milestone in your project "${projectName}".\n\nMilestone: ${milestone}\n\nBest regards,\nToiral Team`,
    from_name: 'Toiral Web Development'
  });
};

// Admin notification
export const sendAdminNotification = async (
  subject: string,
  message: string
) => {
  const templateId = 'template_admin_notification';
  const adminEmail = 'admin@toiral.com'; // Replace with actual admin email
  
  return await sendEmail(templateId, {
    to_email: adminEmail,
    to_name: 'Admin',
    subject,
    message,
    from_name: 'Toiral System'
  });
};
