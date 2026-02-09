import React from 'react';
import { render, screen } from '@testing-library/react';
import EPubPoster from './EPubPoster';

// Mock layout components
jest.mock('layout', () => ({
  CTFragment: ({ children, id, ...props }) => (
    <div id={id} {...props}>{children}</div>
  ),
}));

// Mock image imports
jest.mock('assets/images', () => ({
  theEpubExampleTop: 'mock-epub-top.png',
  theEpubExampleBottom: 'mock-epub-bottom.png',
}));

describe('EPubPoster', () => {
  it('renders without crashing', () => {
    render(<EPubPoster />);
  });

  it('displays the main heading', () => {
    render(<EPubPoster />);
    expect(screen.getByText('Convert Your Lectures to I-Note Books')).toBeInTheDocument();
  });

  it('renders top example image', () => {
    render(<EPubPoster />);
    const images = screen.getAllByAltText('ePub generator screenshot');
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute('src', 'mock-epub-top.png');
  });

  it('renders bottom example image', () => {
    render(<EPubPoster />);
    const images = screen.getAllByAltText('ePub generator screenshot');
    expect(images[1]).toHaveAttribute('src', 'mock-epub-bottom.png');
  });

  it('marks images as decorative with aria-hidden', () => {
    render(<EPubPoster />);
    const images = screen.getAllByAltText('ePub generator screenshot');
    images.forEach(img => {
      expect(img).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('has container with id ct-epb-poster', () => {
    const { container } = render(<EPubPoster />);
    expect(container.querySelector('#ct-epb-poster')).toBeInTheDocument();
  });

  it('uses heading level 1 for main text', () => {
    render(<EPubPoster />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Convert Your Lectures to I-Note Books');
  });
});
