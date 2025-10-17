import React from 'react';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { Sidebar } from '../components/Sidebar';
export function InvoicePage() {
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <InvoiceTemplate />
      </div>
    </div>;
}