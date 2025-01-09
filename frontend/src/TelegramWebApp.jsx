// import { useState, useEffect } from 'react';
// import UserContext from './utils/UserContext';


// function TelegramWebApp() {

//   const [message, setMessage] = useState('');
//   const [user, setUser] = useState(null); // To store user data
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

//   useEffect(() => {
//     const initData = userData.initData; // Access initData from UserContext

//     if (initData) { // Check if initData exists (Mini App is running within Telegram)
//       fetch(`${API_BASE_URL}/user/validate-telegram-data`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ initData }),
//       })
//       .then(res => {
//         if (!res.ok) { // Check for non-2xx status codes
//           return res.json().then(errData => { // Get error message from response body
//              throw new Error(errData.error || 'Server error');
//           });
//         }
//         return res.json(); // Parse successful response
//       })
//       .then(data => {
//         setMessage(data.message);
//         setUser(data.user); // Set the user data
//       })
//       .catch(err => {
//         setMessage(`Error: ${err.message}`);
//         console.error(err);
//       });
//     } else {
//       setMessage('This app must be run within Telegram.');
//     }
//   }, [API_BASE_URL]); // Include API_BASE_URL in the dependency array

//   // Now you can use the 'user' state in your component
//   return (
//     <div>
//       {user ? (
//          // Display user information or other content based on logged-in state
//          <div>
//            <h1>Welcome, {user.telegram_id}!</h1>
//            {user.is_premium && <p>You are a Premium user!</p>}
//            <p>Points: {user.points}</p>
//          </div>

//       ) : (
//         <p>{message}</p> // Display loading or error message
//       )}
//     </div>
//   );
// }

// export default TelegramWebApp;