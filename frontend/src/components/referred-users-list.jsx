import PropTypes from 'prop-types';

export default function ReferredUsersList({ referrals }) {
  return (
    <div className="bg-[#242f3d] rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Your Referrals</h3>
      
      {referrals?.length > 0 ? (
        <div className="space-y-4">
          {referrals.map((user, index) => (
            <div 
              key={user._id || index}
              className="bg-[#1c2733] rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3390ec] rounded-full flex items-center justify-center">
                  {user.firstName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-white font-medium">{user.firstName}</p>
                  <p className="text-sm text-[#8e99a8]">Joined {new Date(user.completedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#3390ec] font-bold">+{user.pointsEarned} pts</p>
                <p className="text-xs text-[#8e99a8]">
                  Status: {user.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#8e99a8]">
          <p>No referrals yet. Share your link to start earning!</p>
        </div>
      )}
    </div>
  );
}

ReferredUsersList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    completedAt: PropTypes.string,
    pointsEarned: PropTypes.number,
    status: PropTypes.string,
  }))
};

