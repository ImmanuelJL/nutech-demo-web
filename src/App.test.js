import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders successfully', () => {
  render(<App />);
  const linkElement = screen.getByText(/CRUD Item Data/i);
  expect(linkElement).toBeInTheDocument();
});
