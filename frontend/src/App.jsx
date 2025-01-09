import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import UserContext from './utils/UserContext';
import Home from './pages/Home';
import List from './pages/List';
import Friends from './pages/Friends';
import User from './pages/User';
import './index.css';
import AirdropsList from './components/airdrops-list';
import axios from 'axios';

const App = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const initializeTelegram = async () => {
    const tg = window.tg;

    if (!tg) {
      setError("Telegram Web App SDK not initialized.");
      setLoading(false);
      return;
    }

    tg.ready();

    const initDataUnsafe = tg.initDataUnsafe || {};
    const initData = tg.initData || {};
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("tgWebAppStartParam") || urlParams.get("start");
    console.log("Referral Code", referralCode);
    
    
    

    if (initData && initDataUnsafe.user) {
      try {
  const response = await axios.post(`${API_BASE_URL}/user/validate-telegram-data`, { initData });
  const userData = response.data.user;
  console.log('Response:', response.data);

  setUserData(userData);

  if (referralCode) {
    const referrer = await axios.post(`${API_BASE_URL}/referrals/record-referral`, { referralCode, newUserTelegramId: userData.telegramId });
    console.log('Referrer:', referrer.data);
  }
  
} catch (error) {
  console.error('API Error:', error.response?.data || error.message);
  setError(error.response?.data?.error || "Error validating Telegram data.");
}

    } else {
      setError("This app must be run within Telegram.");
    }

    setLoading(false);
  };

  useEffect(() => {
    initializeTelegram();
  }, [API_BASE_URL, setUserData]);

  

  return (
    <div className="App">
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/user" element={<User />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      
    </div>
  );
};

export default App;
