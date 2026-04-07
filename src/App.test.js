import { render, screen } from '@testing-library/react';
import App from './App';

test('renders admin portal heading', () => {
  render(<App />);
  const heading = screen.getByText(/admin portal/i);
  expect(heading).toBeInTheDocument();
});
