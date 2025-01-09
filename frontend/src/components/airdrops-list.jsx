import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AirdropCard from './airdrop-card';
import { ErrorAlert } from './error-alert';
import UserContext from '../utils/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function AirdropsList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(UserContext);

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/listings/available?telegramId=${userData.telegramId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Unable to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchListing();
    }
  }, [userData, fetchListing]);

  const handleStart = async () => {
    // Logic for starting a task
  };

  const handleClaim = async (listingId) => {
    try {
      const telegramId = userData.telegramId;

      const response = await fetch(`${API_BASE_URL}/listings/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, listingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start task');
      }

      const result = await response.json();

      setListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
      await axios.post(`${API_BASE_URL}/referrals/update-points`, {
        telegramId: result.user.telegramId,
        pointsEarned: result.user.pointsEarned,
      });
    } catch (error) {
      console.error('Error starting task:', error);
      alert('Failed to start task. Please try again.');
    }
  };

  const handleSkip = async (listingId) => {
    try {
      const telegramId = userData.telegramId;

      const response = await fetch(`${API_BASE_URL}/user/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, listingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to skip task');
      }

      setListings((listings) => listings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error('Error skipping task:', error);
    }
  };

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-[#8e99a8]">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-[#8e99a8]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#3390ec] border-t-transparent mb-4"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchListing} />;
  }

  if (listings.length === 0) {
    return (
      <div className="bg-[#242f3d] rounded-xl p-6 text-center">
        <p className="text-[#8e99a8] mb-2">No tasks available at the moment</p>
        <button onClick={fetchListing} className="text-[#3390ec] hover:underline">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {listings.map((listing) => (
        <AirdropCard
          key={listing._id}
          listing={listing}
          onStart={handleStart}
          onClaim={handleClaim}
          onSkip={handleSkip}
        />
      ))}
    </div>
  );
}
