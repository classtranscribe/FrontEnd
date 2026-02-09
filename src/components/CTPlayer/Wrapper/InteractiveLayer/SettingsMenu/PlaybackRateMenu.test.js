import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaybackRateMenu from './PlaybackRateMenu';

// Mock MenuItem
jest.mock('./MenuItem', () => {
  return function MenuItem({ text, active, onClick, goBack, ...props }) {
    return (
      <button
        onClick={onClick}
        data-text={text}
        data-active={active}
        data-go-back={goBack}
        {...props}
      >
        {text}
      </button>
    );
  };
});

describe('PlaybackRateMenu', () => {
  const defaultProps = {
    playbackRate: 1,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    onGoBack: jest.fn(),
    setPlaybackRate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PlaybackRateMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<PlaybackRateMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button', () => {
    render(<PlaybackRateMenu {...defaultProps} />);
    expect(screen.getByText('Playback Rate')).toBeInTheDocument();
  });

  it('back button has goBack prop', () => {
    const { container } = render(<PlaybackRateMenu {...defaultProps} />);
    const backButton = container.querySelector('[data-go-back="true"]');
    expect(backButton).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<PlaybackRateMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('Playback Rate'));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all playback rate options', () => {
    render(<PlaybackRateMenu {...defaultProps} />);

    expect(screen.getByText('0.5')).toBeInTheDocument();
    expect(screen.getByText('0.75')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1.25')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('1.75')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('marks current playback rate as active', () => {
    const { container } = render(<PlaybackRateMenu {...defaultProps} playbackRate={1.5} />);
    const activeButton = container.querySelector('[data-text="1.5"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });

  it('does not mark other rates as active', () => {
    const { container } = render(<PlaybackRateMenu {...defaultProps} playbackRate={1} />);
    const inactiveButton = container.querySelector('[data-text="1.5"][data-active="false"]');
    expect(inactiveButton).toBeInTheDocument();
  });

  it('calls setPlaybackRate when rate clicked', () => {
    const mockSetPlaybackRate = jest.fn();
    render(<PlaybackRateMenu {...defaultProps} setPlaybackRate={mockSetPlaybackRate} />);

    fireEvent.click(screen.getByText('1.5'));

    expect(mockSetPlaybackRate).toHaveBeenCalledWith(1.5);
  });

  it('calls setPlaybackRate with correct value for each rate', () => {
    const mockSetPlaybackRate = jest.fn();
    render(<PlaybackRateMenu {...defaultProps} setPlaybackRate={mockSetPlaybackRate} />);

    fireEvent.click(screen.getByText('0.5'));
    expect(mockSetPlaybackRate).toHaveBeenCalledWith(0.5);

    fireEvent.click(screen.getByText('2'));
    expect(mockSetPlaybackRate).toHaveBeenCalledWith(2);
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<PlaybackRateMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back button + 7 rate options
    expect(buttons.length).toBe(8);
  });

  it('handles custom playbackRates array', () => {
    render(
      <PlaybackRateMenu
        {...defaultProps}
        playbackRates={[0.25, 1, 2.5]}
      />
    );

    expect(screen.getByText('0.25')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.queryByText('1.5')).not.toBeInTheDocument();
  });

  it('handles empty playbackRates array', () => {
    const { container } = render(
      <PlaybackRateMenu
        {...defaultProps}
        playbackRates={[]}
      />
    );
    const buttons = container.querySelectorAll('button');
    // Only back button
    expect(buttons.length).toBe(1);
  });

  it('converts numbers to strings for display', () => {
    render(<PlaybackRateMenu {...defaultProps} playbackRates={[1, 2, 3]} />);

    // Should convert to strings
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
