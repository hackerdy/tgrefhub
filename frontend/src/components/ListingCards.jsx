import { useState, useEffect, useContext } from 'react';
import UserContext from '../utils/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function ListingCards() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchListings = async () => {
      if (!userData?.telegramId) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/listings?telegramId=${userData.telegramId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [userData?.telegramId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <div key={listing._id} className="bg-[#242f3d] rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">{listing.title}</h3>
            <span className="bg-[#1c2733] px-3 py-1 rounded-lg text-[#3390ec]">
              {listing.points} pts
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#8e99a8]">
              <span>Progress</span>
              <span>
                {listing.progress}/{listing.points}
              </span>
            </div>
            <div className="w-full bg-[#1c2733] rounded-full h-2">
              <div
                className="bg-[#3390ec] h-2 rounded-full transition-all"
                style={{ width: `${(listing.progress / listing.points) * 100}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8e99a8] capitalize">{listing.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
