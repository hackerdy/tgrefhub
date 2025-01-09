import { StrictMode } from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <AppWrapper/>
  </StrictMode>
);

const tg = window.Telegram.WebApp; // Initialize Telegram.WebApp AFTER rendering
window.tg = tg;