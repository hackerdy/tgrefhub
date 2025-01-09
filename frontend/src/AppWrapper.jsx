import { useState } from 'react';
import UserContext from './utils/UserContext';
import App from './App.jsx';


export default function AppWrapper() {
  const [userData, setUserData] = useState(null); // useState to manage user data

  return (
    <UserContext.Provider value={{ userData, setUserData }}>

      <App /> {/* App is now a child of the provider */}
    </UserContext.Provider>
  );
}