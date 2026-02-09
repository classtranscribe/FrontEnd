import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CCFontColorsMenu from './CCFontColorsMenu';

// Mock CTPlayerConstants
jest.mock('../../../controllers', () => ({
  CTPlayerConstants: {
    CCColors: ['White', 'Black', 'Red', 'Yellow', 'Green', 'Cyan', 'Blue', 'Magenta'],
  },
}));

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

describe('CCFontColorsMenu', () => {
  const defaultProps = {
    fontColor: 'White',
    setCCFontColor: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CCFontColorsMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<CCFontColorsMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button', () => {
    render(<CCFontColorsMenu {...defaultProps} />);
    expect(screen.getByText('CC Font Color')).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<CCFontColorsMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('CC Font Color'));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all color options', () => {
    render(<CCFontColorsMenu {...defaultProps} />);

    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Yellow')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Cyan')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Magenta')).toBeInTheDocument();
  });

  it('marks current font color as active', () => {
    const { container } = render(<CCFontColorsMenu {...defaultProps} fontColor="Yellow" />);
    const activeButton = container.querySelector('[data-text="Yellow"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });

  it('does not mark other colors as active', () => {
    const { container } = render(<CCFontColorsMenu {...defaultProps} fontColor="White" />);
    const inactiveButton = container.querySelector('[data-text="Red"][data-active="false"]');
    expect(inactiveButton).toBeInTheDocument();
  });

  it('calls setCCFontColor when color clicked', () => {
    const mockSetCCFontColor = jest.fn();
    render(<CCFontColorsMenu {...defaultProps} setCCFontColor={mockSetCCFontColor} />);

    fireEvent.click(screen.getByText('Red'));

    expect(mockSetCCFontColor).toHaveBeenCalledWith('Red');
  });

  it('calls setCCFontColor with correct value for each color', () => {
    const mockSetCCFontColor = jest.fn();
    render(<CCFontColorsMenu {...defaultProps} setCCFontColor={mockSetCCFontColor} />);

    fireEvent.click(screen.getByText('Blue'));
    expect(mockSetCCFontColor).toHaveBeenCalledWith('Blue');

    fireEvent.click(screen.getByText('Green'));
    expect(mockSetCCFontColor).toHaveBeenCalledWith('Green');
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<CCFontColorsMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back button + 8 color options
    expect(buttons.length).toBe(9);
  });
});
