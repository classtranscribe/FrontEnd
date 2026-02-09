import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RangePlayButton from './RangePlayButton';

// Mock ActionButton
jest.mock('../../Wrapper/InteractiveLayer/ActionButton', () => {
  return function ActionButton({ icon, label, onClick, color, ...props }) {
    return (
      <button
        onClick={onClick}
        data-icon={icon}
        data-label={label}
        data-color={color}
        aria-label={label}
        {...props}
      >
        {label}
      </button>
    );
  };
});

describe('RangePlayButton', () => {
  it('renders without crashing', () => {
    render(<RangePlayButton onClick={jest.fn()} />);
  });

  it('renders ActionButton', () => {
    render(<RangePlayButton onClick={jest.fn()} />);
    expect(screen.getByLabelText('Play the Range')).toBeInTheDocument();
  });

  it('uses play_arrow icon', () => {
    const { container } = render(<RangePlayButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-icon]');
    expect(button).toHaveAttribute('data-icon', 'play_arrow');
  });

  it('has label "Play the Range"', () => {
    const { container } = render(<RangePlayButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-label]');
    expect(button).toHaveAttribute('data-label', 'Play the Range');
  });

  it('uses teal color', () => {
    const { container } = render(<RangePlayButton onClick={jest.fn()} />);
    const button = container.querySelector('[data-color]');
    expect(button).toHaveAttribute('data-color', 'teal');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<RangePlayButton onClick={mockOnClick} />);

    fireEvent.click(screen.getByLabelText('Play the Range'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onClick is undefined', () => {
    render(<RangePlayButton />);
    expect(() => {
      fireEvent.click(screen.getByLabelText('Play the Range'));
    }).not.toThrow();
  });

  it('displays button text', () => {
    render(<RangePlayButton onClick={jest.fn()} />);
    expect(screen.getByText('Play the Range')).toBeInTheDocument();
  });
});
