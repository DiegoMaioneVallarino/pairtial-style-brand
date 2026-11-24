import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pairtial/style-brand-legacy';
import './studio.css';
import App from './App';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
