import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Item from './Pages/Item';
import reportWebVitals from './reportWebVitals';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
	    <Route index element={<App />} />
	    <Route
		    path='/item'
		    element={
		      <RequireAuth>
		        <Item />
		      </RequireAuth>
		    }
		  />
	  </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

function RequireAuth({children}) {
  const authorized = localStorage.getItem('authenticated');
  
  return authorized === 'true' ? children : <Navigate to="/" replace />;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();