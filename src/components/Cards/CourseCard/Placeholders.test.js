import React from 'react';
import { render } from '@testing-library/react';
import CardPlaceholder from './Placeholders';

// Mock Material-UI Skeleton
jest.mock('@material-ui/lab/Skeleton', () => {
  return function Skeleton({ variant, width, height, className, ...props }) {
    return (
      <div
        data-testid="skeleton"
        data-variant={variant}
        data-width={width}
        data-height={height}
        className={className}
        {...props}
      />
    );
  };
});

// Mock layout
jest.mock('layout', () => ({
  CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('CardPlaceholder', () => {
  it('renders without crashing', () => {
    render(<CardPlaceholder />);
  });

  it('has ct-course-card class', () => {
    const { container } = render(<CardPlaceholder />);
    expect(container.querySelector('.ct-course-card')).toBeInTheDocument();
  });

  it('has disabled class', () => {
    const { container } = render(<CardPlaceholder />);
    const card = container.querySelector('.ct-course-card');
    expect(card.className).toContain('disabled');
  });

  it('renders multiple Skeleton components', () => {
    const { container } = render(<CardPlaceholder />);
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders rect skeleton for course number', () => {
    const { container } = render(<CardPlaceholder />);
    const rectSkeletons = container.querySelectorAll('[data-variant="rect"]');
    expect(rectSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('first rect skeleton has correct dimensions', () => {
    const { container } = render(<CardPlaceholder />);
    const firstRect = container.querySelector('[data-variant="rect"]');
    expect(firstRect).toHaveAttribute('data-width', '130');
    expect(firstRect).toHaveAttribute('data-height', '25');
  });

  it('second rect skeleton has correct dimensions', () => {
    const { container } = render(<CardPlaceholder />);
    const rectSkeletons = container.querySelectorAll('[data-variant="rect"]');
    expect(rectSkeletons[1]).toHaveAttribute('data-width', '200');
    expect(rectSkeletons[1]).toHaveAttribute('data-height', '20');
  });

  it('second rect has mt-1 class', () => {
    const { container } = render(<CardPlaceholder />);
    const rectSkeletons = container.querySelectorAll('[data-variant="rect"]');
    expect(rectSkeletons[1].className).toContain('mt-1');
  });

  it('renders text skeletons', () => {
    const { container } = render(<CardPlaceholder />);
    const textSkeletons = container.querySelectorAll('[data-variant="text"]');
    expect(textSkeletons.length).toBe(3);
  });

  it('text skeletons have correct widths', () => {
    const { container } = render(<CardPlaceholder />);
    const textSkeletons = container.querySelectorAll('[data-variant="text"]');
    expect(textSkeletons[0]).toHaveAttribute('data-width', '160');
    expect(textSkeletons[1]).toHaveAttribute('data-width', '230');
    expect(textSkeletons[2]).toHaveAttribute('data-width', '230');
  });

  it('renders total of 5 skeleton elements', () => {
    const { container } = render(<CardPlaceholder />);
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBe(5);
  });
});
