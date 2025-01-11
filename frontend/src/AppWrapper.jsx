import { useState } from 'react';
// Removed dotenv import and config as it's handled by dotenv-webpack
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';
import UserContext from './utils/UserContext';
import App from './App.jsx';

export default function AppWrapper() {
  const [userData, setUserData] = useState(null);

  return (
    <TwaAnalyticsProvider 
      projectId={import.meta.env.VITE_PROJECT_ID}
      apiKey={import.meta.env.VITE_API_KEY}
      appName="Telegram Referral Hub"
    >
      <UserContext.Provider value={{ userData, setUserData }}>
        <App />
      </UserContext.Provider>
    </TwaAnalyticsProvider>
  );
}
