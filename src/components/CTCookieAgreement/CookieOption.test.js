import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieOption from './CookieOption';

// Mock react-device-detect
jest.mock('react-device-detect', () => ({
  isMobile: false,
}));

// Mock Material-UI
jest.mock('@material-ui/core', () => ({
  ButtonBase: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// Mock layout
jest.mock('layout', () => ({
  CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
  CTText: ({ children, size, bold, muted, ...props }) => (
    <span data-size={size} data-bold={bold} data-muted={muted} {...props}>
      {children}
    </span>
  ),
}));

describe('CookieOption', () => {
  const defaultProps = {
    name: 'Test Option',
    desp: 'Test description',
    icon: 'check_circle',
  };

  it('renders without crashing', () => {
    render(<CookieOption {...defaultProps} />);
  });

  it('displays name', () => {
    render(<CookieOption {...defaultProps} />);
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('displays description', () => {
    render(<CookieOption {...defaultProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<CookieOption {...defaultProps} />);
    expect(screen.getByText('check_circle')).toBeInTheDocument();
  });

  it('icon has material-icons class', () => {
    const { container } = render(<CookieOption {...defaultProps} />);
    const icon = container.querySelector('.material-icons');
    expect(icon).toHaveTextContent('check_circle');
  });

  it('has role="listitem"', () => {
    const { container } = render(<CookieOption {...defaultProps} />);
    expect(container.querySelector('[role="listitem"]')).toBeInTheDocument();
  });

  it('applies ct-signin-opt class', () => {
    const { container } = render(<CookieOption {...defaultProps} />);
    expect(container.querySelector('.ct-signin-opt')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<CookieOption {...defaultProps} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Test Option'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies muted prop to name', () => {
    render(<CookieOption {...defaultProps} muted />);
    const name = screen.getByText('Test Option');
    expect(name).toHaveAttribute('data-muted', 'true');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <CookieOption {...defaultProps} data-testid="custom-option" aria-label="Custom Option" />
    );
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('data-testid', 'custom-option');
    expect(button).toHaveAttribute('aria-label', 'Custom Option');
  });

  it('uses big size for name on desktop', () => {
    require('react-device-detect').isMobile = false;
    render(<CookieOption {...defaultProps} />);
    const name = screen.getByText('Test Option');
    expect(name).toHaveAttribute('data-size', 'big');
  });

  it('uses medium size for description on desktop', () => {
    require('react-device-detect').isMobile = false;
    render(<CookieOption {...defaultProps} />);
    const desp = screen.getByText('Test description');
    expect(desp).toHaveAttribute('data-size', 'medium');
  });

  it('applies bold to name', () => {
    render(<CookieOption {...defaultProps} />);
    const name = screen.getByText('Test Option');
    expect(name).toHaveAttribute('data-bold', 'true');
  });

  it('renders with different icons', () => {
    const { rerender } = render(<CookieOption {...defaultProps} icon="star" />);
    expect(screen.getByText('star')).toBeInTheDocument();

    rerender(<CookieOption {...defaultProps} icon="favorite" />);
    expect(screen.getByText('favorite')).toBeInTheDocument();
  });
});
