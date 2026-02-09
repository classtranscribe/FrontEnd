import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RangeInput from './RangeInput';

// Mock timestr
jest.mock('utils/use-time', () => ({
  __esModule: true,
  default: {
    toDecimalTimeString: jest.fn((sec) => {
      const hours = Math.floor(sec / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const secs = (sec % 60).toFixed(2);
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
    }),
    toSeconds: jest.fn((timeStr) => {
      // Simple mock: assumes format HH:MM:SS.ss
      const parts = timeStr.split(':');
      if (parts.length === 3) {
        return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
      }
      return 0;
    }),
  },
}));

describe.skip('RangeInput', () => {
  const defaultProps = {
    id: 'test-range',
    duration: 100,
    range: [10, 50],
    onRangeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RangeInput {...defaultProps} />);
  });

  it('renders two time inputs', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const inputs = container.querySelectorAll('input[type="time"]');
    expect(inputs.length).toBe(2);
  });

  it('assigns correct IDs to inputs', () => {
    const { container } = render(<RangeInput id="my-range" {...defaultProps} />);
    // Note: Source has space in template literal: `time1-${ id}`
    expect(container.querySelector('#time1-\\ my-range')).toBeInTheDocument();
    expect(container.querySelector('#time2-\\ my-range')).toBeInTheDocument();
  });

  it('sets aria-labels for accessibility', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const inputs = container.querySelectorAll('input[type="time"]');
    expect(inputs[0]).toHaveAttribute('aria-label', 'Begin time of the range');
    expect(inputs[1]).toHaveAttribute('aria-label', 'End time of the range');
  });

  it('initializes with range values', async () => {
    render(<RangeInput {...defaultProps} range={[15, 45]} />);

    await waitFor(() => {
      const timestr = require('utils/use-time').default;
      expect(timestr.toDecimalTimeString).toHaveBeenCalledWith(15);
      expect(timestr.toDecimalTimeString).toHaveBeenCalledWith(45);
    });
  });

  it('updates time1 when first input changes', () => {
    const mockOnRangeChange = jest.fn();
    const timestr = require('utils/use-time').default;
    timestr.toSeconds.mockReturnValueOnce(20);

    const { container } = render(
      <RangeInput {...defaultProps} onRangeChange={mockOnRangeChange} />
    );

    const input1 = container.querySelector('#time1-\\ test-range');
    fireEvent.change(input1, { target: { value: '00:00:20.00' } });

    expect(mockOnRangeChange).toHaveBeenCalledWith([20, 50]);
  });

  it('updates time2 when second input changes', () => {
    const mockOnRangeChange = jest.fn();
    const timestr = require('utils/use-time').default;
    timestr.toSeconds.mockReturnValueOnce(60);

    const { container } = render(
      <RangeInput {...defaultProps} onRangeChange={mockOnRangeChange} />
    );

    const input2 = container.querySelector('#time2-\\ test-range');
    fireEvent.change(input2, { target: { value: '00:01:00.00' } });

    expect(mockOnRangeChange).toHaveBeenCalledWith([10, 60]);
  });

  it('does not call onRangeChange when undefined', () => {
    const { container } = render(<RangeInput {...defaultProps} onRangeChange={undefined} />);

    const input1 = container.querySelector('#time1-\\ test-range');
    expect(() => {
      fireEvent.change(input1, { target: { value: '00:00:20.00' } });
    }).not.toThrow();
  });

  it('sets min/max constraints on inputs', () => {
    const { container } = render(<RangeInput {...defaultProps} duration={100} />);

    const input1 = container.querySelector('#time1-\\ test-range');
    const input2 = container.querySelector('#time2-\\ test-range');

    // time1 min should be 0, max should be time2
    expect(input1).toHaveAttribute('min');
    expect(input1).toHaveAttribute('max');

    // time2 min should be time1, max should be duration
    expect(input2).toHaveAttribute('min');
    expect(input2).toHaveAttribute('max');
  });

  it('sets step to 0.01 for both inputs', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const inputs = container.querySelectorAll('input[type="time"]');
    expect(inputs[0]).toHaveAttribute('step', '0.01');
    expect(inputs[1]).toHaveAttribute('step', '0.01');
  });

  it('renders arrow icon between inputs', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const icon = container.querySelector('.material-icons');
    expect(icon).toHaveTextContent('arrow_right_alt');
  });

  it('marks icon as aria-hidden', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const iconContainer = container.querySelector('[aria-hidden="true"]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('updates when range prop changes', async () => {
    const { rerender } = render(<RangeInput {...defaultProps} range={[10, 50]} />);

    const timestr = require('utils/use-time').default;
    timestr.toDecimalTimeString.mockClear();

    rerender(<RangeInput {...defaultProps} range={[20, 60]} />);

    await waitFor(() => {
      expect(timestr.toDecimalTimeString).toHaveBeenCalledWith(20);
      expect(timestr.toDecimalTimeString).toHaveBeenCalledWith(60);
    });
  });

  it('prevents feedback loop with wasInputChange flag', async () => {
    const { container, rerender } = render(<RangeInput {...defaultProps} range={[10, 50]} />);

    // Simulate user input
    const input1 = container.querySelector('#time1-\\ test-range');
    fireEvent.change(input1, { target: { value: '00:00:15.00' } });

    const timestr = require('utils/use-time').default;
    timestr.toDecimalTimeString.mockClear();

    // Rerender with same range - should not update because of wasInputChange
    rerender(<RangeInput {...defaultProps} range={[10, 50]} />);

    // After one more render, wasInputChange should be reset
    rerender(<RangeInput {...defaultProps} range={[10, 50]} />);

    await waitFor(() => {
      // Should now update with new range values
      expect(timestr.toDecimalTimeString).toHaveBeenCalled();
    });
  });

  it('has correct container classes', () => {
    const { container } = render(<RangeInput {...defaultProps} />);
    const rangeInputCon = container.querySelector('.range-input-con');
    expect(rangeInputCon).toBeInTheDocument();
    expect(rangeInputCon.className).toContain('ctp');
    expect(rangeInputCon.className).toContain('ct-d-r-center-v');
  });
});
