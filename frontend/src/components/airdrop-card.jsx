'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'

export default function AirdropCard({ listing, onStart, onClaim, onSkip }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'started', 'completed'
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStart = async () => {
    try {
      setStatus('started');
      await onStart(listing._id);
      console.log('Opening link:', listing.url);
      console.log(' listingId:', listing._id);

      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(listing.url);
      } else {
        console.warn('Telegram WebApp openLink not available.');
      }
    } catch (error) {
      console.error('Error starting task:', error.message);
      setStatus('idle'); // Revert status on error
    }
  };

  const handleClaim = async () => {
    try {
      await onClaim(listing._id);
      setStatus('completed');
    } catch (error) {
      console.error('Error claiming task:', error.message);
    }
  };

  const handleSkip = async () => {
    try {
      setShowConfirmation(false);
      await onSkip(listing._id);
      setStatus('completed');
    } catch (error) {
      console.error('Error skipping task:', error.message);
    }
  };

  return (
    <div className="bg-[#242f3d] rounded-xl p-3 sm:p-4 mb-3 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden mr-3 sm:mr-4 bg-[#1c2733] flex-shrink-0">
            <img
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-base sm:text-lg truncate">{listing.title}</h3>
            <p className="text-[#8e99a8] text-xs sm:text-sm truncate">{listing.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {status === 'idle' && (
            <>
              <button
                onClick={handleStart}
                className="flex-1 sm:flex-none bg-[#3390ec] hover:bg-[#3180d4] text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Start
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                className="flex-1 sm:flex-none bg-[#242f3d] hover:bg-[#2b3847] text-[#8e99a8] px-3 sm:px-4 py-2 rounded-lg border border-[#3390ec] transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Skip
              </button>
            </>
          )}
          {status === 'started' && (
            <button
              onClick={handleClaim}
              className="w-full sm:w-auto bg-[#3390ec] hover:bg-[#3180d4] text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Claim
            </button>
          )}
          {status === 'completed' && (
            <span className="text-[#3390ec] font-medium text-sm sm:text-base">Completed</span>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="absolute inset-0 bg-[#17212b] bg-opacity-90 flex items-center justify-center rounded-xl p-3 sm:p-4">
          <div className="bg-[#242f3d] p-4 rounded-lg text-center w-full max-w-xs">
            <p className="text-white mb-2 sm:mb-4 text-sm sm:text-base">Are you sure you want to skip this task?</p>
            <p className="text-[#8e99a8] mb-4 text-xs sm:text-sm">Only skip if you've already completed this airdrop elsewhere.</p>
            <div className="flex justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-[#242f3d] text-white hover:bg-[#2b3847] px-3 sm:px-4 py-2 rounded-lg border border-[#3390ec] transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSkip}
                className="bg-[#3390ec] hover:bg-[#3180d4] text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AirdropCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onStart: PropTypes.func.isRequired,
  onClaim: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

