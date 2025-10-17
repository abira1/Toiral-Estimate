import React, { useState } from 'react';
export function InvoiceTemplate() {
  const [isPaid, setIsPaid] = useState(false);
  const togglePaid = () => {
    setIsPaid(!isPaid);
  };
  const handlePrint = () => {
    window.print();
  };
  return <div className="min-h-screen bg-[rgb(249,250,251)] py-12 px-4">
      {/* Control Buttons */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-4">
        <button onClick={togglePaid} className="bg-[rgb(20,184,166)] hover:bg-[rgb(15,118,110)] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
          <span>{isPaid ? '✓ Marked as PAID' : 'Mark as PAID'}</span>
        </button>
        <button onClick={handlePrint} className="bg-[rgb(75,85,99)] hover:bg-[rgb(55,65,81)] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
          Print Invoice
        </button>
      </div>
      {/* Invoice Container */}
      <div className="max-w-5xl mx-auto relative bg-white rounded-lg shadow-md">
        {/* PAID Stamp - 400px x 400px */}
        {isPaid && <div className="absolute top-32 right-12 z-10 opacity-60 paid-stamp fade-in">
            <img src="https://customer-assets.emergentagent.com/job_clean-sprint/artifacts/okcmxxky_%E2%80%94Pngtree%E2%80%94paid%20stamp%20vector%20illustration_21097332.png" alt="PAID stamp" className="rotate-12 transition-all duration-300 hover:rotate-[15deg] hover:scale-105" style={{
          width: '400px',
          height: '400px'
        }} />
          </div>}
        {/* Header Section */}
        <div className="mb-8 p-6">
          <div className="flex justify-between items-start">
            {/* Left: Logo and Contact */}
            <div>
              <img src="https://customer-assets.emergentagent.com/job_clean-sprint/artifacts/b3c5hyqz_toiral-logo.png" alt="toiral logo" className="h-12 mb-2" />
              <p className="text-lg font-semibold text-[rgb(20,184,166)] italic mb-3">
                WEB DEVELOPMENT
              </p>
              <div className="text-sm text-[rgb(75,85,99)] space-y-1">
                <p>Email: toiral.dev@gmail.com</p>
                <p>Phone: +8801804673095</p>
                <p>Website: toiral-development.web.app</p>
              </div>
            </div>
            {/* Right: Customer Info */}
            <div className="text-right text-sm space-y-1">
              <p className="text-[rgb(75,85,99)]">
                <span className="font-semibold">CUSTOMER ID:</span> 3110-01
              </p>
              <p className="text-[rgb(75,85,99)]">
                <span className="font-semibold">DATE:</span> 31/10/2022
              </p>
              <p className="text-[rgb(75,85,99)]">
                <span className="font-semibold">CLIENT:</span> SALFORD & CO.
              </p>
            </div>
          </div>
        </div>
        {/* Invoice Table */}
        <div className="mb-8 border border-[rgb(209,213,219)] rounded-lg overflow-hidden print-clean">
          {/* Table Header */}
          <div className="bg-[rgb(31,41,55)] text-white py-3 px-6 grid grid-cols-12 gap-4 font-semibold text-sm">
            <div className="col-span-6">ITEM DESCRIPTION</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-center">PRICE</div>
            <div className="col-span-2 text-right">TOTAL</div>
          </div>
          {/* Table Body */}
          <div className="bg-[rgb(240,253,250)]">
            {/* Row 1 */}
            <div className="py-4 px-6 grid grid-cols-12 gap-4 text-sm border-b border-[rgb(229,231,235)]">
              <div className="col-span-6 text-[rgb(55,65,81)]">
                Website Design
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                30
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                $25.00
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $750.00
              </div>
            </div>
            {/* Row 2 */}
            <div className="py-4 px-6 grid grid-cols-12 gap-4 text-sm border-b border-[rgb(229,231,235)]">
              <div className="col-span-6 text-[rgb(55,65,81)]">Icon Design</div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                50
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                $10.00
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $500.00
              </div>
            </div>
            {/* Row 3 */}
            <div className="py-4 px-6 grid grid-cols-12 gap-4 text-sm border-b border-[rgb(229,231,235)]">
              <div className="col-span-6 text-[rgb(55,65,81)]">
                Illustration
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                10
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                $15.00
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $150.00
              </div>
            </div>
            {/* Row 4 (Last item) */}
            <div className="py-4 px-6 grid grid-cols-12 gap-4 text-sm border-b-2 border-[rgb(209,213,219)]">
              <div className="col-span-6 text-[rgb(55,65,81)]">
                Presentation Template
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                50
              </div>
              <div className="col-span-2 text-center text-[rgb(55,65,81)]">
                $7.00
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $350.00
              </div>
            </div>
            {/* Subtotal */}
            <div className="py-3 px-6 grid grid-cols-12 gap-4 text-sm border-b border-[rgb(229,231,235)]">
              <div className="col-span-10 text-right font-semibold text-[rgb(55,65,81)]">
                SUB TOTAL
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $1,750.00
              </div>
            </div>
            {/* Tax */}
            <div className="py-3 px-6 grid grid-cols-12 gap-4 text-sm border-b border-[rgb(229,231,235)]">
              <div className="col-span-10 text-right font-semibold text-[rgb(55,65,81)]">
                TAX (10%)
              </div>
              <div className="col-span-2 text-right text-[rgb(31,41,55)] font-medium">
                $175.00
              </div>
            </div>
            {/* Grand Total */}
            <div className="py-4 px-6 grid grid-cols-12 gap-4 text-base border-t-2 border-[rgb(209,213,219)] bg-white">
              <div className="col-span-10 text-right font-bold text-[rgb(31,41,55)]">
                GRAND TOTAL
              </div>
              <div className="col-span-2 text-right text-[rgb(17,24,39)] font-bold">
                $1,925.00
              </div>
            </div>
          </div>
        </div>
        {/* Payment and Terms Section */}
        <div className="grid grid-cols-2 gap-6 mb-8 px-6 md:grid-cols-2 sm:grid-cols-1">
          {/* Payable To */}
          <div className="bg-[rgb(240,253,250)] rounded-lg p-6 border border-[rgb(209,213,219)] print-clean">
            <h3 className="font-bold text-[rgb(31,41,55)] mb-4">Payable To</h3>
            <div className="text-sm text-[rgb(55,65,81)] space-y-2">
              <p className="font-medium">Bkash</p>
              <p>01533793071</p>
              <h4 className="font-bold text-[rgb(31,41,55)] mt-4 mb-2">
                Bank Details
              </h4>
              <p className="font-medium">Fauget Design Studio</p>
              <p>+123-456-7890</p>
            </div>
          </div>
          {/* Terms */}
          <div className="bg-[rgb(240,253,250)] rounded-lg p-6 border border-[rgb(209,213,219)] print-clean">
            <h3 className="font-bold text-[rgb(31,41,55)] mb-4">
              Terms and conditions:
            </h3>
            <div className="text-sm text-[rgb(55,65,81)] space-y-2">
              <p>• All rates quoted are valid for 15 days.</p>
              <p>• 40% payment should be done in advance.</p>
              <p>
                • The remaining amount should be paid within 20 days of
                delivery.
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-[rgb(240,253,250)] rounded-lg py-4 px-6 border border-[rgb(209,213,219)] mx-6 mb-6 print-clean">
          <div className="flex justify-center items-center gap-8 text-sm text-[rgb(55,65,81)] flex-wrap">
            <span>+8801804673095</span>
            <span>toiral.dev@gmail.com</span>
            <span>toiral-development.web.app</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-clean {
            border-color: #333 !important;
          }
          .bg-[rgb(31,41,55)] {
            background-color: rgb(31, 41, 55) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .bg-[rgb(240,253,250)] {
            background-color: rgb(240, 253, 250) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>;
}