import React from 'react';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-brand-dark p-10 text-brand-light">
      <h1 className="text-3xl text-brand-gold font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-brand-green/20 border border-brand-green p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Manual Quotation Generation</h2>
        <p className="text-gray-400">Admin features including manual quote generation for clients over phone will go here. You can leverage the same generateQuotation utility!</p>
      </div>
    </div>
  );
};

export default AdminPage;
