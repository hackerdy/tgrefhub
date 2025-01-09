import React from 'react';
import { ListingForm } from '../components/ListingForm';
import { ListingCards } from '../components/ListingCards';

export default function List() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Create A New Listing</h1>
      {/* Add margin-bottom to ListingForm */}
      <div className="mb-8">
        <ListingForm />
      </div>
      <ListingCards />
    </main>
  );
}
