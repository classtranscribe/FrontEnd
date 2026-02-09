import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveCaptionMenu from './LiveCaptionMenu';

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

describe('LiveCaptionMenu', () => {
  const defaultProps = {
    fontSize: 'normal',
    setFontSize: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LiveCaptionMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<LiveCaptionMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders go back button', () => {
    render(<LiveCaptionMenu {...defaultProps} />);
    expect(screen.getByText('Live Caption Font Size')).toBeInTheDocument();
  });

  it('calls onGoBack when go back button is clicked', () => {
    render(<LiveCaptionMenu {...defaultProps} />);
    const goBackButton = screen.getByText('Live Caption Font Size');
    fireEvent.click(goBackButton);
    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all font size options', () => {
    render(<LiveCaptionMenu {...defaultProps} />);
    expect(screen.getByText('small')).toBeInTheDocument();
    expect(screen.getByText('normal')).toBeInTheDocument();
    expect(screen.getByText('large')).toBeInTheDocument();
  });

  it('marks current font size as active', () => {
    render(<LiveCaptionMenu {...defaultProps} fontSize="large" />);
    const largeButton = screen.getByText('large');
    expect(largeButton).toHaveAttribute('data-active', 'true');
  });

  it('calls setFontSize when a font size is clicked', () => {
    render(<LiveCaptionMenu {...defaultProps} />);
    const smallButton = screen.getByText('small');
    fireEvent.click(smallButton);
    expect(defaultProps.setFontSize).toHaveBeenCalledWith('small');
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<LiveCaptionMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(4); // 1 go back + 3 font sizes
  });

  it('each font size is clickable', () => {
    render(<LiveCaptionMenu {...defaultProps} />);

    fireEvent.click(screen.getByText('small'));
    fireEvent.click(screen.getByText('normal'));
    fireEvent.click(screen.getByText('large'));

    expect(defaultProps.setFontSize).toHaveBeenCalledTimes(3);
    expect(defaultProps.setFontSize).toHaveBeenCalledWith('small');
    expect(defaultProps.setFontSize).toHaveBeenCalledWith('normal');
    expect(defaultProps.setFontSize).toHaveBeenCalledWith('large');
  });

  it('only marks selected font size as active', () => {
    render(<LiveCaptionMenu {...defaultProps} fontSize="small" />);

    const smallButton = screen.getByText('small');
    const normalButton = screen.getByText('normal');
    const largeButton = screen.getByText('large');

    expect(smallButton).toHaveAttribute('data-active', 'true');
    expect(normalButton).toHaveAttribute('data-active', 'false');
    expect(largeButton).toHaveAttribute('data-active', 'false');
  });
});
