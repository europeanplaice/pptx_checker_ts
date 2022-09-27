import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/PowerPoint Font Checker/i);
  expect(linkElement).toBeInTheDocument();
});

// test('hellofunc', () => 
// {
//   let res: string = hello();
//   expect(res).toBe("hello");
// });
