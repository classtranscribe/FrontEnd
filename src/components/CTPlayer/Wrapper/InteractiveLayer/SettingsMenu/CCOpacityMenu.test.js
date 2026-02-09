import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CCOpacityMenu from './CCOpacityMenu';

// Mock CTPlayerConstants
jest.mock('../../../controllers', () => ({
  CTPlayerConstants: {
    CCOpacities: ['0%', '25%', '50%', '75%', '100%'],
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

describe('CCOpacityMenu', () => {
  const defaultProps = {
    opacity: '100%',
    setCCOpacity: jest.fn(),
    onGoBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CCOpacityMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<CCOpacityMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders go back button', () => {
    render(<CCOpacityMenu {...defaultProps} />);
    expect(screen.getByText('CC Background Opacity')).toBeInTheDocument();
  });

  it('calls onGoBack when go back button is clicked', () => {
    render(<CCOpacityMenu {...defaultProps} />);
    const goBackButton = screen.getByText('CC Background Opacity');
    fireEvent.click(goBackButton);
    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders all opacity options', () => {
    render(<CCOpacityMenu {...defaultProps} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('marks current opacity as active', () => {
    const { container } = render(<CCOpacityMenu {...defaultProps} opacity="50%" />);
    const buttons = container.querySelectorAll('button');
    const activeButton = Array.from(buttons).find(btn => btn.getAttribute('data-active') === 'true');
    expect(activeButton).toHaveTextContent('50%');
  });

  it('calls setCCOpacity when an opacity is clicked', () => {
    render(<CCOpacityMenu {...defaultProps} />);
    const opacity25Button = screen.getByText('25%');
    fireEvent.click(opacity25Button);
    expect(defaultProps.setCCOpacity).toHaveBeenCalledWith('25%');
  });

  it('renders correct number of menu items', () => {
    const { container } = render(<CCOpacityMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(6); // 1 go back + 5 opacity options
  });

  it('each opacity option is clickable', () => {
    render(<CCOpacityMenu {...defaultProps} />);
    const opacities = ['0%', '25%', '50%', '75%', '100%'];

    opacities.forEach(opacity => {
      const button = screen.getByText(opacity);
      fireEvent.click(button);
    });

    expect(defaultProps.setCCOpacity).toHaveBeenCalledTimes(5);
  });
});
