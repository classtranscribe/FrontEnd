import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MediaCard from './Card';
import { parseMedia } from './parse-media';

// Mock layout
jest.mock('layout', () => {
  const CTText = ({ children, bold, size, line, teal, muted, ...props }) => (
    <span data-bold={bold} data-size={size} data-line={line} data-teal={teal} data-muted={muted} {...props}>
      {children}
    </span>
  );

  // Add propTypes to CTText mock
  CTText.propTypes = {
    size: null, // Just needs to exist for Card.js to access it
  };

  return {
    CTFragment: ({ children, as: Component = 'div', to, ...props }) => {
      if (Component && Component !== 'div') {
        return <Component to={to} {...props}>{children}</Component>;
      }
      return <div {...props}>{children}</div>;
    },
    CTText,
    makeEl: jest.fn((Component, props) => <Component {...props} />),
    altEl: jest.fn((Component, condition, props) => condition ? <Component {...props} /> : null),
  };
});

// Mock MediaPoster
jest.mock('./Poster', () => {
  return function MediaPoster({ progress, width, duration }) {
    return (
      <div data-testid="media-poster" data-progress={progress} data-width={width} data-duration={duration}>
        Poster
      </div>
    );
  };
});

// Mock SCSS
jest.mock('./index.scss', () => ({}), { virtual: true });

// Stub propTypes
const CTTextComponent = ({ children, ...props }) => <span {...props}>{children}</span>;
CTTextComponent.propTypes = { size: null };

describe('MediaCard', () => {
  const defaultProps = {
    id: 'media-1',
    name: 'Lecture 1: Introduction',
    href: '/video/123',
    ratio: 0.5,
    duration: 3600,
  };

  beforeEach(() => {
    // Reset makeEl and altEl to their mock implementations
    const layout = require('layout');
    layout.makeEl.mockImplementation((Component, props) => <Component {...props} />);
    layout.altEl.mockImplementation((Component, condition, props) =>
      condition ? <Component {...props} /> : null
    );
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
  });

  it('displays media name', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Lecture 1: Introduction')).toBeInTheDocument();
  });

  it('renders MediaPoster component', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('media-poster')).toBeInTheDocument();
  });

  it('passes progress to MediaPoster', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} ratio={0.75} />
      </BrowserRouter>
    );
    const poster = screen.getByTestId('media-poster');
    expect(poster).toHaveAttribute('data-progress', '0.75');
  });

  it('passes duration to MediaPoster', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} duration={1800} />
      </BrowserRouter>
    );
    const poster = screen.getByTestId('media-poster');
    expect(poster).toHaveAttribute('data-duration', '1800');
  });

  it('renders as Link with correct href', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/video/123');
  });

  it('applies ct-media-card class', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(container.querySelector('.ct-media-card')).toBeInTheDocument();
  });

  it('has role="listitem"', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(container.querySelector('[role="listitem"]')).toBeInTheDocument();
  });

  it('applies row class when row prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} row />
      </BrowserRouter>
    );
    const card = container.querySelector('.ct-media-card');
    expect(card.className).toContain('row');
  });

  it('applies dark class when dark prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} dark />
      </BrowserRouter>
    );
    const card = container.querySelector('.ct-media-card');
    expect(card.className).toContain('dark');
  });

  it('displays label when provided', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} label="New" />
      </BrowserRouter>
    );
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('does not display label when not provided', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    // altEl should return null when label is falsy
    expect(require('layout').altEl).toHaveBeenCalled();
  });

  it('displays description when provided', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} description="This is a test description" />
      </BrowserRouter>
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('uses default nameSize of medium', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    const name = screen.getByText('Lecture 1: Introduction');
    expect(name).toHaveAttribute('data-size', 'medium');
  });

  it('accepts custom nameSize', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} nameSize="large" />
      </BrowserRouter>
    );
    const name = screen.getByText('Lecture 1: Introduction');
    expect(name).toHaveAttribute('data-size', 'large');
  });

  it('uses big posterSize by default', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} />
      </BrowserRouter>
    );
    const poster = screen.getByTestId('media-poster');
    expect(poster).toHaveAttribute('data-width', '250px');
  });

  it('uses custom posterSize when provided', () => {
    render(
      <BrowserRouter>
        <MediaCard {...defaultProps} posterSize="small" />
      </BrowserRouter>
    );
    const poster = screen.getByTestId('media-poster');
    expect(poster).toHaveAttribute('data-width', '110px');
  });

  it('has parse static method', () => {
    expect(MediaCard.parse).toBe(parseMedia);
  });

  it('sets id attribute', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} id="my-media" />
      </BrowserRouter>
    );
    expect(container.querySelector('#my-media')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    const { container } = render(
      <BrowserRouter>
        <MediaCard {...defaultProps} data-testid="custom-media" />
      </BrowserRouter>
    );
    expect(container.querySelector('[data-testid="custom-media"]')).toBeInTheDocument();
  });
});
