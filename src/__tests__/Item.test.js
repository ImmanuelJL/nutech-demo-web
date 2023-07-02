import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Item from '../Pages/Item';

test("Item renders successfully", () => {
  render(
  	<BrowserRouter>
  		<Routes>
  			<Route
			    path='/'
			    element={
			      <Item />
			    }
			/>
  		</Routes>
  	</BrowserRouter>
  );
  const linkElement = screen.findAllByText(/Item/i);
});
