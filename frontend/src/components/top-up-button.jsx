'use client';

import { useState, useContext, useEffect } from 'react';
import UserContext from '../utils/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function TopUpButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData, updateUserData } = useContext(UserContext);
  const [tg, setTg] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setTg(window.Telegram.WebApp);
    }
  }, []);

  const handleTopUp = async (amount) => {
    if (!tg) {
      console.error('Telegram WebApp not initialized');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) throw new Error('Failed to create invoice');
      
      const { payment_url } = await response.json();
      
      console.log(payment_url);

      tg.openInvoice(payment_url, (status) => {
        if (status === 'paid') {
          updateUserData({ 
            ...userData, 
            points: (userData.points || 0) + amount 
          });
          console.log('Payment successful');
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      tg.showAlert('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#8e99a8]">Top Up Points</h3>
      <div className="grid grid-cols-3 gap-3">
        {[100, 500, 1000].map((amount) => (
          <button
            key={amount}
            onClick={() => handleTopUp(amount)}
            className={`
              bg-[#3390ec] hover:bg-[#3180d1] text-white 
              py-2 px-4 rounded-lg transition-colors 
              flex flex-col items-center justify-center
              ${(isLoading || !tg) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isLoading || !tg}
          >
            <span className="font-bold">{amount}</span>
            <span className="text-xs">Points</span>
          </button>
        ))}
      </div>
    </div>
  );
}

