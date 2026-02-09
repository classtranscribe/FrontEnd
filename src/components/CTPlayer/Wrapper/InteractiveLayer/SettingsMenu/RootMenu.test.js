import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RootMenu from './RootMenu';

// Mock CTPlayerConstants
jest.mock('../../../controllers', () => ({
  CTPlayerConstants: {
    ScreenModesMap: {
      'mode1': 'Mode 1',
      'mode2': 'Mode 2',
      'ps': 'Presentation & Slides',
    },
  },
}));

// Mock MenuItem
jest.mock('./MenuItem', () => {
  return function MenuItem({ text, current, isSubMenu, onClick, active, ...props }) {
    return (
      <button
        onClick={onClick}
        data-text={text}
        data-current={current}
        data-submenu={isSubMenu}
        data-active={active}
        {...props}
      >
        {text}: {current}
      </button>
    );
  };
});

describe('RootMenu', () => {
  const defaultProps = {
    live: false,
    isTwoScreen: false,
    screenMode: 'ps',
    playbackRate: 1,
    openPlaybackRateMenu: jest.fn(),
    openLiveCaptionMenu: jest.fn(),
    onOpenLiveTextTrackSelection: jest.fn(),
    onOpenScreenModeMenu: jest.fn(),
    fontSize: 'normal',
    englishTrack: { language: 'English' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RootMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<RootMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders Playback Rate menu item', () => {
    render(<RootMenu {...defaultProps} playbackRate={1.5} />);
    expect(screen.getByText(/Playback Rate/)).toBeInTheDocument();
    expect(screen.getByText(/1.5x/)).toBeInTheDocument();
  });

  it('renders Caption Language menu item', () => {
    render(<RootMenu {...defaultProps} englishTrack={{ language: 'Spanish' }} />);
    expect(screen.getByText(/Caption Language/)).toBeInTheDocument();
    expect(screen.getByText(/Spanish/)).toBeInTheDocument();
  });

  it('calls openPlaybackRateMenu when Playback Rate clicked', () => {
    const mockOpenPlaybackRateMenu = jest.fn();
    render(<RootMenu {...defaultProps} openPlaybackRateMenu={mockOpenPlaybackRateMenu} />);

    fireEvent.click(screen.getByText(/Playback Rate/));

    expect(mockOpenPlaybackRateMenu).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenLiveTextTrackSelection when Caption Language clicked', () => {
    const mockOnOpenLiveTextTrackSelection = jest.fn();
    render(
      <RootMenu {...defaultProps} onOpenLiveTextTrackSelection={mockOnOpenLiveTextTrackSelection} />
    );

    fireEvent.click(screen.getByText(/Caption Language/));

    expect(mockOnOpenLiveTextTrackSelection).toHaveBeenCalledTimes(1);
  });

  it('shows Live Caption Font Size when live is true', () => {
    render(<RootMenu {...defaultProps} live fontSize="large" />);
    expect(screen.getByText(/Live Caption Font Size/)).toBeInTheDocument();
    expect(screen.getByText(/large/)).toBeInTheDocument();
  });

  it('does not show Live Caption Font Size when live is false', () => {
    render(<RootMenu {...defaultProps} live={false} />);
    expect(screen.queryByText(/Live Caption Font Size/)).not.toBeInTheDocument();
  });

  it('calls openLiveCaptionMenu when Live Caption Font Size clicked', () => {
    const mockOpenLiveCaptionMenu = jest.fn();
    render(
      <RootMenu {...defaultProps} live openLiveCaptionMenu={mockOpenLiveCaptionMenu} />
    );

    fireEvent.click(screen.getByText(/Live Caption Font Size/));

    expect(mockOpenLiveCaptionMenu).toHaveBeenCalledTimes(1);
  });

  it('defaults fontSize to "normal" when null', () => {
    render(<RootMenu {...defaultProps} live fontSize={null} />);
    expect(screen.getByText(/normal/)).toBeInTheDocument();
  });

  it('shows Screen Mode when isTwoScreen is true', () => {
    render(<RootMenu {...defaultProps} isTwoScreen screenMode="ps" />);
    expect(screen.getByText(/Screen Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Presentation & Slides/)).toBeInTheDocument();
  });

  it('does not show Screen Mode when isTwoScreen is false', () => {
    render(<RootMenu {...defaultProps} isTwoScreen={false} />);
    expect(screen.queryByText(/Screen Mode/)).not.toBeInTheDocument();
  });

  it('calls onOpenScreenModeMenu when Screen Mode clicked', () => {
    const mockOnOpenScreenModeMenu = jest.fn();
    render(
      <RootMenu
        {...defaultProps}
        isTwoScreen
        onOpenScreenModeMenu={mockOnOpenScreenModeMenu}
      />
    );

    fireEvent.click(screen.getByText(/Screen Mode/));

    expect(mockOnOpenScreenModeMenu).toHaveBeenCalledTimes(1);
  });

  it('maps screen mode using ScreenModesMap', () => {
    render(<RootMenu {...defaultProps} isTwoScreen screenMode="mode1" />);
    expect(screen.getByText(/Mode 1/)).toBeInTheDocument();
  });

  it('displays correct playback rate format', () => {
    render(<RootMenu {...defaultProps} playbackRate={2} />);
    expect(screen.getByText(/2x/)).toBeInTheDocument();
  });

  it('shows only 2 items when live and isTwoScreen are false', () => {
    const { container } = render(<RootMenu {...defaultProps} live={false} isTwoScreen={false} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2); // Playback Rate + Caption Language
  });

  it('shows 3 items when live is true', () => {
    const { container } = render(<RootMenu {...defaultProps} live isTwoScreen={false} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3); // + Live Caption Font Size
  });

  it('shows 3 items when isTwoScreen is true', () => {
    const { container } = render(<RootMenu {...defaultProps} live={false} isTwoScreen />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3); // + Screen Mode
  });

  it('shows 4 items when both live and isTwoScreen are true', () => {
    const { container } = render(<RootMenu {...defaultProps} live isTwoScreen />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(4); // All items
  });

  it('handles undefined fontSize', () => {
    render(<RootMenu {...defaultProps} live fontSize={undefined} />);
    expect(screen.getByText(/normal/)).toBeInTheDocument();
  });

  it('handles empty englishTrack language', () => {
    render(<RootMenu {...defaultProps} englishTrack={{ language: '' }} />);
    expect(screen.getByText(/Caption Language/)).toBeInTheDocument();
  });
});
