import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CCFontSizesMenu from './CCFontSizesMenu';

// Mock CTPlayerConstants
jest.mock('../../../controllers', () => ({
  CTPlayerConstants: {
    CCFontSizes: [0.75, 1, 1.25, 1.5, 1.75, 2],
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

describe('CCFontSizesMenu', () => {
  const defaultProps = {
    fontSize: 1,
    setCCFontSize: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CCFontSizesMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<CCFontSizesMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders back button', () => {
    render(<CCFontSizesMenu {...defaultProps} />);
    expect(screen.getByText('CC Font Size')).toBeInTheDocument();
  });

  it('calls onGoBack when back button clicked', () => {
    const mockOnGoBack = jest.fn();
    render(<CCFontSizesMenu {...defaultProps} onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('CC Font Size'));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all font size options', () => {
    render(<CCFontSizesMenu {...defaultProps} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('125%')).toBeInTheDocument();
    expect(screen.getByText('150%')).toBeInTheDocument();
    expect(screen.getByText('175%')).toBeInTheDocument();
    expect(screen.getByText('200%')).toBeInTheDocument();
  });

  it('marks current font size as active', () => {
    const { container } = render(<CCFontSizesMenu {...defaultProps} fontSize={1.25} />);
    const activeButton = container.querySelector('[data-text="125%"][data-active="true"]');
    expect(activeButton).toBeInTheDocument();
  });

  it('does not mark other sizes as active', () => {
    const { container } = render(<CCFontSizesMenu {...defaultProps} fontSize={1} />);
    const inactiveButton = container.querySelector('[data-text="150%"][data-active="false"]');
    expect(inactiveButton).toBeInTheDocument();
  });

  it('calls setCCFontSize when size clicked', () => {
    const mockSetCCFontSize = jest.fn();
    render(<CCFontSizesMenu {...defaultProps} setCCFontSize={mockSetCCFontSize} />);

    fireEvent.click(screen.getByText('150%'));

    expect(mockSetCCFontSize).toHaveBeenCalledWith(1.5);
  });

  it('calls setCCFontSize with correct value for each size', () => {
    const mockSetCCFontSize = jest.fn();
    render(<CCFontSizesMenu {...defaultProps} setCCFontSize={mockSetCCFontSize} />);

    fireEvent.click(screen.getByText('75%'));
    expect(mockSetCCFontSize).toHaveBeenCalledWith(0.75);

    fireEvent.click(screen.getByText('200%'));
    expect(mockSetCCFontSize).toHaveBeenCalledWith(2);
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<CCFontSizesMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // 1 back button + 6 font size options
    expect(buttons.length).toBe(7);
  });

  it('formats font sizes as percentages', () => {
    render(<CCFontSizesMenu {...defaultProps} />);
    // All sizes should be displayed as percentages
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
