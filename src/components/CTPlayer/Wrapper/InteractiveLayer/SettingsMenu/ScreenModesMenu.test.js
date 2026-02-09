import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScreenModesMenu from './ScreenModesMenu';

// Mock CTPlayerConstants
jest.mock('../../../controllers', () => ({
  CTPlayerConstants: {
    ScreenModeNormal: 'normal',
    ScreenModeNested: 'nested',
    ScreenModesMap: {
      'normal': 'Normal',
      'nested': 'Nested',
    },
  },
}));

// Mock MenuItem
jest.mock('./MenuItem', () => {
  return function MenuItem({ text, active, onClick, goBack, bordered, ...props }) {
    return (
      <button
        onClick={onClick}
        data-text={text}
        data-active={active}
        data-go-back={goBack}
        data-bordered={bordered}
        {...props}
      >
        {text}
      </button>
    );
  };
});

describe('ScreenModesMenu', () => {
  const defaultProps = {
    screenMode: 'normal',
    setScreenMode: jest.fn(),
    onSwapScreens: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ScreenModesMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button', () => {
    render(<ScreenModesMenu {...defaultProps} />);
    expect(screen.getByText('Screen Mode')).toBeInTheDocument();
  });

  it('back button has goBack prop', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} />);
    const backButton = container.querySelector('[data-go-back="true"]');
    expect(backButton).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<ScreenModesMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('Screen Mode'));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders Swap Screens button', () => {
    render(<ScreenModesMenu {...defaultProps} />);
    expect(screen.getByText('Swap Screens')).toBeInTheDocument();
  });

  it('Swap Screens button has bordered prop', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} />);
    const swapButton = container.querySelector('[data-text="Swap Screens"]');
    expect(swapButton).toHaveAttribute('data-bordered', 'true');
  });

  it('calls onSwapScreens when Swap Screens clicked', () => {
    const mockOnSwapScreens = jest.fn();
    render(<ScreenModesMenu {...defaultProps} onSwapScreens={mockOnSwapScreens} />);

    fireEvent.click(screen.getByText('Swap Screens'));

    expect(mockOnSwapScreens).toHaveBeenCalledTimes(1);
  });

  it('renders Normal mode option', () => {
    render(<ScreenModesMenu {...defaultProps} />);
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('renders Nested mode option', () => {
    render(<ScreenModesMenu {...defaultProps} />);
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('marks current screen mode as active', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} screenMode="normal" />);
    const activeButton = container.querySelector('[data-text="Normal"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });

  it('does not mark other modes as active', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} screenMode="normal" />);
    const inactiveButton = container.querySelector('[data-text="Nested"][data-active="false"]');
    expect(inactiveButton).toBeInTheDocument();
  });

  it('calls setScreenMode when Normal clicked', () => {
    const mockSetScreenMode = jest.fn();
    render(<ScreenModesMenu {...defaultProps} setScreenMode={mockSetScreenMode} />);

    fireEvent.click(screen.getByText('Normal'));

    expect(mockSetScreenMode).toHaveBeenCalledWith('normal');
  });

  it('calls setScreenMode when Nested clicked', () => {
    const mockSetScreenMode = jest.fn();
    render(<ScreenModesMenu {...defaultProps} setScreenMode={mockSetScreenMode} />);

    fireEvent.click(screen.getByText('Nested'));

    expect(mockSetScreenMode).toHaveBeenCalledWith('nested');
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back button + 1 swap button + 2 mode options
    expect(buttons.length).toBe(4);
  });

  it('uses ScreenModesMap for mode text', () => {
    render(<ScreenModesMenu {...defaultProps} />);
    // Should display mapped values, not the mode keys
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('handles nested mode selection', () => {
    const { container } = render(<ScreenModesMenu {...defaultProps} screenMode="nested" />);
    const activeButton = container.querySelector('[data-text="Nested"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });
});
