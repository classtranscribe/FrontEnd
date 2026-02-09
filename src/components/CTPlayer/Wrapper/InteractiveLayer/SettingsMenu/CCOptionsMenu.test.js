import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CCOptionsMenu from './CCOptionsMenu';

// Mock MenuItem
jest.mock('./MenuItem', () => {
  return function MenuItem({ text, current, onClick, goBack, isSubMenu, active, ...props }) {
    return (
      <button
        onClick={onClick}
        data-text={text}
        data-current={current}
        data-go-back={goBack}
        data-submenu={isSubMenu}
        data-active={active}
        {...props}
      >
        {text}: {current}
      </button>
    );
  };
});

describe('CCOptionsMenu', () => {
  const defaultProps = {
    fontSize: 1,
    fontColor: 'White',
    opacity: 0.75,
    backgroundColor: 'Black',
    onGoBack: jest.fn(),
    onOpenFontSizeMenu: jest.fn(),
    onOpenFontColorMenu: jest.fn(),
    onOpenOpacityMenu: jest.fn(),
    onOpenBackgroundColorMenu: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CCOptionsMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<CCOptionsMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button with text "CC Custom"', () => {
    render(<CCOptionsMenu {...defaultProps} />);
    expect(screen.getByText(/CC Custom/)).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<CCOptionsMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText(/CC Custom/));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders Font Size menu item', () => {
    render(<CCOptionsMenu {...defaultProps} fontSize={1.2} />);
    expect(screen.getByText(/Font Size/)).toBeInTheDocument();
    expect(screen.getByText(/120%/)).toBeInTheDocument();
  });

  it('Font Size item is a submenu', () => {
    const { container } = render(<CCOptionsMenu {...defaultProps} />);
    const fontSizeBtn = container.querySelector('[data-text="Font Size"]');
    expect(fontSizeBtn).toHaveAttribute('data-submenu', 'true');
  });

  it('Font Size item is active', () => {
    const { container } = render(<CCOptionsMenu {...defaultProps} />);
    const fontSizeBtn = container.querySelector('[data-text="Font Size"]');
    expect(fontSizeBtn).toHaveAttribute('data-active', 'true');
  });

  it('calls onOpenFontSizeMenu when Font Size clicked', () => {
    const mockOnOpenFontSizeMenu = jest.fn();
    render(<CCOptionsMenu {...defaultProps} onOpenFontSizeMenu={mockOnOpenFontSizeMenu} />);

    fireEvent.click(screen.getByText(/Font Size/));

    expect(mockOnOpenFontSizeMenu).toHaveBeenCalledTimes(1);
  });

  it('renders Font Color menu item', () => {
    render(<CCOptionsMenu {...defaultProps} fontColor="Yellow" />);
    expect(screen.getByText(/Font Color/)).toBeInTheDocument();
    expect(screen.getByText(/Yellow/)).toBeInTheDocument();
  });

  it('calls onOpenFontColorMenu when Font Color clicked', () => {
    const mockOnOpenFontColorMenu = jest.fn();
    render(<CCOptionsMenu {...defaultProps} onOpenFontColorMenu={mockOnOpenFontColorMenu} />);

    fireEvent.click(screen.getByText(/Font Color/));

    expect(mockOnOpenFontColorMenu).toHaveBeenCalledTimes(1);
  });

  it('renders Background Opacity menu item', () => {
    render(<CCOptionsMenu {...defaultProps} opacity={0.5} />);
    expect(screen.getByText(/Background Opacity/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('calls onOpenOpacityMenu when Background Opacity clicked', () => {
    const mockOnOpenOpacityMenu = jest.fn();
    render(<CCOptionsMenu {...defaultProps} onOpenOpacityMenu={mockOnOpenOpacityMenu} />);

    fireEvent.click(screen.getByText(/Background Opacity/));

    expect(mockOnOpenOpacityMenu).toHaveBeenCalledTimes(1);
  });

  it('renders Background Color menu item', () => {
    render(<CCOptionsMenu {...defaultProps} backgroundColor="Blue" />);
    expect(screen.getByText(/Background Color/)).toBeInTheDocument();
    expect(screen.getByText(/Blue/)).toBeInTheDocument();
  });

  it('calls onOpenBackgroundColorMenu when Background Color clicked', () => {
    const mockOnOpenBackgroundColorMenu = jest.fn();
    render(<CCOptionsMenu {...defaultProps} onOpenBackgroundColorMenu={mockOnOpenBackgroundColorMenu} />);

    fireEvent.click(screen.getByText(/Background Color/));

    expect(mockOnOpenBackgroundColorMenu).toHaveBeenCalledTimes(1);
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<CCOptionsMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back + 4 option items
    expect(buttons.length).toBe(5);
  });

  it('formats fontSize as percentage', () => {
    render(<CCOptionsMenu {...defaultProps} fontSize={0.8} />);
    expect(screen.getByText(/80%/)).toBeInTheDocument();
  });

  it('formats opacity as percentage', () => {
    render(<CCOptionsMenu {...defaultProps} opacity={1} fontSize={0.8} />);
    // Use getAllByText since fontSize might also be 100%
    const percentages = screen.getAllByText(/100%/);
    expect(percentages.length).toBeGreaterThan(0);
  });
});
