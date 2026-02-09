import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ShortcutButton from './ShortcutButton';

// Mock ActionButton
jest.mock('../ActionButton', () => {
  return function ActionButton({ label, icon, onClick, labelPlacement, ...props }) {
    return (
      <button
        onClick={onClick}
        data-label={label}
        data-icon={icon}
        data-label-placement={labelPlacement}
        aria-label={label}
        {...props}
      >
        {label}
      </button>
    );
  };
});

describe('ShortcutButton', () => {
  it('renders without crashing', () => {
    render(<ShortcutButton onClick={jest.fn()} />);
  });

  it('renders ActionButton', () => {
    render(<ShortcutButton onClick={jest.fn()} />);
    expect(screen.getByLabelText('Shortcuts')).toBeInTheDocument();
  });

  it('uses keyboard icon', () => {
    const { container } = render(<ShortcutButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-icon]');
    expect(button).toHaveAttribute('data-icon', 'keyboard');
  });

  it('has label "Shortcuts"', () => {
    const { container } = render(<ShortcutButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-label]');
    expect(button).toHaveAttribute('data-label', 'Shortcuts');
  });

  it('uses bottom label placement', () => {
    const { container } = render(<ShortcutButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-label-placement]');
    expect(button).toHaveAttribute('data-label-placement', 'bottom');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<ShortcutButton onClick={mockOnClick} />);

    fireEvent.click(screen.getByLabelText('Shortcuts'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onClick is undefined', () => {
    render(<ShortcutButton />);
    expect(() => {
      fireEvent.click(screen.getByLabelText('Shortcuts'));
    }).not.toThrow();
  });

  it('displays button text', () => {
    render(<ShortcutButton onClick={jest.fn()} />);
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
  });
});
