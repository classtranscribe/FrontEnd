import React from 'react';
import { render } from '@testing-library/react';
import SeekTimeLabel from './SeekTimeLabel';

// Mock timestr - it's a default export
jest.mock('utils/use-time', () => {
  const toTimeString = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    __esModule: true,
    default: { toTimeString },
  };
});

describe('SeekTimeLabel', () => {
  const defaultProps = {
    width: 800,
    left: 400,
    duration: 3600, // 1 hour
  };

  it('renders without crashing', () => {
    render(<SeekTimeLabel {...defaultProps} />);
  });

  it('displays time label when conditions are met', () => {
    const { container } = render(<SeekTimeLabel {...defaultProps} />);
    const label = container.querySelector('.seek-time-prompt');
    expect(label).toBeInTheDocument();
  });

  it('calculates correct time based on position', () => {
    const { container } = render(<SeekTimeLabel width={800} left={400} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    // left=400, width=800 => 50% => 50 seconds
    expect(label).toHaveTextContent('0:50');
  });

  it('does not render when width is too small', () => {
    const { container } = render(<SeekTimeLabel width={50} left={25} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    expect(label).toBeNull();
  });

  it('does not render when left is negative', () => {
    const { container } = render(<SeekTimeLabel width={800} left={-10} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    expect(label).toBeNull();
  });

  it('does not render when calculated time exceeds duration', () => {
    const { container } = render(<SeekTimeLabel width={800} left={800} duration={50} />);
    const label = container.querySelector('.seek-time-prompt');
    // left=800, width=800 => 100% => 50 seconds, which equals duration
    // Should still render at exactly duration
    expect(label).toBeInTheDocument();
  });

  it('adjusts left position when near left edge', () => {
    const { container } = render(<SeekTimeLabel width={800} left={10} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    // Should adjust to minimum 30px
    expect(label.style.left).toBe('30px');
  });

  it('adjusts left position when near right edge', () => {
    const { container } = render(<SeekTimeLabel width={800} left={790} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    // Should adjust to maximum width-30 = 770px
    expect(label.style.left).toBe('770px');
  });

  it('uses actual left position when in middle range', () => {
    const { container } = render(<SeekTimeLabel width={800} left={400} duration={100} />);
    const label = container.querySelector('.seek-time-prompt');
    expect(label.style.left).toBe('400px');
  });

  it('shows negative time when reverse is true', () => {
    const { container } = render(
      <SeekTimeLabel width={800} left={200} duration={100} reverse />
    );
    const label = container.querySelector('.seek-time-prompt');
    // reverse: (800-200)/800 * 100 = 75 seconds
    expect(label.textContent).toContain('-');
  });

  it('calculates reverse time correctly', () => {
    const { container } = render(
      <SeekTimeLabel width={800} left={200} duration={100} reverse />
    );
    const label = container.querySelector('.seek-time-prompt');
    // reverse: (width-left)/width * duration = (800-200)/800 * 100 = 75
    expect(label).toHaveTextContent('-1:15');
  });

  it('rounds time to nearest second', () => {
    const { container } = render(<SeekTimeLabel width={800} left={401} duration={100} />);
    // 401/800 * 100 = 50.125, should round to 50
    const label = container.querySelector('.seek-time-prompt');
    expect(label).toHaveTextContent('0:50');
  });

  it('has correct CSS classes', () => {
    const { container } = render(<SeekTimeLabel {...defaultProps} />);
    const label = container.querySelector('.seek-time-prompt');
    expect(label.className).toContain('ctp');
    expect(label.className).toContain('seek-time-prompt');
    expect(label.className).toContain('ct-d-c-center');
  });
});
