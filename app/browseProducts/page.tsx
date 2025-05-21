'use client';

import { useState } from 'react';
import ProductGrid from '@/components/ui/productsGrid';
import ProductSortDropdown from '@/components/ui/productSort';

const BrowseProductsPage = () => {
  const [sortBy, setSortBy] = useState('default');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto w-full max-w-[95vw] sm:max-w-[90vw] py-4 px-3 sm:px-4 lg:px-6">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">Browse Products</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[95vw] sm:max-w-[90vw] py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
        <section className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Your Favorites</h2>
          <ProductGrid isFavoritesSection={true} />
        </section>
        <section>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">All Available Products</h2>
            <ProductSortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
          <ProductGrid isFavoritesSection={false} sortBy={sortBy} />
        </section>
      </main>
    </div>
  );
};

export default BrowseProductsPage;