import React from 'react';
import { render } from '@testing-library/react';
import SliderTimeLabel from './SliderTimeLabel';

// Mock Material-UI components
jest.mock('@material-ui/core/styles', () => ({
  makeStyles: jest.fn(() => () => ({
    tooltip: 'tooltip-class',
    arrow: 'arrow-class',
  })),
}));

jest.mock('@material-ui/core/Tooltip', () => {
  return function Tooltip({ children, open, title, placement, classes, arrow, ...props }) {
    return open ? (
      <div
        data-testid="tooltip"
        data-placement={placement}
        data-title={title}
        data-arrow={arrow ? 'true' : 'false'}
        className={classes.tooltip}
        {...props}
      >
        {children}
      </div>
    ) : (
      <div data-testid="tooltip-closed">{children}</div>
    );
  };
});

describe('SliderTimeLabel', () => {
  it('renders without crashing', () => {
    render(
      <SliderTimeLabel open={false} value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
  });

  it('renders children', () => {
    const { getByText } = render(
      <SliderTimeLabel open={false} value="10:30">
        <div>Test Child</div>
      </SliderTimeLabel>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('shows tooltip when open is true', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    expect(getByTestId('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip when open is false', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open={false} value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    expect(getByTestId('tooltip-closed')).toBeInTheDocument();
  });

  it('displays value in tooltip', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="15:45">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-title', '15:45');
  });

  it('uses default placement of "top"', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-placement', 'top');
  });

  it('accepts custom placement', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30" placement="bottom">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-placement', 'bottom');
  });

  it('enables arrow', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-arrow', 'true');
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip.className).toContain('tooltip-class');
  });

  it('handles different value types', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value={123}>
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-title', '123');
  });

  it('handles undefined value', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open>
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  it('has enterTouchDelay of 0', () => {
    const { getByTestId } = render(
      <SliderTimeLabel open value="10:30">
        <div>Child</div>
      </SliderTimeLabel>
    );
    const tooltip = getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('enterTouchDelay', '0');
  });
});
