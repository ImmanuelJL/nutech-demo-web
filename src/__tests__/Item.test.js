import { render, screen } from '@testing-library/react'
import Item from '../Pages/Item';

test("Item renders successfully", () => {
  render(<Item />);
  const linkElement = screen.getByText(/Item/i);
  expect(linkElement).toBeInTheDocument();
})
