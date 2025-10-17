type QuotationItem = {
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
};
type QuotationData = {
  quotationNo: string;
  date: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  projectDescription: string;
  items: QuotationItem[];
  logoUrl: string;
  paymentTerms: string;
};
export class QuotationGenerator {
  private static instance: QuotationGenerator;
  private baseUrl: string = 'https://yourdomain.com'; // Replace with actual domain when deployed
  private logoUrl: string = 'https://toiral-development.web.app/toiral-logo.png';
  private quotationCounter: number = 1;
  private constructor() {
    // Load counter from localStorage if available
    const savedCounter = localStorage.getItem('quotationCounter');
    if (savedCounter) {
      this.quotationCounter = parseInt(savedCounter, 10);
    }
  }
  public static getInstance(): QuotationGenerator {
    if (!QuotationGenerator.instance) {
      QuotationGenerator.instance = new QuotationGenerator();
    }
    return QuotationGenerator.instance;
  }
  public generateQuotationNumber(): string {
    const paddedCounter = String(this.quotationCounter).padStart(3, '0');
    this.quotationCounter++;
    localStorage.setItem('quotationCounter', this.quotationCounter.toString());
    return `TWD-QT-${paddedCounter}`;
  }
  public getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  public getDefaultItems(): QuotationItem[] {
    return [{
      title: 'UI/UX Design',
      description: 'Website interface and layout design',
      quantity: 1,
      unitPrice: 250
    }, {
      title: 'Frontend Development',
      description: 'Interactive and responsive front-end coding',
      quantity: 1,
      unitPrice: 350
    }, {
      title: 'Backend Development',
      description: 'Server-side logic and database integration',
      quantity: 1,
      unitPrice: 300
    }, {
      title: 'Deployment & Optimization',
      description: 'Website deployment and performance optimization',
      quantity: 1,
      unitPrice: 100
    }];
  }
  public prepareQuotationData(clientData: {
    clientName: string;
    clientCompany?: string;
    clientEmail?: string;
    clientPhone?: string;
    projectTitle: string;
    projectDescription: string;
  }, customItems?: QuotationItem[]): QuotationData {
    return {
      quotationNo: this.generateQuotationNumber(),
      date: this.getCurrentDate(),
      clientName: clientData.clientName,
      clientCompany: clientData.clientCompany || 'Individual Client',
      clientEmail: clientData.clientEmail || 'Not provided',
      clientPhone: clientData.clientPhone || 'Not provided',
      projectTitle: clientData.projectTitle,
      projectDescription: clientData.projectDescription,
      items: customItems || this.getDefaultItems(),
      logoUrl: this.logoUrl,
      paymentTerms: 'Payments are divided into three parts: 60% at initiation, 20% after main development, 20% after deployment.'
    };
  }
  public calculateTotal(items: QuotationItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }
  public async generatePDF(quotationData: QuotationData): Promise<{
    success: boolean;
    quotationNo: string;
    total: number;
    pdfUrl?: string;
    summary?: string;
    message?: string;
  }> {
    try {
      // In a real implementation, this would be an actual API call
      // For now, we'll simulate a successful response
      // Uncomment the following code when the endpoint is ready
      /*
      const response = await fetch(`${this.baseUrl}/generate-quotation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationData),
      });
      if (!response.ok) {
        // Retry once after 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retryResponse = await fetch(`${this.baseUrl}/generate-quotation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quotationData),
        });
        if (!retryResponse.ok) {
          return {
            success: false,
            quotationNo: quotationData.quotationNo,
            total: this.calculateTotal(quotationData.items),
            message: "Failed to generate quotation PDF. Please verify server or data format."
          };
        }
        const data = await retryResponse.json();
        return data;
      }
      const data = await response.json();
      return data;
      */
      // Simulated successful response
      const total = this.calculateTotal(quotationData.items);
      return {
        success: true,
        quotationNo: quotationData.quotationNo,
        total,
        pdfUrl: `${this.baseUrl}/generated/${quotationData.quotationNo}.pdf`,
        summary: `Quotation for ${quotationData.clientCompany} created successfully. Total: $${total}. PDF ready for download.`
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        quotationNo: quotationData.quotationNo,
        total: this.calculateTotal(quotationData.items),
        message: 'Failed to generate quotation PDF. Please verify server or data format.'
      };
    }
  }
}
export default QuotationGenerator.getInstance();