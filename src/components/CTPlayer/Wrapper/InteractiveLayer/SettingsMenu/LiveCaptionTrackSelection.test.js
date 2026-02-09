import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveCaptionTrackSelection from './LiveCaptionTrackSelection';

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

describe('LiveCaptionTrackSelection', () => {
  const defaultProps = {
    englishTrack: { language: 'English' },
    textTracks: [
      { language: 'English' },
      { language: 'Spanish' },
      { language: 'French' },
    ],
    onGoBack: jest.fn(),
    setTextTrack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<LiveCaptionTrackSelection {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders go back button', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
    expect(screen.getByText('Caption Tracks')).toBeInTheDocument();
  });

  it('calls onGoBack when go back button is clicked', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
    const goBackButton = screen.getByText('Caption Tracks');
    fireEvent.click(goBackButton);
    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all text tracks', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('marks current track as active', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
    const englishButton = screen.getByText('English');
    expect(englishButton).toHaveAttribute('data-active', 'true');
  });

  it('calls setTextTrack with index when a track is clicked', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);
    const spanishButton = screen.getByText('Spanish');
    fireEvent.click(spanishButton);
    expect(defaultProps.setTextTrack).toHaveBeenCalledWith(1);
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<LiveCaptionTrackSelection {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(4); // 1 go back + 3 tracks
  });

  it('each track is clickable', () => {
    render(<LiveCaptionTrackSelection {...defaultProps} />);

    fireEvent.click(screen.getByText('English'));
    fireEvent.click(screen.getByText('Spanish'));
    fireEvent.click(screen.getByText('French'));

    expect(defaultProps.setTextTrack).toHaveBeenCalledTimes(3);
    expect(defaultProps.setTextTrack).toHaveBeenNthCalledWith(1, 0);
    expect(defaultProps.setTextTrack).toHaveBeenNthCalledWith(2, 1);
    expect(defaultProps.setTextTrack).toHaveBeenNthCalledWith(3, 2);
  });

  it('handles empty text tracks array', () => {
    const { container } = render(<LiveCaptionTrackSelection {...defaultProps} textTracks={[]} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1); // only go back button
  });

  it('handles single text track', () => {
    const singleTrackProps = {
      ...defaultProps,
      textTracks: [{ language: 'English' }],
    };
    render(<LiveCaptionTrackSelection {...singleTrackProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2); // go back + 1 track
  });

  it('marks different track as active when englishTrack changes', () => {
    const { rerender } = render(<LiveCaptionTrackSelection {...defaultProps} />);

    let englishButton = screen.getByText('English');
    let spanishButton = screen.getByText('Spanish');
    expect(englishButton).toHaveAttribute('data-active', 'true');
    expect(spanishButton).toHaveAttribute('data-active', 'false');

    rerender(
      <LiveCaptionTrackSelection
        {...defaultProps}
        englishTrack={{ language: 'Spanish' }}
      />
    );

    englishButton = screen.getByText('English');
    spanishButton = screen.getByText('Spanish');
    expect(englishButton).toHaveAttribute('data-active', 'false');
    expect(spanishButton).toHaveAttribute('data-active', 'true');
  });
});
