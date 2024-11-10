import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

test('init page', async () => {
  await act(async () => {
    render(<App />);
  });

  const brandNameElement = screen.getByText(/GitHub Search/i);
  expect(brandNameElement).toBeInTheDocument();
});
