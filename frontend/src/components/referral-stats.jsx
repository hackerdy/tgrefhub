import PropTypes from 'prop-types';

export default function ReferralStats({ stats, userPoints }) {
  const statItems = [
    {
      label: 'Total Referrals',
      value: stats?.totalReferrals || 0,
      icon: '👥'
    },
    {
      label: 'Points Earned',
      value: stats?.totalPoints || 0,
      icon: '💎'
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: '🔥'
    },
    {
      label: 'Your Points',
      value: userPoints || 0,
      icon: '🏆'
    }
  ]

  ReferralStats.propTypes = {
    stats: PropTypes.shape({
      totalReferrals: PropTypes.number,
      totalPoints: PropTypes.number,
      activeUsers: PropTypes.number
    }),
    userPoints: PropTypes.number
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="bg-[#242f3d] rounded-xl p-4 text-center"
        >
          <span className="text-2xl mb-2 block">{item.icon}</span>
          <p className="text-[#3390ec] text-xl font-bold">{item.value}</p>
          <p className="text-[#8e99a8] text-sm">{item.label}</p>
        </div>
    ))}
  </div>
  );
}

