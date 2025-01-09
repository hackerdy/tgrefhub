'use client'

import { useContext } from 'react';
import UserContext from '../utils/UserContext';
import TopUpButton from './top-up-button';
import {JoinedAirdropCards} from './joinedAirdropCards';

export default function UserProfile() {
  const { userData } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#17212b] text-white p-4">
      <div className="bg-[#242f3d] rounded-2xl mb-6 shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-[#3390ec] rounded-full flex items-center justify-center text-2xl overflow-hidden">
            <img className='w-full h-full object-cover' src={userData?.photoUrl || '/placeholder.svg?height=64&width=64'} alt="User Photo" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData?.firstName || 'User'}</h2>
            <p className="text-[#8e99a8]">ID: {userData?.telegramId || 'user123'}</p>
          </div>
        </div>
        
        <hr className="my-4 border-[#2e3947]" />
        <div className="mt-6 p-4 bg-[#1c2733] rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#8e99a8]">Balance</span>
            <span className="text-2xl font-bold text-[#3390ec]">{userData?.points || 0}</span>
          </div>
          <TopUpButton />
        </div>
      </div>
      <div>
        <JoinedAirdropCards />
      </div>
      
    </div>
  )
}

