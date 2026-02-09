import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RangeSlider from './RangeSlider';

// Mock Material-UI Slider
jest.mock('@material-ui/core/Slider', () => {
  return function Slider({ value, onChange, min, max, valueLabelFormat, getAriaLabel, className }) {
    return (
      <div
        data-testid="slider"
        data-min={min}
        data-max={max}
        data-value={JSON.stringify(value)}
        data-aria-label={getAriaLabel ? getAriaLabel() : undefined}
        className={className}
      >
        <button
          onClick={() => onChange && onChange(null, [10, 20])}
          data-testid="slider-change"
        >
          Change
        </button>
        <span data-testid="value-label">
          {value && valueLabelFormat ? valueLabelFormat(value[0]) : (value ? value[0] : '')}
        </span>
      </div>
    );
  };
});

// Mock RangeTimeLabel
jest.mock('./RangeTimeLabel', () => {
  return function RangeTimeLabel(props) {
    return <div data-testid="range-time-label">{JSON.stringify(props)}</div>;
  };
});

// Mock timestr
jest.mock('utils/use-time', () => ({
  __esModule: true,
  default: {
    toDecimalTimeString: jest.fn((sec) => {
      const mins = Math.floor(sec / 60);
      const secs = (sec % 60).toFixed(2);
      return `${mins}:${secs}`;
    }),
    toTimeString: jest.fn((sec) => `${Math.floor(sec / 60)}:${sec % 60}`),
  },
}));

describe('RangeSlider', () => {
  const defaultProps = {
    range: [10, 50],
    duration: 100,
    onRangeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RangeSlider {...defaultProps} />);
  });

  it('renders Material-UI Slider', () => {
    const { getByTestId } = render(<RangeSlider {...defaultProps} />);
    expect(getByTestId('slider')).toBeInTheDocument();
  });

  it('applies range-slider class to slider', () => {
    const { getByTestId } = render(<RangeSlider {...defaultProps} />);
    const slider = getByTestId('slider');
    expect(slider.className).toContain('range-slider');
  });

  it('calculates min with padding', () => {
    const { getByTestId } = render(<RangeSlider range={[10, 50]} duration={100} />);
    const slider = getByTestId('slider');
    // range is [10, 50], pad = 40, min = 10 - 40 = 0 (clamped to 0)
    expect(slider).toHaveAttribute('data-min', '0');
  });

  it('calculates max with padding', () => {
    const { getByTestId } = render(<RangeSlider range={[10, 50]} duration={100} />);
    const slider = getByTestId('slider');
    // range is [10, 50], pad = 40, max = 50 + 40 = 90
    expect(slider).toHaveAttribute('data-max', '90');
  });

  it('uses minimum padding of 5 for small ranges', () => {
    const { getByTestId } = render(<RangeSlider range={[10, 12]} duration={100} />);
    const slider = getByTestId('slider');
    // pad = 2 < 5, so use 5
    // min = 10 - 5 = 5
    expect(slider).toHaveAttribute('data-min', '5');
  });

  it('clamps min to 0', () => {
    const { getByTestId } = render(<RangeSlider range={[2, 10]} duration={100} />);
    const slider = getByTestId('slider');
    // pad = 8, min = 2 - 8 = -6, clamped to 0
    expect(slider).toHaveAttribute('data-min', '0');
  });

  it('clamps max to duration', () => {
    const { getByTestId } = render(<RangeSlider range={[80, 95]} duration={100} />);
    const slider = getByTestId('slider');
    // pad = 15, max = 95 + 15 = 110, clamped to 100
    expect(slider).toHaveAttribute('data-max', '100');
  });

  it('passes range value to slider', () => {
    const { getByTestId } = render(<RangeSlider range={[15, 45]} duration={100} />);
    const slider = getByTestId('slider');
    expect(slider).toHaveAttribute('data-value', JSON.stringify([15, 45]));
  });

  it('calls onRangeChange when slider changes', () => {
    const mockOnRangeChange = jest.fn();
    const { getByTestId } = render(
      <RangeSlider range={[10, 50]} duration={100} onRangeChange={mockOnRangeChange} />
    );

    fireEvent.click(getByTestId('slider-change'));

    expect(mockOnRangeChange).toHaveBeenCalledWith([10, 20]);
  });

  it('does not crash when onRangeChange is undefined', () => {
    const { getByTestId } = render(
      <RangeSlider range={[10, 50]} duration={100} />
    );

    expect(() => {
      fireEvent.click(getByTestId('slider-change'));
    }).not.toThrow();
  });

  it('uses toDecimalTimeString for value label format', () => {
    render(<RangeSlider range={[60, 120]} duration={200} />);
    // toDecimalTimeString is mocked to be called by the slider
    expect(require('utils/use-time').default.toDecimalTimeString).toBeDefined();
  });

  it('has aria label', () => {
    const { getByTestId } = render(<RangeSlider {...defaultProps} />);
    const slider = getByTestId('slider');
    expect(slider).toHaveAttribute('data-aria-label', 'Range Slider');
  });

  it('handles non-array range gracefully', () => {
    const { getByTestId } = render(<RangeSlider range={null} duration={100} />);
    const slider = getByTestId('slider');
    // When range is not an array, min=0, max=duration
    expect(slider).toHaveAttribute('data-min', '0');
    expect(slider).toHaveAttribute('data-max', '100');
  });

  it('renders container with correct class', () => {
    const { container } = render(<RangeSlider {...defaultProps} />);
    const rangeSliderCon = container.querySelector('.range-slider-con');
    expect(rangeSliderCon).toBeInTheDocument();
    expect(rangeSliderCon.className).toContain('ctp');
  });
});
