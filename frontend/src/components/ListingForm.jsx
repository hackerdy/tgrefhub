'use client';

import { useState, useContext } from 'react';
import { createListingAPI } from '../utils/api';
import UserContext from '../utils/UserContext';

export function ListingForm() {
  const [url, setUrl] = useState('');
  const [points, setPoints] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const { userData, setUserData } = useContext(UserContext); // Access context and updater

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(null);
    setMetadata(null);
    setPoints(points.trim());

    try {
      const result = await createListingAPI({
        url,
        points: parseInt(points, 10),
        telegramId: userData?.telegramId, // Include the telegramId
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(result.message);

        // Update the user's point balance dynamically
        const newBalance = result.newBalance;
        

        // Update context state
        setUserData((prevData) => ({
          ...prevData,
          points: newBalance,
        }));

        setMetadata(result.metadata);
        setUrl(''); // Clear the URL field
        setPoints(''); // Clear the points field
      }
    } catch (error) {
      setError({ general: error.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsPending(false); // Ensure pending state is updated
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-[#242f3d] rounded-xl p-6 shadow-lg">
      <div className="space-y-2">
        <label htmlFor="url" className="block text-[#8e99a8] text-sm font-medium">
          Enter Your Referral Link
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the referral link"
          required
          className="w-full bg-[#1c2733] text-white border border-[#3390ec]/20 rounded-lg p-3"
        />
        <p className="text-xs text-[#8e99a8]">
          Example: https://t.me/tgrefhub_bot/Tgrefhub?start=6eb3b5ffcd97
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="points" className="block text-[#8e99a8] text-sm font-medium">
          Points to Spend
        </label>
        <input
          type="number"
          id="points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          min="1"
          max={userData?.points || 0}
          required
          className="w-full bg-[#1c2733] text-white border border-[#3390ec]/20 rounded-lg p-3"
        />
        <p className="text-sm text-[#8e99a8]">
          Available: {userData?.points || 0} points
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#3390ec] hover:bg-[#3390ec]/80 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create Listing'}
      </button>

      {error?.general && (
        <div className="p-4 bg-[#1c2733] border border-red-500/20 text-red-400 rounded-lg">
          {error.general}
        </div>
      )}

      {success && (
        <div className="p-4 bg-[#1c2733] border border-green-500/20 text-green-400 rounded-lg">
          {success}
        </div>
      )}

      {metadata && (
        <div className="p-4 bg-[#1c2733] border border-[#3390ec]/20 rounded-lg">
          <h3 className="font-medium mb-2">Bot Information:</h3>
          <p className="text-[#8e99a8]">Title: {metadata.title}</p>
          <p className="text-[#8e99a8]">Description: {metadata.description}</p>
          {metadata.image && (
            <img src={metadata.image} alt="Bot preview" className="mt-2 rounded-lg max-w-full h-auto" />
          )}
        </div>
      )}
    </form>
  );
}
