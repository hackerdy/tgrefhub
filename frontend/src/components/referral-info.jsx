'use client'

import { useState, useEffect, useContext } from 'react';
import UserContext from '../utils/UserContext';
import { Card, CardContent } from './Card';
import axios from 'axios';

export default function ReferralInfo() {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null); 
  const { userData } = useContext(UserContext);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const generateLink = async () => {
      if (!userData) return;
      const telegramId = userData.telegramId;

      try {
        const response = await axios.post(`${API_BASE_URL}/referrals/generate-link`, { telegramId });
        setReferralLink(response.data.referralLink);
      } catch (error) {
        console.error('Error generating referral link:', error);
        setError(error.response?.data?.message || 'Failed to generate referral link.');
      }
    };
    generateLink();
  }, [userData, API_BASE_URL]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy link.');
    } 
  };

  if (!userData) {
    return (
      <Card>
        <CardContent>
          <p className="text-telegram-textSecondary">Loading user data...</p>
        </CardContent>
      </Card>
    );
  }

    if (error) { // display error message if there is an error
    return (
      <Card>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-[#242f3d] rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Invite Friends</h2>
      
      <div className="bg-[#1c2733] rounded-xl p-4 mb-6">
        <p className="text-[#8e99a8] leading-relaxed">
          Invite your friends and earn:
          <br />
          🎉 3 Points instantly when they join!
          <br />
          🔥 Plus, 10% of the points they earn by completing tasks.
        </p>
      </div>

      <div className="relative">
        <input 
          type="text"
          value={referralLink}
          readOnly
          className="w-full bg-[#1c2733] text-white px-4 py-3 rounded-xl pr-24"
        />
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     bg-[#3390ec] hover:bg-[#3180d4] text-white px-4 py-1.5 rounded-lg 
                     transition-colors duration-200"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}

