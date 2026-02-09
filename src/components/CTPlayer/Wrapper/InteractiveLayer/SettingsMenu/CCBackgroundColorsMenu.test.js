import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CCBackgroundColorsMenu from './CCBackgroundColorsMenu';

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

describe('CCBackgroundColorsMenu', () => {
  const defaultProps = {
    backgroundColor: 'Black',
    setCCBackgroundColor: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CCBackgroundColorsMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<CCBackgroundColorsMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button', () => {
    render(<CCBackgroundColorsMenu {...defaultProps} />);
    expect(screen.getByText('CC Background Color')).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<CCBackgroundColorsMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('CC Background Color'));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all color options', () => {
    render(<CCBackgroundColorsMenu {...defaultProps} />);

    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Yellow')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Cyan')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Magenta')).toBeInTheDocument();
  });

  it('marks current background color as active', () => {
    const { container } = render(<CCBackgroundColorsMenu {...defaultProps} backgroundColor="Blue" />);
    const activeButton = container.querySelector('[data-text="Blue"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });

  it('does not mark other colors as active', () => {
    const { container } = render(<CCBackgroundColorsMenu {...defaultProps} backgroundColor="Black" />);
    const inactiveButton = container.querySelector('[data-text="White"][data-active="false"]');
    expect(inactiveButton).toBeInTheDocument();
  });

  it('calls setCCBackgroundColor when color clicked', () => {
    const mockSetCCBackgroundColor = jest.fn();
    render(<CCBackgroundColorsMenu {...defaultProps} setCCBackgroundColor={mockSetCCBackgroundColor} />);

    fireEvent.click(screen.getByText('Red'));

    expect(mockSetCCBackgroundColor).toHaveBeenCalledWith('Red');
  });

  it('calls setCCBackgroundColor with correct value for each color', () => {
    const mockSetCCBackgroundColor = jest.fn();
    render(<CCBackgroundColorsMenu {...defaultProps} setCCBackgroundColor={mockSetCCBackgroundColor} />);

    fireEvent.click(screen.getByText('Yellow'));
    expect(mockSetCCBackgroundColor).toHaveBeenCalledWith('Yellow');

    fireEvent.click(screen.getByText('Magenta'));
    expect(mockSetCCBackgroundColor).toHaveBeenCalledWith('Magenta');
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<CCBackgroundColorsMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back button + 8 color options
    expect(buttons.length).toBe(9);
  });
});
