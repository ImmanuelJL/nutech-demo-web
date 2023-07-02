import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

test('App renders successfully', () => {
  render(
  	<BrowserRouter>
  		<Routes>
  			<Route
			    path='/'
			    element={
			      <App />
			    }
			/>
  		</Routes>
  	</BrowserRouter>
  );
  const linkElement = screen.getByText(/Sign In/i);
  expect(linkElement).toBeInTheDocument();
});
