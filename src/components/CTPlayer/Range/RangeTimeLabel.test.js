import React from 'react';
import { render } from '@testing-library/react';
import RangeTimeLabel from './RangeTimeLabel';

// Mock SliderTimeLabel
jest.mock('../Wrapper/InteractiveLayer/ControlBar/Progress/SliderTimeLabel', () => {
  return function SliderTimeLabel({ placement, ...props }) {
    return (
      <div data-testid="slider-time-label" data-placement={placement} {...props}>
        SliderTimeLabel
      </div>
    );
  };
});

describe('RangeTimeLabel', () => {
  it('renders without crashing', () => {
    render(<RangeTimeLabel index={0} />);
  });

  it('renders SliderTimeLabel component', () => {
    const { getByTestId } = render(<RangeTimeLabel index={0} />);
    expect(getByTestId('slider-time-label')).toBeInTheDocument();
  });

  it('sets placement to "left" when index is 0', () => {
    const { getByTestId } = render(<RangeTimeLabel index={0} />);
    const label = getByTestId('slider-time-label');
    expect(label).toHaveAttribute('data-placement', 'left');
  });

  it('sets placement to "right" when index is not 0', () => {
    const { getByTestId } = render(<RangeTimeLabel index={1} />);
    const label = getByTestId('slider-time-label');
    expect(label).toHaveAttribute('data-placement', 'right');
  });

  it('passes through additional props to SliderTimeLabel', () => {
    const { getByTestId } = render(
      <RangeTimeLabel index={0} open value="10:30" />
    );
    const label = getByTestId('slider-time-label');
    expect(label).toHaveAttribute('open'); // Boolean props render as empty string
    expect(label).toHaveAttribute('value', '10:30');
  });

  it('handles index=2 as right placement', () => {
    const { getByTestId } = render(<RangeTimeLabel index={2} />);
    const label = getByTestId('slider-time-label');
    expect(label).toHaveAttribute('data-placement', 'right');
  });

  it('handles missing index prop', () => {
    const { getByTestId } = render(<RangeTimeLabel />);
    const label = getByTestId('slider-time-label');
    // When index is undefined, 0 === undefined is false, so placement should be 'right'
    expect(label).toHaveAttribute('data-placement', 'right');
  });
});
