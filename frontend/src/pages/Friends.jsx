'use client';

import { useState, useEffect, useContext } from 'react';
import ReferralInfo from '../components/referral-info';
import ReferredUsersList from '../components/referred-users-list';
import ReferralStats from '../components/referral-stats';
import axios from 'axios';
import UserContext from '../utils/UserContext';

export default function FriendsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userData || !userData.telegramId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/referrals/stats`, {
          telegramId: userData.telegramId,
        });

        const data = response.data;

        // Ensure totalPoints is a number
        const formattedStats = {
          ...data.stats,
          totalPoints: Number(data.stats.totalPoints),
        };

        setStats({
          ...data,
          stats: formattedStats,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [userData, API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#17212b]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#3390ec]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#17212b] p-4">
      <ReferralInfo />
      <ReferralStats stats={stats?.stats} userPoints={stats?.userPoints} />
      <ReferredUsersList referrals={stats?.referrals} />
    </main>
  );
}
